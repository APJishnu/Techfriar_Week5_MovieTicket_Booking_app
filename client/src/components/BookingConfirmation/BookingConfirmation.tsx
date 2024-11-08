"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingConfirmation.module.css";
import { useRouter } from "next/navigation";
import { getVerifiedPhone } from "../../utils/verification";
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
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
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

  // Validate phone number (exactly 10 digits)
  const isPhoneValid = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;  // Ensure phone number contains exactly 10 digits
    return phoneRegex.test(phone);
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) return setModalMessage("Razorpay SDK is not loaded.");

    // Validate phone number before proceeding with the payment
    if (!isPhoneValid(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    } else {
      setPhoneError(null);  // Clear phone error if valid
    }

    try {
      const response = await axios.post(`${API_URL}/api/razorpay-order`, { amount: totalPrice * 100 });
      const { data } = response;
      if (!data.success) return setModalMessage("Error initiating payment.");

      const rzp = new (window as any).Razorpay({
        key: "rzp_test_37TZNY8cnWgUm8",
        amount: data.amount,
        currency: data.currency,
        name: "CineMagic",
        description: "Payment for movie booking",
        order_id: data.order_id,
        handler: (response: any) => {
          setModalMessage("Payment successful!");
          confirmBooking(response.razorpay_payment_id,data.order_id);
        },
        prefill: {
          name: `${userDetails.firstname} ${userDetails.lastname}`,
          email: userDetails.email,
        },
        theme: { color: "#f12f3f" },
      });
      rzp.open();
    } catch (error) {
      setModalMessage("Issue with initiating payment.");
    }
  };

  const confirmBooking = async (paymentId: string,orderId:string) => {
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
        orderId
      });
      if (response.data.success) {
        const bookingDetails = response.data.booking;
        const qrCodeUrl = response.data.qrCodeUrl;
        const encodedBookingDetails = encodeURIComponent(JSON.stringify(bookingDetails));
        const encodedQrCodeUrl = encodeURIComponent(qrCodeUrl);
        const queryParams = new URLSearchParams({
          bookingDetails: encodedBookingDetails,
          qrCodeUrl: encodedQrCodeUrl,
        }).toString();
        router.push(`/user/booking-qr-code?${queryParams}`);
      } else {
        setModalMessage("Error confirming booking.");
      }
    } catch (error) {
      setModalMessage("Issue confirming booking.");
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const closeModal = () => {
    setModalMessage(null);
  };

  const formatMonth = (monthIndex: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex];
  };

  // Convert the showDate string into a Date object
  const dateObj = new Date(showDate);
  const day = dateObj.getDate();
  const month = formatMonth(dateObj.getMonth());

  return (
    <div className={styles.bookingConfirmation}>
      <div>
      <h1>Booking Confirmation</h1>
      <div className={styles.container}>
        <section className={styles.left}>
          <p>{day}</p>
          <p>{month}</p>
        </section>

        <section className={styles.right}>
          <p>{movieTitle}</p>
          <h2>{theatreId}</h2>
          <p className={styles.calendar}>{`${showDate} ${showTime}`}</p>

          <div className={styles.seatContainer}>
            <h4>Seats:</h4>
            {selectedSeats.map((seat, index) => (
              <span key={index} className={styles.seat}>{seat}</span>
            ))}
          </div>
          <div className={styles.phoneSection}>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
              className={styles.phoneInput}
            />
            {phoneError && <p className={styles.errorMessage}>{phoneError}</p>}
          </div>
          <div className={styles.priceWithButton}>
            <div className={styles.mapPin}><span>₹{totalPrice}</span> Total Price</div>
            <a onClick={handleRazorpayPayment} className={styles.confirmButton}>Confirm Booking</a>
          </div>
        </section>
      </div>

      {modalMessage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>{modalMessage}</p>
            <button onClick={closeModal} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BookingConfirmation;
