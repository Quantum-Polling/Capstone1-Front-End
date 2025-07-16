import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  console.log("User", user);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone I</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <span className="username">
              Welcome, {user.firstName} {user.lastName} !
            </span>

            <div className="admin-links">
              {user?.role?.toLowerCase() === "admin" && (
                <Link to="/userlist" className="nav-link">
                  UserList
                </Link>
              )}
            </div>

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
