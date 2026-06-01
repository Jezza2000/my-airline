import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isValidRoute } from '@/lib/schedules';

// GET /api/flights?orig=NZNE&dest=YSSY&from=2026-06-01&to=2026-06-30
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orig = searchParams.get('orig');
  const dest = searchParams.get('dest');
  const from = searchParams.get('from');
  const to   = searchParams.get('to');

  if (!orig || !dest) {
    return NextResponse.json({ error: 'orig and dest are required' }, { status: 400 });
  }

  if (!isValidRoute(orig, dest)) {
    return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
  }

  const fromDate = from ? new Date(from + 'T00:00:00Z') : new Date();
  const toDate   = to   ? new Date(to   + 'T23:59:59Z') : new Date(Date.now() + 90 * 86400000);

  try {
    const client = await clientPromise;
    const db = client.db('airline');

    const flights = await db.collection('schedules').find(
      {
        orig,
        dest,
        depDate: { $gte: fromDate, $lte: toDate },
        $expr: { $lt: [{ $size: '$bookings' }, '$seats'] }, // available only
      },
      {
        projection: { flightNo: 1, aircraft: 1, orig: 1, dest: 1,
                      depDate: 1, arrDate: 1, seats: 1,
                      available: { $subtract: ['$seats', { $size: '$bookings' }] } },
        sort: { depDate: 1 },
        limit: 20,
      }
    ).toArray();

    // Compute available seats manually (projection $subtract not supported in all drivers)
    const result = flights.map(f => ({
      ...f,
      _id: f._id.toString(),
      available: f.seats - (f.bookings?.length ?? 0),
      bookings: undefined, // never send booking IDs to client
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}