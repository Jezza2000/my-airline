import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  const body = await request.json();
  const { flightId, title, firstname, lastname, gender, email } = body;

  if (!title || !flightId || !firstname || !lastname || !gender || !email) {
    return NextResponse.json({ error: 'flightId, title, firstname, lastname, gender and email are required' }, { status: 400 });
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

    //Searches for passenger if already in database or creates new passenger
    const passengersCol = db.collection('passengers');
    let passenger = await passengersCol.findOne({ email });

    if (!passenger) {
      const inserted = await passengersCol.insertOne({ title, firstname, lastname, gender, email });
      passenger = { _id: inserted.insertedId, title, firstname, lastname, gender, email };
    }

    // add passenger to flight
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

    //display reference WIP

    return NextResponse.json({
      success: true,
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