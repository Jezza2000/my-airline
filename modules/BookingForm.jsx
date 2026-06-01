'use client';
import { useState } from 'react';

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

export default function BookingForm({ flight, onSuccess }) {
  const [firstname, setFirstname] = useState('');
  const [lastname,  setLastname]  = useState('');
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit() {
    if (!firstname || !lastname || !email) { setError('All fields are required.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: flight._id, firstname, lastname, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Booking failed.'); }
      else {
        onSuccess({ ...data, firstname, lastname });
        setFirstname(''); setLastname(''); setEmail('');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-panel visible">
      <div className="section-label">Passenger Details</div>
      <div className="flight-summary">
        <strong>{flight.flightNo}</strong> &nbsp;·&nbsp;
        {AIRPORTS[flight.orig]} → {AIRPORTS[flight.dest]}<br />
        Departs: {formatNZT(flight.depDate)} &nbsp;·&nbsp;
        Aircraft: {flight.aircraft}
      </div>
      <div className="booking-grid">
        <div className="field-group">
          <label>First name</label>
          <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="e.g. Aroha" />
        </div>
        <div className="field-group">
          <label>Last name</label>
          <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} placeholder="e.g. Tane" />
        </div>
        <div className="field-group" style={{ gridColumn: '1/-1' }}>
          <label>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <button className="confirm-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </div>
  );
}