import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomList />} />
        <Route path="/book" element={<BookingForm />} />
      </Routes>
    </Router>
  );
}

export default App;
