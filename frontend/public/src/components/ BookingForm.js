import React, { useState } from "react";
import axios from "axios";


function BookingForm() {
  const [formData, setFormData] = useState({
    user: 1, // Example user ID
    room: "",
    check_in: "",
    check_out: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/bookings/", formData)
      .then(res => alert("Booking successful!"))
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Room ID"
             onChange={e => setFormData({...formData, room: e.target.value})}/>
      <input type="date"
             onChange={e => setFormData({...formData, check_in: e.target.value})}/>
      <input type="date"
             onChange={e => setFormData({...formData, check_out: e.target.value})}/>
      <button type="submit">Book Room</button>
    </form>
  );
}

export default BookingForm;



function BookingForm() {
  const [formData, setFormData] = useState({
    room: "",
    check_in: "",
    check_out: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.post("http://localhost:8000/api/bookings/", formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => alert("Booking successful!"))
    .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h2>Book a Room</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Room ID" className="form-control mb-2"
               onChange={e => setFormData({...formData, room: e.target.value})}/>
        <input type="date" className="form-control mb-2"
               onChange={e => setFormData({...formData, check_in: e.target.value})}/>
        <input type="date" className="form-control mb-2"
               onChange={e => setFormData({...formData, check_out: e.target.value})}/>
        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
    </div>
  );
}

export default BookingForm;
