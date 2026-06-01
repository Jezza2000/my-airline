'use client';
import { useState } from 'react';
import FlightSearch from "@/modules/FlightSearch";
import FlightCard from "@/modules/FlightCard";
import BookingForm from "@/modules/BookingForm";
import SuccessBanner from "@/modules/SuccessBanner";

export default function Home() {

    const [flights,        setFlights]        = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [booking,        setBooking]        = useState(null);
    const [searched,       setSearched]       = useState(false);

      function handleResults(results) {
          setFlights(results);
          setSelectedFlight(null);
          setBooking(null);
          setSearched(true);
      }

      function handleSelect(flight) {
          setSelectedFlight(flight);
          setBooking(null);
      }

      function handleSuccess(bookingResult) {
          setBooking(bookingResult);
          setSelectedFlight(null);
      }

      return (
          <div className="main">
              <div className="intro">
                  <h1>Jeremy Airlines</h1>

                  <h2>
                      A new luxury airline operating out of North Shore airport in Dairy flat north of Auckland<br/>
                      We operate the following routes:
                  </h2>
                  <ul>
                      <li>Weekend service from Dairy Flat to Sydney</li>
                      <li>Twice weekday service to Rotorua</li>
                      <li>Three times weekly to Great Barrier</li>
                      <li>Twice weekly to the Chatham Islands</li>
                      <li>Weekly service to Lake Tekapo</li>
                  </ul>
              </div>
              <div className="search">
                  <h1>Search Flights</h1>
                  <FlightSearch onResults={handleResults} />

                  {searched && flights.length === 0 && (
                      <p className="no-results visible">No flights found for this route and date range.</p>
                  )}

                  {flights.length > 0 && (
                      <div className="results-panel visible">
                          <div className="section-label" style={{ marginTop: '1.25rem' }}>
                              Available Flights
                          </div>
                          {flights.map(f => (
                              <FlightCard
                                  key={f._id}
                                  flight={f}
                                  selected={selectedFlight?._id === f._id}
                                  onSelect={handleSelect}
                              />
                          ))}
                      </div>
                  )}
                  {selectedFlight && (
                      <BookingForm flight={selectedFlight} onSuccess={handleSuccess} />
                  )}
                  {booking && <SuccessBanner booking={booking} />}
              </div>
          </div>
      );
}
