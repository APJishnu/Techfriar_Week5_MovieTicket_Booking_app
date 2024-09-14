"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingConfirmation.module.css"; 

interface BookingConfirmationProps {
  userDetails: {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string; // Add phone number here
  };
  movieTitle: string;
  theatreId: string;
  showDate: string;
  showTime: string;
  selectedSeats: string[];
  totalPrice: number;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  userDetails,
  movieTitle,
  theatreId,
  showDate,
  showTime,
  selectedSeats,
  totalPrice,
}) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [phone, setPhone] = useState(userDetails.phone|| ""); // Add phone state

  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error("Failed to load Razorpay SDK.");
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) return alert("Razorpay SDK is not loaded.");

    try {
      const response = await axios.post("http://localhost:5000/api/razorpay-order", { amount: totalPrice * 100 });
      const { data } = response;
      if (!data.success) return alert("Error initiating payment.");

      const rzp = new (window as any).Razorpay({
        key: "rzp_test_37TZNY8cnWgUm8", 
        amount: data.amount,
        currency: data.currency,
        name: "Movie Booking",
        description: "Payment for movie booking",
        order_id: data.order_id,
        handler: (response: any) => {
          alert("Payment successful!");
          confirmBooking(response.razorpay_payment_id);
        },
        prefill: {
          name: `${userDetails.firstname} ${userDetails.lastname}`,
          email: userDetails.email,
        },
        theme: { color: "#f12f3f" },
      });
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("Issue with initiating payment.");
    }
  };

  const confirmBooking = async (paymentId: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/confirm-booking", {
        userDetailsuserDetails: {
          ...userDetails,
          phone,  // Add phone number here
        },
   movieTitle, theatreId, showDate, showTime, selectedSeats, totalPrice, paymentId,
      });
      if (response.data.success) alert("Booking confirmed!");
      else alert("Error confirming booking.");
    } catch (error) {
      console.error("Error confirming booking", error);
      alert("Issue confirming booking.");
    }
  };

    // Function to handle phone number input change
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(event.target.value);
    };

  return (
    <div className={styles.bookingConfirmation}>
      <h2>Booking Confirmation</h2>
      <div className={styles.details}>
        <h3>User Details</h3>
        <p>Name: {userDetails.firstname} {userDetails.lastname}</p>
        <p>Email: {userDetails.email}</p>

       
        <h3>Booking Details</h3>
        <p>Movie: {movieTitle}</p>
        <p>Theatre: {theatreId}</p>
        <p>Date: {showDate}</p>
        <p>Time: {showTime}</p>
        <p>Seats: {selectedSeats.join(", ")}</p>
        <p>Total Price: ₹{totalPrice}</p>
         {/* Add phone number input field */}
         <p>
          Add your Phone number for recieve booking reciept:
          <input 
            type="tel" 
            value={phone} 
            onChange={handlePhoneChange} 
            className={styles.phoneInput} 
            placeholder="Enter your phone number" 
          />
        </p>
      </div>
      <button onClick={handleRazorpayPayment} className={styles.confirmButton}>
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingConfirmation;
