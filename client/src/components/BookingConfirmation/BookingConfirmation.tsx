"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingConfirmation.module.css"; // Import the CSS module

interface BookingConfirmationProps {
  userDetails: {
    userId:string;
    firstname: string;
    lastname: string;
    email: string;
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

  // Function to load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Load the Razorpay script on component mount
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      if (loaded) {
        setRazorpayLoaded(true);
      } else {
        console.error("Failed to load Razorpay SDK.");
      }
    };

    loadScript();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK is not loaded. Please try again later.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/razorpay-order", {
        amount: totalPrice * 100, // Convert to paise (Razorpay expects amount in paise)
      });

      const { data } = response;
      if (!data.success) {
        alert("Error in payment initiation.");
        return;
      }

      const options = {
        key: "rzp_test_37TZNY8cnWgUm8", // Replace with your Razorpay key ID
        amount: data.amount,
        currency: data.currency,
        name: "Test Company",
        description: "Movie Booking Payment",
        order_id: data.order_id,
        handler: function (response: any) {
          alert("Payment successful!");
          // Call backend to save order details
          confirmBooking(response.razorpay_payment_id);
        },
        prefill: {
          name: `${userDetails.firstname} ${userDetails.lastname}`,
          email: userDetails.email,
        },
        theme: {
          color: "#f12f3f",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("There was an issue with initiating the payment.");
    }
  };

  const confirmBooking = async (paymentId: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/confirm-booking", {
        userDetails,
        movieTitle,
        theatreId,
        showDate,
        showTime,
        selectedSeats,
        totalPrice,
        paymentId,
      });

      const { data } = response;
      if (data.success) {
        alert("Booking confirmed!");
      } else {
        alert("Error confirming booking.");
      }
    } catch (error) {
      console.error("Error confirming booking", error);
      alert("There was an issue with confirming the booking.");
    }
  };

  return (
    <div className={styles.bookingConfirmation}>
      <h2>Booking Confirmation</h2>
      <div className={styles.details}>
        <h3>User Details</h3>
        <p>
          Name: {userDetails.firstname} {userDetails.lastname}
        </p>
        <p>Email: {userDetails.email}</p>

        <h3>Booking Details</h3>
        <p>Movie: {movieTitle}</p>
        <p>Theatre ID: {theatreId}</p>
        <p>Date: {showDate}</p>
        <p>Time: {showTime}</p>
        <p>Seats: {selectedSeats.join(", ")}</p>
        <p>Total Price: Rs. {totalPrice}</p>
      </div>

      <button onClick={handleRazorpayPayment} className={styles.confirmButton}>
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingConfirmation;
