"use client";
// Ensure this is at the top if you're using client-side hooks
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Make sure to import useRouter if using Next.js
import styles from './BookingQRCode.module.css';
import GlobalLoader from '../Loader/Loader';

interface BookingQRCodeProps {
  booking: {
    movieTitle: string;
    theatreId: string;
    showDate: string;
    showTime: string;
    selectedSeats: string[]; // Uncomment if you want to display selected seats
    totalPrice: number;
  };
  qrCodeUrl: string;
}

const BookingQRCode: React.FC<BookingQRCodeProps> = ({ booking, qrCodeUrl }) => {
  const router = useRouter(); // Use the router to navigate to the home page
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading state to false after 1 second
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToHome = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <div className={styles.mainDiv}>
    <div className={styles.card}>
      <button className={styles.dismiss} onClick={handleGoToHome}>×</button>

      <div className={styles.header}>
        <div className={styles.image}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M20 7L9.00004 18L3.99994 13"></path>
          </svg>
        </div>

        <div className={styles.content}>
          <span className={styles.title}>{booking.movieTitle} Confirmed!</span>
          <p className={styles.message}>Your booking is successful. Scan the QR code below to view the details.</p>
        </div>

        {loading ? <GlobalLoader /> : (
          <>
            <img src={qrCodeUrl} alt="Booking QR Code" className={styles.qrCodeImage} />
            <div className={styles.actions}>
              <button className={styles.history} onClick={handleGoToHome}>Go to Home</button>
              <button className={styles.track} onClick={() => router.push('/user/booking-details')}>Track My Booking</button>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default BookingQRCode;
