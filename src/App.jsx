import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import UserList from "./components/UserList";
import { API_URL } from "./shared";
import PollCreator from "./components/PollCreator";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";
import SinglePoll from "./components/SinglePoll";
import MyPolls from "./components/MyPolls";
import PollResults from "./components/PollResults";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  const [loading, setLoading] = useState(true);
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setIsAuth(true);
    } catch {
      console.log("Not authenticated");
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle Auth0 authentication
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      handleAuth0Login();
    }
  }, [isAuthenticated, auth0User]);

  const handleAuth0Login = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/auth0`,
        {
          auth0Id: auth0User.sub,
          firstName: auth0User.name.split(" ")[0],
          lastName: auth0User.name.split(" ")[1],
          email: auth0User.email,
          username: auth0User.nickname || auth0User.email?.split("@")[0],
        },
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth0 login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Logout from our backend
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      // Logout from Auth0
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuth0LoginClick = () => {
    loginWithRedirect();
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div>
      <NavBar
        user={user}
        onLogout={handleLogout}
        onAuth0Login={handleAuth0LoginClick}
        iAuth0Authenticated={isAuthenticated}
      />
      <div className="app">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <Login setUser={setUser} onAuth0Login={handleAuth0LoginClick} />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup setUser={setUser} onAuth0Login={handleAuth0LoginClick} />
            }
          />
          <Route path="/userlist" element={<UserList setUser={setUser} />} />
          <Route path="/polls">
            <Route path="create" element={<PollCreator user={user} />} />
            <Route path=":id">
              <Route index element={<SinglePoll />} />
              <Route path="edit" element={<PollCreator user={user} />} />
              <Route path="results" element={<PollResults />} />
            </Route>
            <Route path="mypolls" element={<MyPolls user={user}/>} />
            
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Auth0Provider {...auth0Config}>
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
