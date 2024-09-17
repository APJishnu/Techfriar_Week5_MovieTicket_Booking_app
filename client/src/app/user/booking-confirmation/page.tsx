"use client"; // Ensure this runs only on the client side

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingConfirmation from "../../../components/BookingConfirmation/BookingConfirmation";
import styles from "../../../components/BookingConfirmation/BookingConfirmation.module.css";

interface UserDetails {
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

const BookingConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    userId: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // State to hold booking details (initialize with default values)
  const [movieTitle, setMovieTitle] = useState<string>("");
  const [theatreId, setTheatreId] = useState<string>("");
  const [showDate, setShowDate] = useState<string>("");
  const [showTime, setShowTime] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Fetch booking-related data from the URL search params
    if (searchParams) {
      setMovieTitle(searchParams.get("movieTitle") || "");
      setTheatreId(searchParams.get("theatreId") || "");
      setShowDate(searchParams.get("showDate") || "");
      setShowTime(searchParams.get("showTime") || "");
      setSelectedSeats(
        JSON.parse(decodeURIComponent(searchParams.get("selectedSeats") || "[]"))
      );
      setTotalPrice(parseFloat(searchParams.get("totalPrice") || "0"));
    }

    // Fetch user details from localStorage
    if (typeof window !== "undefined") {
      const storedUserDetails = localStorage.getItem("userData");
      if (storedUserDetails) {
        const parsedDetails = JSON.parse(storedUserDetails);
        setUserDetails({
          userId: parsedDetails._id || "",
          firstname: parsedDetails.firstname || "",
          lastname: parsedDetails.lastname || "",
          email: parsedDetails.email || "",
          phone: parsedDetails.phone || "",
        });
      }
    }
  }, [searchParams]);

  // Render the booking confirmation page
  return (
    <div className={styles.bookingConfirmationPage}>
      <BookingConfirmation
        userDetails={userDetails}
        movieTitle={movieTitle}
        theatreId={theatreId}
        showDate={showDate}
        showTime={showTime}
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default BookingConfirmationPage;
