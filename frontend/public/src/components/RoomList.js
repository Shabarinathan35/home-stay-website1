import React, { useState } from "react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import axios from "axios";


function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ type: "", price_min: "", price_max: "" });

  useEffect(() => {
    axios.get("http://localhost:8000/api/rooms/", { params: filters })
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, [filters]);

  return (
    <div>
      <h2>Available Rooms</h2>
      <div>
        <select onChange={e => setFilters({...filters, type: e.target.value})}>
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
        <input type="number" placeholder="Min Price" onChange={e => setFilters({...filters, price_min: e.target.value})}/>
        <input type="number" placeholder="Max Price" onChange={e => setFilters({...filters, price_max: e.target.value})}/>
      </div>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>{room.room_number} - {room.room_type} (${room.price})</li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;


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


function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/rooms/")
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Available Rooms</h2>
      <div className="row">
        {rooms.map(room => (
          <div className="col-md-4" key={room.id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Room {room.room_number}</h5>
                <p className="card-text">{room.room_type}</p>
                <p className="card-text">${room.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;
