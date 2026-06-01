import {useState} from "react";

const AIRPORTS = ["NZNE", "YSSY", "NZRO", "NZGB", "NZCI", "NZTL"];

export default function FlightSearch () {
  const [from, setFrom] = useState("NZNE");
  const [to, setTo] = useState("YSSY");

    const handleSubmit = (e) => {
    e.preventDefault();
    alert(`From: ${from} → To: ${to}`);
  };

  return (
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <select value={from} onChange={(e) => setFrom(e.target.value)} required>
            <option value="">Select airport</option>
            {AIRPORTS.map((code) => (
                <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>

        <label>
          To:
          <select value={to} onChange={(e) => setTo(e.target.value)} required>
            <option value="">Select airport</option>
            {AIRPORTS.map((code) => (
                <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>

        <button type="submit">Search</button>
      </form>
  );
}