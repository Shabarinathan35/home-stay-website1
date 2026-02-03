import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Hotel Booking</Link>
        <div>
          <Link className="nav-link" to="/">Rooms</Link>
          <Link className="nav-link" to="/book">Book</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/register">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
