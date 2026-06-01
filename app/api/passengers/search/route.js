import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const passenger = await db.collection('passengers')
      .findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    console.log('Passenger found:', passenger);
    console.log('Passenger _id:', passenger._id, typeof passenger._id);

    if (!passenger) {
      return NextResponse.json({ error: 'Passenger not found.' }, { status: 404 });
    }

    const allFlights = await db.collection('schedules').find({}).toArray();
    console.log('All flights bookings arrays:', allFlights.map(f => ({ flightNo: f.flightNo, bookings: f.bookings })));

    const bookings = await db.collection('schedules')
      .find({ bookings: new ObjectId(passenger._id) })
      .sort({ depDate: 1 })
      .toArray();

    console.log('Bookings found:', bookings.length);

    return NextResponse.json({ passenger, bookings });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}