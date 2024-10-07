"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingConfirmation.module.css";
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp, getVerifiedPhone } from "../../utils/verification";
import { API_URL } from "@/utils/api";



interface BookingConfirmationProps {
  userDetails: {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
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
  const [phone, setPhone] = useState(userDetails.phone || "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();



  useEffect(() => {
    const storedPhone = getVerifiedPhone();
    if (storedPhone) {
      setPhone(storedPhone);
    }

    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setRazorpayLoaded(true);

      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) return alert("Razorpay SDK is not loaded.");

    try {
      const response = await axios.post(`${API_URL}/api/razorpay-order`, { amount: totalPrice * 100 });

      const { data } = response;
      if (!data.success) return alert("Error initiating payment.");

      const rzp = new (window as any).Razorpay({
        key: "rzp_test_37TZNY8cnWgUm8",
        amount: data.amount,
        currency: data.currency,
        name: "CineMagic",
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
      alert("Issue with initiating payment.");
    }
  };

  const confirmBooking = async (paymentId: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/confirm-booking`, {
        userDetails: {
          ...userDetails,
          phone,
        },
        movieTitle,
        theatreId,
        showDate,
        showTime,
        selectedSeats,
        totalPrice,
        paymentId,
      });
      if (response.data.success) {
        const bookingDetails = response.data.booking;
        const qrCodeUrl = response.data.qrCodeUrl;

        // Convert bookingDetails to a JSON string and encode it
        const encodedBookingDetails = encodeURIComponent(JSON.stringify(bookingDetails));
        const encodedQrCodeUrl = encodeURIComponent(qrCodeUrl);

        const queryParams = new URLSearchParams({
          bookingDetails: encodedBookingDetails,
          qrCodeUrl: encodedQrCodeUrl,
        }).toString();


        router.push(`/user/booking-qr-code?${queryParams}`);

      } else {
        alert("Error confirming booking.");
      }
    } catch (error) {
      alert("Issue confirming booking.");
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };
  const handleSendOtp = async () => {
    setOtpError("");
    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);
    if (result.success) {
      setOtpSent(true);
    } else {
      setOtpError(result.error || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);
    const result = await verifyOtp(phone, otp, userDetails.userId);
    setLoading(false);

    if (result.success) {
      alert("Phone number verified successfully!");
      setOtpSent(false);
    } else {
      setOtpError(result.error || "Incorrect OTP. Please try again.");
    }
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

        <div className={styles.phoneSection}>
          <p>
            Add your Phone number to receive a booking receipt:
          </p>
          <div className={styles.phoneVerification} >
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className={styles.phoneInput}
              placeholder="Enter your phone number"
            />


          </div>


        </div>
      </div>
      <button
        onClick={handleRazorpayPayment}
        className={styles.confirmButton}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingConfirmation;
