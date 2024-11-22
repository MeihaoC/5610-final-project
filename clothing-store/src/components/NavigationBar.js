import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavigationBar.css";

const NavigationBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("username"); 
    setLoggedInUser(null); 
    navigate("/"); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Clothing Store</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        {loggedInUser ? (
          <>
            <Link to="/profile">Profile</Link>
            <span>Welcome, {loggedInUser}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;

