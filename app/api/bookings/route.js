import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// POST /api/bookings
// Body: { flightId, firstname, lastname, email, title?, gender? }
export async function POST(request) {
  const body = await request.json();
  const { flightId, firstname, lastname, email } = body;

  if (!flightId || !firstname || !lastname || !email) {
    return NextResponse.json({ error: 'flightId, firstname, lastname and email are required' }, { status: 400 });
  }

  if (!email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  let scheduleId;
  try {
    scheduleId = new ObjectId(flightId);
  } catch {
    return NextResponse.json({ error: 'Invalid flightId' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('airline');

    // 1. Find or create the passenger
    const passengersCol = db.collection('passengers');
    let passenger = await passengersCol.findOne({ email });

    if (!passenger) {
      const inserted = await passengersCol.insertOne({ firstname, lastname, email });
      passenger = { _id: inserted.insertedId, firstname, lastname, email };
    }

    // 2. Atomically add passenger to flight — only if seats remain
    const result = await db.collection('schedules').findOneAndUpdate(
      {
        _id: scheduleId,
        $expr: { $lt: [{ $size: '$bookings' }, '$seats'] },
        bookings: { $ne: passenger._id }, // prevent duplicate booking
      },
      { $push: { bookings: passenger._id } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Flight is full or booking already exists' },
        { status: 409 }
      );
    }

    // 3. Generate a readable reference
    const ref = 'JH' + Math.random().toString(36).substring(2, 8).toUpperCase();

    return NextResponse.json({
      success: true,
      reference: ref,
      passengerId: passenger._id.toString(),
      flightNo: result.flightNo,
      orig: result.orig,
      dest: result.dest,
      depDate: result.depDate,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}