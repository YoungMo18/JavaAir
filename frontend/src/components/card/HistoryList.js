import React, { useEffect, useState } from "react";

function HistoryCard(props) {
  const flight = props.historyObject;
  return (
    <li>
      <article>
        <p>Flight number: {flight.flightID}</p>
        <p>From: {flight.from}</p>
        <p>To: {flight.to}</p>
        <p>Date: {flight.departureDate}</p>
        <p>------------------------------------------</p>
      </article>
    </li>
  );
}

function HistoryList(props) {
  const [containerClass, setContainerClass] = useState(
    "history-container minimum-history-container"
  );

  useEffect(() => {
    if (props.historyData.length > 2) {
      setContainerClass("history-container");
    }
  }, [props.historyData]);

  // Use MongoDB's unique _id as the key
  const cardList = props.historyData.map((flight) => (
    <HistoryCard key={flight._id} historyObject={flight} />
  ));

  return (
    <div className="history">
      <div className={containerClass}>
        <h1>Booking History</h1>
        <ul>{cardList}</ul>
      </div>
    </div>
  );
}

export default HistoryList;