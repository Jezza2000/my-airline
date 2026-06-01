'use client';
import { useState } from 'react';
import FlightSearch from "@/modules/FlightSearch";
import FlightCard from "@/modules/FlightCard";
import BookingForm from "@/modules/BookingForm";
import SuccessBanner from "@/modules/SuccessBanner";
import PassengerSearch from '@/modules/PassengerSearch';

export default function Home() {

    const [flights,        setFlights]        = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [booking,        setBooking]        = useState(null);
    const [searched,       setSearched]       = useState(false);
    const [activeSection,  setActiveSection]  = useState(null);

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
            <div className="inner-content">
                <div className="intro">
                    <div className="intro-text">
                        <h1>Jeremy Airlines</h1>
                        <h2>
                            A new luxury airline operating out of North Shore Airport in Dairy Flat north of Auckland<br/>
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
                    <div className="intro-image">
                        <img src="/jet.png" alt="picture of jet" />
                    </div>
                </div>

                <div className="flights-or-bookings">
                    <h2>
                        <button className="main-buttons" onClick={() => setActiveSection('flights')}>Search Flights</button>
                        <button className="main-buttons" onClick={() => setActiveSection('passengers')}>Passenger Lookup</button>
                    </h2>
                </div>

                {activeSection === 'flights' && (
                    <div className="search">
                        <FlightSearch onResults={handleResults} />

                        {searched && flights.length === 0 && (
                            <p className="no-results visible">No flights found for this route and date range.</p>
                        )}

                        {flights.length > 0 && (
                            <div className="results-panel visible">
                                <div className="section-label">Available Flights</div>
                                <div className="timezone">All times displayed in local time</div>
                                <div className="results-listings">
                                    {flights.map(f => (
                                        <FlightCard
                                            key={f._id}
                                            flight={f}
                                            selected={selectedFlight?._id === f._id}
                                            onSelect={handleSelect}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {selectedFlight && (
                            <BookingForm flight={selectedFlight} onSuccess={handleSuccess} />
                        )}
                        {booking && <SuccessBanner booking={booking} />}
                    </div>
                )}

                {activeSection === 'passengers' && <PassengerSearch />}
            </div>
        </div>
    );
}