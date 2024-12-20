import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { IntroPage } from "./components/IntroPage";
import { LoginPage } from "./components/LoginPage";
import { FlightPage } from "./components/FlightPage";
import { SignUpPage } from "./components/SignUpPage";
import { HistoryPage } from "./components/HistoryPage";
import { PostPage } from "./components/PostPage";
import { DetailFlightPage } from "./components/DetailFlightPage";

function RequireAuth(props) {
  let login = props.login;
  let loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === login) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}

function App(props) {
  return (
    <Routes>
      <Route path="/intro" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/flight_detail/:flight" element={<DetailFlightPage />} />
      <Route element={<RequireAuth login="user" />}>
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/book" element={<FlightPage />} />
      </Route>
      <Route element={<RequireAuth login="worker" />}>
        <Route path="/post" element={<PostPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/book" />} />
    </Routes>
  );
}

export default App;
