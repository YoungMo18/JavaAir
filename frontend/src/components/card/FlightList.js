import React from "react";
import { useNavigate } from 'react-router-dom';

function FlightCard(props) {
  const navigate = useNavigate();
  let flight = props.flightObject;
  const navToDetail = () => {
    navigate(`/flight_detail/${flight.key}`);
  };

  const firstImage = Array.isArray(flight.images) && flight.images.length > 0 ? flight.images[0] : '';

  return (
    <div onClick={navToDetail}>
      <img src={firstImage} alt="Flight scenery" />
      <p>From: {flight.from}</p>
      <p>To: {flight.to}</p>
      <p>Date: {flight.departureDate}</p>
    </div>
  );
}

function FlightList(props) {
  const flightData = props.flightData;

  const cardList = flightData.length > 0 ? flightData.map(flightObject => (
      <FlightCard key={flightObject.key} flightObject={flightObject} />
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
