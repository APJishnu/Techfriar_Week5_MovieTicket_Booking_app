import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSeats = async () => {
        console.log(theatreId)
      try {
        const response = await axios.get(`http://localhost:5000/api/seats`, {
          params: {
            movieId,
            theatreId,
            showDate,
            showTime,
          },
        });
        setSeats(response.data.seats);
      } catch (error) {
        setError("Failed to fetch seat details.");
      }
    };

    fetchSeats();
  }, [movieId, theatreId, showDate, showTime]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) {
      alert("This seat is already booked.");
    } else {
      // Handle seat selection
      alert(`You selected seat ${seat.seatNumber}`);
    }
  };

  return (
    <div>
      <h2>Seats for Movie {movieId} at Theatre {theatreId}</h2>
      <p>Date: {showDate}</p>
      <p>Time: {showTime}</p>

      {error && <p className="error">{error}</p>}

      <div className="seats-container">
        {seats.map((seat) => (
          <div
            key={seat.seatNumber}
            className={`seat ${seat.isBooked ? "booked" : "available"}`}
            onClick={() => handleSeatClick(seat)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seats;
