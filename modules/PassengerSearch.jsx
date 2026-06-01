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

export default function PassengerSearch() {
  const [email,     setEmail]     = useState('');
  const [passenger, setPassenger] = useState(null);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [searched,  setSearched]  = useState(false);

  async function handleSearch() {
    const trimmed = email.trim();
    if (!trimmed) { setError('Please enter an email address.'); return; }
    setError('');
    setLoading(true);
    setSearched(false);
    setPassenger(null);
    setBookings([]);

    try {
      const res  = await fetch(`/api/passengers/search?email=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Search failed.');
      } else {
        setPassenger(data.passenger);
        setBookings(data.bookings);
        setSearched(true);
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  const [cancelling, setCancelling] = useState(null);

  async function handleCancel(flightId) {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(flightId);
    try {
      const res = await fetch('/api/passengers/cancel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId, passengerId: passenger._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Cancellation failed.');
      } else {
        setBookings(prev => prev.filter(f => f._id !== flightId));
      }
    } catch {
      alert('Network error — please try again.');
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div>
      <h2>Passenger Lookup</h2>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder="passenger@example.com"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>

      {error && <p>{error}</p>}

      {searched && !passenger && <p>No passenger found for <em>{email}</em>.</p>}

      {passenger && (
        <>
          <p>
            <strong>{passenger.title} {passenger.firstname} {passenger.lastname}</strong>
            &nbsp;·&nbsp;{passenger.gender === 'm' ? 'Male' : 'Female'}
            &nbsp;·&nbsp;{passenger.email}
          </p>

          {bookings.length === 0 ? (
            <p>No current bookings.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Aircraft</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(f => (
                  <tr key={f._id}>
                    <td>{f.flightNo}</td>
                    <td>{f.aircraft}</td>
                    <td>{AIRPORTS[f.orig] ?? f.orig}</td>
                    <td>{AIRPORTS[f.dest] ?? f.dest}</td>
                    <td>{formatNZT(f.depDate)}</td>
                    <td>{formatNZT(f.arrDate)}</td>
                    <td>
                      <button
                        onClick={() => handleCancel(f._id)}
                        disabled={cancelling === f._id}
                      >
                        {cancelling === f._id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}