import React, { useState, useEffect } from "react";
import { Hamburger } from "./Hamburger";
import { Link, NavLink, useNavigate } from "react-router-dom";

export function Navigation(props) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [navClass, setNavClass] = useState("nav");
  const [navClassContainer, setNavClassContainer] = useState("menu");
  const [history, setHistory] = useState("hidden");
  const [post, setPost] = useState("hidden");
  const [book, setBook] = useState("hidden");
  const [login, setLogin] = useState("show");
  const [logout, setLogout] = useState("hidden");
  const navigate = useNavigate();

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
    if (hamburgerOpen) {
      setNavClass("nav-open");
      setNavClassContainer("menu open");
    } else {
      setNavClass("nav");
      setNavClassContainer("menu");
    }
  };

  const handleLogoutChange = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "user") {
      setHistory("show");
      setPost("hidden");
      setBook("show");
      setLogin("hidden");
      setLogout("show");
    } else if (loggedIn === "worker") {
      setHistory("hidden");
      setPost("show");
      setBook("hidden");
      setLogin("hidden");
      setLogout("show");
    } else {
      setHistory("hidden");
      setPost("hidden");
      setBook("hidden");
      setLogin("show");
      setLogout("hidden");
    }
  }, []);

  return (
    <>
      <nav>
        <h1 className="title">
          <Link to="/book">JavaAir</Link>
        </h1>
        <div className={navClassContainer}>
          <div className="hamburger" onClick={toggleHamburger}>
            <Hamburger />
          </div>
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
                <button className="logout" onClick={handleLogoutChange}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
