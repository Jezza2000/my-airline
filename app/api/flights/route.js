import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { isValidRoute } from '@/lib/schedules';


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const orig = searchParams.get('orig');
    const dest = searchParams.get('dest');
    const startDate = searchParams.get('from');
    const endDate   = searchParams.get('to');

    if (!orig || !dest) { //checks for blank
        return NextResponse.json({ error: 'origin and destination are required' }, { status: 400 });
    }

    if (!isValidRoute(orig, dest)) { //checks against the valid route table
        return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
    }

    const firstDate = startDate ? new Date(from + 'T00:00:00Z') : new Date();
    const lastDate   = endDate   ? new Date(to   + 'T23:59:59Z') : new Date(Date.now() + 90 * 86400000);

    try {
        const client = await clientPromise;
        const db = client.db('airline');

        const flights = await db.collection('schedules').find(
            {
                startDate,
                endDate,
                depDate: { $gte: firstDate, $lte: lastDate },
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