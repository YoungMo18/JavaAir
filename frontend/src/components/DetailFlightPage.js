import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import { useParams } from "react-router-dom";
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
  set as firebaseSet,
  push,
} from "firebase/database";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

export function DetailFlightPage(props) {
  const [flightObject, setFlightObject] = useState(null);
  const [successBook, setSuccessBook] = useState(false);
  const flightID = useParams().flight;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightDetails = async () => {
      const db = getDatabase();
      const flightRef = ref(db, `flight/${flightID}`);

      try {
        const snapshot = await get(flightRef);
        if (snapshot.exists()) {
          setFlightObject(snapshot.val());
        } else {
          console.log("No flight data available");
        }
      } catch (error) {
        console.error("Error fetching flight details:", error);
      }
    };

    fetchFlightDetails();
  }, [flightID]);

  if (!flightObject) {
    return <p>Loading flight details...</p>;
  }

  const inputDBEntries = async () => {
    const db = getDatabase();
    const username = localStorage.getItem("username");
    const bookRef = ref(db, `bookedFlight/${username}`);

    const newBookRef = push(bookRef);

    await firebaseSet(newBookRef, {
      flightID: flightID,
      from: flightObject.from,
      to: flightObject.to,
      departureTime: flightObject.departureTime,
      arrivalTime: flightObject.arrivalTime,
      departureDate: flightObject.departureDate,
    })
      .then(() => console.log("Data saved successfully!"))
      .catch((err) => console.log(err));

    setSuccessBook(true);
  };

  const updateQuantityDB = async () => {
    const db = getDatabase();
    const flightRef = ref(db, `flight/${flightID}`);
    const newQuantity = flightObject.quantity - 1;
    if (newQuantity !== 0) {
      await update(flightRef, {
        quantity: newQuantity,
      })
        .then(() => {
          console.log("Updated quantity");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setTimeout(async () => {
        await remove(flightRef).then(() => {
          console.log("Flight removed");
        });
      }, 3500);
    }
    setTimeout(() => {
      navigate("/history");
    }, 2000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await inputDBEntries();
    await updateQuantityDB();
  };

  let carouselItems = flightObject.images.map((img, index) => (
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
            <p>Quantity: {flightObject.quantity}</p>
            <button onClick={handleSubmit}>Book Flight</button>
            {successBook && (
              <div className="success-msg">
                Successfully booked... Redirecting to history...
              </div>
            )}
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
