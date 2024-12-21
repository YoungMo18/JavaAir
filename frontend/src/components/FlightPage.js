import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import FlightList from "./card/FlightList";
import { SearchFlightsForm } from "./form/SearchFlightForm";

export function FlightPage(props) {
  const [flights, setFlights] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("/api/v3/flights");
        if (response.ok) {
          const data = await response.json();
          setFlights(data);
        } else {
          console.error("Failed to fetch flights");
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();
  }, []);

  const applyFilter = (from, to, date) => {
    setFrom(from);
    setTo(to);
    setDate(date);
  };

  const displayData = flights.filter((flight) => {
    if (!from && !to && !date) return true;
    let check =
      flight.from.replace(/\s/g, "").toLowerCase() ===
        from.replace(/\s/g, "").toLowerCase() &&
      flight.to.replace(/\s/g, "").toLowerCase() ===
        to.replace(/\s/g, "").toLowerCase();
    if (check && !date) {
      return true;
    }
    if (check && flight.departureDate === date) return true;
    return false;
  });

  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <section className="section-flight">
          <SearchFlightsForm applyFilterCallback={applyFilter} />
        </section>
        <FlightList flightData={displayData} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default FlightPage;