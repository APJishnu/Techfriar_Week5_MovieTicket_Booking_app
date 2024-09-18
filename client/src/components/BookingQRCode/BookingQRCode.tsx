"use client"; // Ensure this is at the top if you're using client-side hooks
import React,{useEffect,useState} from 'react';
import { useRouter } from 'next/navigation'; // Make sure to import useRouter if using Next.js
import styles from './BookingQRCode.module.css';
import GlobalLoader from '../Loader/Loader'

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
        // Set loading state to false after 2 seconds
        const timer = setTimeout(() => setLoading(false), 1000); // 2000ms = 2 seconds
        return () => clearTimeout(timer);
      }, []);

    const handleGoToHome = () => {
        router.push('/'); // Redirect to the home page
    };

    return (
    
        <div className={styles.container}>
          
            <div className={styles.scheduleSection}>
            {loading ? <GlobalLoader /> : <>
                <h2 className={styles.movieHeader}>{booking.movieTitle}</h2>
                <div className={styles.details}>
                 
                    {/* Uncomment if you want to display selected seats */}
                    {/* <p><strong>Seats:</strong> {booking.selectedSeats.join(', ')}</p> */}
                    {/* <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p> */}
                </div>

                <h3>Scan this QR code for booking details:</h3>
                <img src={qrCodeUrl} alt="Booking QR Code" className={styles.qrCodeImage} />

                <button
                    className={styles.button}
                    onClick={handleGoToHome}
                >
                    Go to Home
                </button>
                </>}
            </div>
           
        </div>
     
    );
};

export default BookingQRCode;
