import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBarStyles.css";
import { Navigate } from "react-router-dom";

const NavBar = ({ user, onLogout }) => {
  console.log("User", user);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Home</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <span className="username">
              Welcome, {user.firstName} {user.lastName}!
            </span>
            {user.avatarURL && (
              <img
                src={user.avatarURL}
                alt="Profile"
                className="profile-image"
              />  
            )}

            <div className="admin-links">
              {user?.role?.toLowerCase() === "admin" && (
                <Link to="/userlist" className="nav-link">
                  User List
                </Link>
              )}
            </div>

            <button
              onClick={() => navigate("/polls/create")}
              type="button"
              className="logout-btn"
            >
              Create
            </button>
            <button
              onClick={() => navigate("/polls/mypolls")}
              type="button"
              className="logout-btn"
            >
            My Polls
            </button>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
