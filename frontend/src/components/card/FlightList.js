import React from "react";
import { useNavigate } from 'react-router-dom';

function FlightCard(props) {
  const navigate = useNavigate();
  let flight = props.flightObject;
  const navToDetail = () => {
    navigate(`/flight_detail/${flight.flightID || flight._id}`);
  };

  const baseUrl = process.env.NODE_ENV === 'production'
  ? '' // Use an empty string for relative URLs in production
  : 'http://localhost:8080'; // Local development backend URL

  const firstImage = flight.images && flight.images.length > 0
  ? `${baseUrl}${flight.images[0]}`
  : '';
  console.log("First Image URL:", firstImage);

  return (
    <div onClick={navToDetail}>
      <img src={firstImage} alt="Flight scenery" />
      <p>From: {flight.from}</p>
      <p>To: {flight.to}</p>
      <p>Date: {flight.departureDate}</p>
    </div>
  );
}

function FlightList({ flightData }) {
  const cardList = flightData.length > 0
    ? flightData.map(flightObject => (
        <FlightCard key={flightObject.flightID || flightObject._id} flightObject={flightObject} />
      ))
    : <p className="error-msg">No Flights Available</p>;

  return (
    <>
      <section className="places-section">
        <h2>✈️ Available Flights ✈️</h2>
        <article className="searchFlights">
          {cardList}
        </article>
      </section>
    </>
  );
}
export default FlightList;
