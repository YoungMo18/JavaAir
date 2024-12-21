import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

export function DetailFlightPage(props) {
  const [flightObject, setFlightObject] = useState(null);
  const [successBook, setSuccessBook] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const flightID = useParams().flight;
  const navigate = useNavigate();

  // Fetch flight details
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await fetch(`/api/v3/flights/${flightID}`);
        if (response.ok) {
          const data = await response.json();
          setFlightObject(data);
        } else {
          console.error("Failed to fetch flight details");
          setErrorMessage("Failed to load flight details.");
        }
      } catch (error) {
        console.error("Error fetching flight details:", error);
        setErrorMessage("An error occurred while fetching flight details.");
      }
    };

    fetchFlightDetails();
  }, [flightID]);

  if (!flightObject) {
    return <p>Loading flight details...</p>;
  }

  // Book flight
  const bookFlight = async () => {
    try {
      const username = localStorage.getItem("username");
      console.log("Username from localStorage:", username); // Debugging line

      if (!username) {
        setErrorMessage("You must be logged in to book a flight.");
        return;
      }

      if (flightObject.quantity <= 0) {
        setErrorMessage("This flight is fully booked.");
        return;
      }

      const response = await fetch(`/api/v3/flights/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightID: flightObject.flightID,
          from: flightObject.from,
          to: flightObject.to,
          departureTime: flightObject.departureTime,
          arrivalTime: flightObject.arrivalTime,
          departureDate: flightObject.departureDate,
          username, // Include username in the booking
        }),
      });

      if (response.ok) {
        setSuccessBook(true);
        setTimeout(() => {
          navigate("/history");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to book flight.");
      }
    } catch (error) {
      console.error("Error booking flight:", error);
      setErrorMessage("An error occurred while booking the flight.");
    }
  };

  const carouselItems = flightObject.images.map((img, index) => (
    <Carousel.Item key={index}>
      <img src={img} alt={`Flight scenery ${index + 1}`} />
    </Carousel.Item>
  ));

  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <div className="flight-detail">
          <h1>Flight Details</h1>
          <article className="flight-detail-card">
            <Carousel indicators={false} prevLabel="" nextLabel="">
              {carouselItems}
            </Carousel>
            <p>From: {flightObject.from}</p>
            <p>To: {flightObject.to}</p>
            <p>Date: {flightObject.departureDate}</p>
            <p>Departure Time: {flightObject.departureTime}</p>
            <p>Arrival Time: {flightObject.arrivalTime}</p>
            <p>Quantity: {flightObject.quantity > 0 ? flightObject.quantity : "Fully booked"}</p>
            <button onClick={bookFlight} disabled={flightObject.quantity <= 0}>
              Book Flight
            </button>
            {successBook && (
              <div className="success-msg">
                Successfully booked... Redirecting to history...
              </div>
            )}
            {errorMessage && <div className="error-msg">{errorMessage}</div>}
          </article>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default DetailFlightPage;