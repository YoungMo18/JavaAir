import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import HistoryList from "./card/HistoryList";

export function HistoryPage(props) {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const username = localStorage.getItem("username");

      if (!username) {
        console.log("No username found in localStorage");
        return;
      }

      try {
        const response = await fetch(`/api/v3/history/bookedFlights`);
        if (response.ok) {
          const history = await response.json();
          setHistoryData(history);
        } else {
          console.error("Failed to fetch booking history");
        }
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };

    fetchHistory();
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
