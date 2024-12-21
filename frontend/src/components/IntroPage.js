import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import { useNavigate } from "react-router-dom";

export function IntroPage() {
  const [userType, setUserType] = useState(""); // Stores the user type
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/v3/users/myIdentity", {
          credentials: "include", // Ensures session cookies are sent
        });
        const data = await response.json();
        if (data.status === "loggedin") {
          setUserType(data.userInfo.userType); // Set the user type
        } else {
          setUserType("guest"); // Default to guest if not logged in
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setUserType("guest"); // Default to guest in case of error
      }
    };

    checkSession();
  }, []);

  const handleGetStarted = () => {
    if (userType === "worker") {
      navigate("/post"); // Redirect workers to the post page
    } else {
      navigate("/book"); // Redirect users and guests to the book page
    }
  };

  return (
    <div className="home">
      <header>
        <Navigation />
      </header>
      <main>
        <h1>Discover Indonesia</h1>
        <article className="intro">
          <p>Where your journey begins with simplicity and support.</p>
          <button onClick={handleGetStarted}>Get Started</button>
        </article>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}