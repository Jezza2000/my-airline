import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request) {
  const { flightId, passengerId } = await request.json();

  if (!flightId || !passengerId) {
    return NextResponse.json({ error: 'Missing flightId or passengerId.' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection('schedules').updateOne(
      { _id: new ObjectId(flightId) },
      { $pull: { bookings: new ObjectId(passengerId) } }
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}