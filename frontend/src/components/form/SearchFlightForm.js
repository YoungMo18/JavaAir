// import React, { useState } from "react";

// export function SearchFlightsForm(props) {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [date, setDate] = useState("");
//   const [isEmpty, setIsEmpty] = useState(false);

//   const handleFromChange = (event) => {
//     setFrom(event.target.value);
//   };

//   const handleToChange = (event) => {
//     setTo(event.target.value);
//   };

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   const checkEmpty = () => from === "" || to === "";

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     let empty = checkEmpty();
//     if (!empty) {
//       setIsEmpty(false);
//       props.applyFilterCallback(from, to, date);
//     } else {
//       setIsEmpty(true);
//     }
//   };
//   return (
//     <>
//       <section className="flight-container">
//         <h1>Find Flights</h1>
//         <form id="search-flights-form">
//           <label for="from">From*</label>
//           <input
//             type="text"
//             id="from"
//             name="from"
//             value={from}
//             onChange={handleFromChange}
//             required
//           />
//           <label for="to">To*</label>
//           <input
//             type="text"
//             id="to"
//             name="to"
//             value={to}
//             onChange={handleToChange}
//             required
//           />
//           <label for="departure_date">Departure Date</label>
//           <input
//             type="date"
//             id="departure_date"
//             name="departure_date"
//             value={date}
//             onChange={handleDateChange}
//             required
//           />
//           <button type="submit" onClick={handleSubmit}>
//             Search Flights
//           </button>
//         </form>
//         {isEmpty && <div className="error-msg">Form is incomplete</div>}
//       </section>
//     </>
//   );
// }

import React, { useState } from "react";

export function SearchFlightsForm(props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  const handleFromChange = (event) => {
    setFrom(event.target.value);
  };

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const checkEmpty = () => from === "" || to === "";

  const handleSubmit = (event) => {
    event.preventDefault();
    let empty = checkEmpty();
    if (!empty) {
      setIsEmpty(false);
      props.applyFilterCallback(from, to, date);
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <>
      <section className="flight-container">
        <h1>Find Flights</h1>
        <form id="search-flights-form">
          <label htmlFor="from">From*</label>
          <input
            type="text"
            id="from"
            name="from"
            value={from}
            onChange={handleFromChange}
            required
          />
          <label htmlFor="to">To*</label>
          <input
            type="text"
            id="to"
            name="to"
            value={to}
            onChange={handleToChange}
            required
          />
          <label htmlFor="departure_date">Departure Date</label>
          <input
            type="date"
            id="departure_date"
            name="departure_date"
            value={date}
            onChange={handleDateChange}
          />
          <button type="submit" onClick={handleSubmit}>
            Search Flights
          </button>
        </form>
        {isEmpty && <div className="error-msg">Form is incomplete</div>}
      </section>
    </>
  );
}
