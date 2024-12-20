import React, { useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";

export function LoginForm() {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userButClass, setUserButClass] = useState("unclick-login-chooser");
  const [workerButClass, setWorkerButClass] = useState("unclick-login-chooser");
  const [showErrorLogin, setShowErrorLogin] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loginAccount, setLoginAccount] = useState(false);

  const navigate = useNavigate();

  const handleWorkerChange = () => {
    setUserType("worker");
    setUserButClass("unclick-login-chooser");
    setWorkerButClass("click-login-chooser");
  };

  const handleUserChange = () => {
    setUserType("user");
    setUserButClass("click-login-chooser");
    setWorkerButClass("unclick-login-chooser");
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const checkEmpty = () =>
    userType === "" || username === "" || password === "";

  const checkDBEntries = () => {
    const db = getDatabase();
    const userRef = ref(db, `user/${username}`);

    return get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userValues = snapshot.val();
          return (
            userValues["password"] === password &&
            userValues["userType"] === userType
          );
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let empty = checkEmpty();
    if (!empty) {
      setIsEmpty(false);

      try {
        let checkLogin = await checkDBEntries();
        if (checkLogin) {
          setShowErrorLogin(false);
          localStorage.setItem("loggedIn", userType);
          localStorage.setItem("username", username);
          setLoginAccount(true);
          setTimeout(() => {
            navigate("/intro");
            window.location.reload();
          }, 1800);
        } else {
          setShowErrorLogin(true);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("empty");
      setIsEmpty(true);
    }
  };

  return (
    <div className="login-form">
      <article className="login-chooser">
        <button onClick={handleWorkerChange} className={workerButClass}>
          Worker
        </button>
        <button onClick={handleUserChange} className={userButClass}>
          User
        </button>
      </article>
      <article className="login-container">
        <section className="login-window">
          <form method="post">
            <label for="uname">
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
            <label for="psw">
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
            <button id="login-btn" onClick={handleSubmit}>
              Login
            </button>
          </form>
          <Link id="sign-up-btn" to="/signup">
            Sign Up
          </Link>
          {isEmpty && <div className="error-msg">Form is incomplete</div>}
          {showErrorLogin && (
            <div className="error-msg">Incorrect information</div>
          )}
          {loginAccount && (
            <div className="success-msg">
              Logged in... Redirecting to home page...
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
