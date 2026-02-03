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
