const AIRPORTS = {
  NZNE: 'Dairy Flat', YSSY: 'Sydney', NZRO: 'Rotorua',
  NZGB: 'Great Barrier Island', NZCI: 'Chatham Islands', NZTL: 'Lake Tekapo',
};

const TIMEZONES = {
  NZNE: 'Pacific/Auckland',
  NZRO: 'Pacific/Auckland',
  NZGB: 'Pacific/Auckland',
  NZCI: 'Pacific/Chatham',
  NZTL: 'Pacific/Auckland',
  YSSY: 'Australia/Sydney',
};

function getPrice(seats, available) {
  const pct = available / seats;
  if (pct > 0.7) return 299;
  if (pct > 0.4) return 399;
  if (pct > 0.2) return 499;
  return 599;
}

function formatWithTimezone(dateStr, timezone) {
  return new Date(dateStr).toLocaleString('en-AU', {
    timeZone: timezone,
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function FlightCard({ flight, selected, onSelect }) {
  const seatsClass = flight.available <= 1 ? 'seats-low' : 'seats-ok';
  const price = getPrice(flight.seats, flight.available);
  return (
    <div
      className={`flight-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(flight)}
    >
      <div>
        <div className="flight-iata">{flight.flightNo}: {flight.orig} to {flight.dest}</div>
        <div className="flight-time">Departure: {formatWithTimezone(flight.depDate, TIMEZONES[flight.orig])}</div>
        <div className="flight-time">Arrival: {formatWithTimezone(flight.arrDate, TIMEZONES[flight.dest])}</div>
      </div>
      <div className={`${seatsClass} flight-seats`}>
        {flight.available} seat{flight.available !== 1 ? 's' : ''} — ${price}
      </div>
    </div>
  );
}