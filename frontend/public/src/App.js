import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isAuthenticated = !!localStorage.getItem("token");

<Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoomList />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>{/* your routes */}</Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
