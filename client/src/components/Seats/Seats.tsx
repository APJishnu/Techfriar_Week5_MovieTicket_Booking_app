"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Seats.module.css"; // Import the CSS module

interface Seat {
  seatNumber: string;
  isBooked: boolean;
}

interface SeatsProps {
  movieId: string;
  theatreId: string;
  showDate: string;
  showTime: string;
}

const Seats: React.FC<SeatsProps> = ({ movieId, theatreId, showDate, showTime }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // To track selected seats
  const [error, setError] = useState<string>("");
  const [movieTitle, setMovieTitle] = useState<string>("N/A"); // To track the movie title
  const [price, setPrice] = useState<number>(0); // To track price

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/seats", {
          params: {
            movieId,
            theatreId,
            showDate,
            showTime,
          },
        });
        setSeats(response.data.seats);
        setMovieTitle(response.data.movieTitle); // Get movie title from backend
        setPrice(150); // Set the price (you can update this dynamically)
      } catch (error) {
        setError("Failed to fetch seat details.");
      }
    };

    fetchSeats();
  }, [movieId, theatreId, showDate, showTime]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) {
      alert("This seat is already booked.");
      return;
    }

    if (selectedSeats.includes(seat.seatNumber)) {
      // Deselect if already selected
      setSelectedSeats(selectedSeats.filter(s => s !== seat.seatNumber));
    } else {
      // Select seat
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  // Calculate total price based on selected seats
  const totalPrice = selectedSeats.length * price;

  return (
    <div className={styles.seatsWrapper}>
      <div className={styles.seatsHeadingDiv}>
      <h2 className={styles.title}> {movieTitle} </h2>
      <p></p>
      <p className={styles.details}>{theatreId} | <span>{showDate} | {showTime}</span></p>

      {error && <p className={styles.error}>{error}</p>}
      </div>
      <div className={styles.seatsContainer}>
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            className={`${styles.seat} ${seat.isBooked ? styles.booked : selectedSeats.includes(seat.seatNumber) ? styles.selected : styles.available}`}
            onClick={() => handleSeatClick(seat)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <div className={styles.paymentSection}>
          <p className={styles.totalPrice}>Total Price: Rs. {totalPrice}</p>
          <button className={styles.payButton}>Pay Rs. {totalPrice}</button>
        </div>
      )}
    </div>
  );
};

export default Seats;
