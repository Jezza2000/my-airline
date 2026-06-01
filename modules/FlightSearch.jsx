'use client';
import { useState } from 'react';

const AIRPORT_OPTIONS = [
  { code: 'NZNE', label: 'Dairy Flat (NZNE)' },
  { code: 'YSSY', label: 'Sydney Kingsford Smith (YSSY)' },
  { code: 'NZRO', label: 'Rotorua (NZRO)' },
  { code: 'NZGB', label: 'Great Barrier Island (NZGB)' },
  { code: 'NZCI', label: 'Chatham Islands — Tuuta (NZCI)' },
  { code: 'NZTL', label: 'Lake Tekapo (NZTL)' },
];

export default function FlightSearch({ onResults }) {
  const [orig,     setOrig]     = useState('NZNE');
  const [dest,     setDest]     = useState('YSSY');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo,   setDateTo]   = useState('2026-06-30');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSearch() {
    if (orig === dest) { setError('Origin and destination cannot be the same.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(
        `/api/flights?orig=${orig}&dest=${dest}&from=${dateFrom}&to=${dateTo}`
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Search failed.'); onResults([]); }
      else onResults(data);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="section-label">Search Flights</div>
      <div className="search-grid">
        <div className="field-group">
          <label>From</label>
          <select value={orig} onChange={e => setOrig(e.target.value)}>
            {AIRPORT_OPTIONS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label>To</label>
          <select value={dest} onChange={e => setDest(e.target.value)}>
            {AIRPORT_OPTIONS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label>Departure from</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div className="field-group">
          <label>Departure to</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <button className="search-btn" onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Available Flights'}
      </button>
    </div>
  );
}