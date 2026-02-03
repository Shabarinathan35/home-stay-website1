import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8000/api/bookings/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setBookings(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            Room {b.room} from {b.check_in} to {b.check_out}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

const cancelBooking = (id) => {
  const token = localStorage.getItem("token");
  axios.delete(`http://localhost:8000/api/bookings/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(() => alert("Booking cancelled!"));
};
