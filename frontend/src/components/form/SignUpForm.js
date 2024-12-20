import React, { useState } from "react";
import { getDatabase, ref, get, set as firebaseSet } from "firebase/database";
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userButClass, setUserButClass] = useState("unclick-login-chooser");
  const [workerButClass, setWorkerButClass] = useState("unclick-login-chooser");
  const [isEmpty, setIsEmpty] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(false);
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
          setUserExist(true);
          return true;
        } else {
          setUserExist(false);
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  const inputDBEntries = () => {
    const db = getDatabase();
    const userRef = ref(db, `user/${username}`);
    firebaseSet(userRef, {
      userType: userType,
      password: password,
    })
      .then(() => console.log("data saved successfully!"))
      .catch((err) => console.log(err));
    setCreatedAccount(true);
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    let empty = checkEmpty();
    if (!empty) {
      setIsEmpty(false);
      try {
        let userExist = await checkDBEntries();
        if (!userExist) {
          await inputDBEntries();
          setTimeout(() => {
            navigate("/login");
          }, 1800);
        } else {
          console.log("User already exists!");
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
    <div className="signup-form">
      <article className="signup-chooser">
        <button onClick={handleWorkerChange} className={workerButClass}>
          Worker
        </button>
        <button onClick={handleUserChange} className={userButClass}>
          User
        </button>
      </article>
      <article class="signup-container">
        <section className="signup-window">
          <form id="signup-form" method="post">
            <label for="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              name="username"
              id="unameSign"
              placeholder="Enter your username"
              onChange={handleUsernameChange}
              required
            />
            <label for="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="password"
              id="pswSign"
              placeholder="Enter your password"
              onChange={handlePasswordChange}
              required
            />
            <button id="signup-btn" onClick={handleSubmit}>
              Sign Up
            </button>
          </form>
          {isEmpty && <div className="error-msg">Form is incomplete</div>}
          {userExist && <div className="error-msg">User already exist</div>}
          {createdAccount && (
            <div className="success-msg">Success!!! Redirecting to login</div>
          )}
        </section>
      </article>
    </div>
  );
}
