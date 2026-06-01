const AIRPORTS = {
  NZNE: 'Dairy Flat', YSSY: 'Sydney', NZRO: 'Rotorua',
  NZGB: 'Great Barrier Island', NZCI: 'Chatham Islands', NZTL: 'Lake Tekapo',
};

function formatNZT(dateStr) {
  return new Date(dateStr).toLocaleString('en-NZ', {
    timeZone: 'Pacific/Auckland',
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function FlightCard({ flight, selected, onSelect }) {
  const seatsClass = flight.available <= 1 ? 'seats-low' : 'seats-ok';
  return (
    <div
      className={`flight-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(flight)}
    >
      <div>
        <div className="flight-iata">{flight.orig}</div>
        <div className="flight-time">{formatNZT(flight.depDate)}</div>
      </div>
      <div>
        <div className="flight-no">{flight.flightNo}</div>
        <div className="flight-arrow">→</div>
        <div className="flight-no">{flight.aircraft.split(' ')[0]}</div>
      </div>
      <div>
        <div className="flight-iata">{flight.dest}</div>
        <div className="flight-time">{formatNZT(flight.arrDate)}</div>
      </div>
      <div className={`${seatsClass} flight-seats`}>
        {flight.available} seat{flight.available !== 1 ? 's' : ''}
      </div>
    </div>
  );
}