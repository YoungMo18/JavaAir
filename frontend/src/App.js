import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { IntroPage } from "./components/IntroPage";
import { LoginPage } from "./components/LoginPage";
import { FlightPage } from "./components/FlightPage";
import { SignUpPage } from "./components/SignUpPage";
import { HistoryPage } from "./components/HistoryPage";
import { PostPage } from "./components/PostPage";
import { DetailFlightPage } from "./components/DetailFlightPage";

function RequireAuth({ allowedUserTypes }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userType, setUserType] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/v3/users/myIdentity", {
          credentials: "include", // Ensures session cookies are sent
        });
        const data = await response.json();
        if (data.status === "loggedin") {
          setIsAuthenticated(true);
          setUserType(data.userInfo.userType);
        }
      } catch (err) {
        console.error("Error verifying session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated && allowedUserTypes.includes("guest")) return <Outlet />;
  if (allowedUserTypes.includes(userType)) return <Outlet />;
  return <Navigate to="/login" />;
}

function App(props) {
  return (
    <Routes>
      <Route path="/intro" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/flight_detail/:flight" element={<DetailFlightPage />} />
      {/* Allow anyone except workers to access `/book` */}
      <Route element={<RequireAuth allowedUserTypes={["user", "guest"]} />}>
        <Route path="/book" element={<FlightPage />} />
      </Route>
      {/* Restrict `/history` to logged-in users only */}
      <Route element={<RequireAuth allowedUserTypes={["user"]} />}>
        <Route path="/history" element={<HistoryPage />} />
      </Route>
      {/* Restrict `/post` to workers only */}
      <Route element={<RequireAuth allowedUserTypes={["worker"]} />}>
        <Route path="/post" element={<PostPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/book" />} />
    </Routes>
  );
}

export default App;