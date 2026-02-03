// Register.js
import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleRegister = async () => {
    await axios.post("http://localhost:8000/api/register/", formData)
      .then(() => alert("Registration successful!"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})}/>
      <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})}/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
