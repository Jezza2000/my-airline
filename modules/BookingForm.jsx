'use client';
import { useState } from 'react';

const AIRPORTS = {
  NZNE: 'Dairy Flat', YSSY: 'Sydney', NZRO: 'Rotorua',
  NZGB: 'Great Barrier Island', NZCI: 'Chatham Islands', NZTL: 'Lake Tekapo',
};

const TITLES = ['Mr', 'Ms', 'Mrs', 'Miss', 'Sir', 'Dame', 'Doctor'];

const GENDERS = [
  { label: 'Male',   value: 'm' },
  { label: 'Female', value: 'f' },
];

function formatNZT(dateStr) {
  return new Date(dateStr).toLocaleString('en-NZ', {
    timeZone: 'Pacific/Auckland',
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}



export default function BookingForm({ flight, onSuccess }) {
  const [title,     setTitle]     = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname,  setLastname]  = useState('');
  const [gender,    setGender]    = useState('');
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit() {
    if (!title || !firstname || !lastname || !gender || !email) { setError('All fields are required.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: flight._id, title, firstname, lastname, gender, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Booking failed.'); }
      else {
        onSuccess({ ...data, title, firstname, lastname });
        setTitle(''); setFirstname(''); setLastname(''); setGender(''); setEmail('');
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
        <strong>{flight.flightNo}</strong> &nbsp;
        {AIRPORTS[flight.orig]} to {AIRPORTS[flight.dest]}<br />
        Departs: {formatNZT(flight.depDate)} &nbsp;
        Aircraft: {flight.aircraft}
      </div>
      <div className="booking-grid">
        <div className="field-group">
          <label>Title: </label>
          <select value={title} onChange={e => setTitle(e.target.value)}>
            <option value="" disabled>Select…</option>
            {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label>First name: </label>
          <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} placeholder="e.g. John" />
        </div>
        <div className="field-group">
          <label>Last name: </label>
          <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} placeholder="e.g. Smith" />
        </div>
        <div className="field-group">
          <label>Gender: </label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="" disabled>Select…</option>
            {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div className="field-group" style={{ gridColumn: '1/-1' }}>
          <label>Email address: </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <h2>
        <button className="confirm-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </h2>
    </div>
  );
}