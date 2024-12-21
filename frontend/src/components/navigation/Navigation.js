import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Hamburger } from "./Hamburger";

export function Navigation(props) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [navClass, setNavClass] = useState("nav");
  const [navClassContainer, setNavClassContainer] = useState("menu");
  const [history, setHistory] = useState("hidden");
  const [post, setPost] = useState("hidden");
  const [book, setBook] = useState("show");
  const [login, setLogin] = useState("show");
  const [logout, setLogout] = useState("hidden");
  const navigate = useNavigate();

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
    if (!hamburgerOpen) {
      setNavClass("nav-open");
      setNavClassContainer("menu open");
    } else {
      setNavClass("nav");
      setNavClassContainer("menu");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v3/users/logout", { method: "POST" });
      setHistory("hidden");
      setPost("hidden");
      setBook("show");
      setLogin("show");
      setLogout("hidden");
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/v3/users/myIdentity");
        const data = await response.json();
        if (data.status === "loggedin") {
          setLogin("hidden");
          setLogout("show");
          if (data.userInfo.userType === "user") {
            setHistory("show");
            setPost("hidden");
            setBook("show"); // Users can see "Book"
          } else if (data.userInfo.userType === "worker") {
            setHistory("hidden");
            setPost("show");
            setBook("hidden"); // Workers cannot see "Book"
          }
        } else {
          // Guest settings
          setHistory("hidden");
          setPost("hidden");
          setBook("show"); // Guests can see "Book"
          setLogin("show");
          setLogout("hidden");
        }
      } catch (err) {
        console.error("Error fetching user session:", err);
      }
    };

    checkSession();
  }, []);

  return (
    <nav>
      <h1 className="title">
        <Link to="/book">JavaAir</Link>
      </h1>
      <div className={navClassContainer}>
        {/* Hamburger Icon */}
        <div className="hamburger" onClick={toggleHamburger}>
          <Hamburger />
        </div>

        {/* Navigation Menu */}
        <div className={navClass}>
          <ul>
            <li>
              <NavLink to="/intro">Home</NavLink>
            </li>
            <li className={book}>
              <NavLink to="/book">Book</NavLink>
            </li>
            <li className={history}>
              <NavLink to="/history">History</NavLink>
            </li>
            <li className={post}>
              <NavLink to="/post">Post</NavLink>
            </li>
            <li className={login}>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li className={logout}>
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}