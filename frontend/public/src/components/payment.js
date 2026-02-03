import React, { useState } from "react";
import axios from "axios";

function Payment() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    const res = await axios.post("http://localhost:8000/api/create-payment/", { amount });
    alert("Payment initiated! Client secret: " + res.data.client_secret);
  };

  return (
    <div>
      <input type="number" placeholder="Amount" onChange={e => setAmount(e.target.value)} />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}

export default Payment;
