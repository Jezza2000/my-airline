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

export default function SuccessBanner({ booking }) {
  return (
    <div className="success-banner visible">
      <h2 className="success-title">Booking Confirmed</h2>
      <div className="success-detail">
        Booking confirmed for <strong>{booking.firstname} {booking.lastname}</strong><br />
        {AIRPORTS[booking.orig]} to {AIRPORTS[booking.dest]} {booking.flightNo}<br />
        {formatNZT(booking.depDate)}<br />
      </div>
    </div>
  );
}