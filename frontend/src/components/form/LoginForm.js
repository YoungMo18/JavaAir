import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorLogin, setShowErrorLogin] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const checkEmpty = () => username === "" || password === "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkEmpty()) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);

    try {
      const response = await fetch("/api/v3/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse the response
        // localStorage.setItem("username", username); // Save the username to localStorage
        console.log("Login successful:", data.message);

        setShowErrorLogin(false);
        navigate("/intro"); // Redirect to the home page
      } else {
        setShowErrorLogin(true);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-form">
      <article className="login-container">
        <section className="login-window">
          <form id="login-form" method="post" onSubmit={handleSubmit}>
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              name="username"
              id="uname"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="password"
              id="psw"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button id="login-btn" type="submit">
              Login
            </button>
          </form>
          <Link id="sign-up-btn" to="/signup">
            Sign Up
          </Link>
          {isEmpty && <div className="error-msg">Form is incomplete</div>}
          {showErrorLogin && (
            <div className="error-msg">Incorrect username or password</div>
          )}
        </section>
      </article>
    </div>
  );
}

export default LoginForm;