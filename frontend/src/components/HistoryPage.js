import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import HistoryList from "./card/HistoryList";
import { getDatabase, ref, onValue } from "firebase/database";

export function HistoryPage(props) {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const username = localStorage.getItem("username");

    if (!username) {
      console.log("No username found in localStorage");
      return;
    }

    const historyRef = ref(db, `bookedFlight/${username}`);

    const unregisterFunction = onValue(historyRef, (snapshot) => {
      const userHistoryObject = snapshot.val();
      if (userHistoryObject) {
        const userHistoryKeys = Object.keys(userHistoryObject);
        const userHistoryArray = userHistoryKeys.map((key) => {
          const singleHistoryCopy = { ...userHistoryObject[key], key };
          return singleHistoryCopy;
        });
        setHistoryData(userHistoryArray);
      } else {
        setHistoryData([]);
      }
    });
    return () => {
      unregisterFunction();
    };
  }, []);

  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <HistoryList historyData={historyData} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default HistoryPage;
