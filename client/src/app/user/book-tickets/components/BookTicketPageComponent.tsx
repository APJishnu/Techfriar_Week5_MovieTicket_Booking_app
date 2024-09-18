"use client"; // Ensure client-side rendering

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../book-tickets.module.css";
import Seats from "@/components/Seats/Seats";
import Popup from "./popup/Popup"; // Import the Popup component
import {isAuthenticated} from '../../../../utils/auth';

type Movie = {
  title: string;
  genre: string;
  language: string;
  duration: string;
  releaseDate: string;
  rating: number;
};

type ShowTime = {
  time: string;
  seats: { seatNumber: string; isBooked: boolean }[];
};

type ShowDate = {
  date: string;
  times: ShowTime[];
};

type TheaterSchedule = {
  theatreName: string;
  location: string;
  movies: {
    movieTitle: string;
    genre: string;
    language: string;
    releaseDate: string;
    rating: number;
    showDates: ShowDate[];
  }[];
};

interface SelectedShowtime {
  theatreId: string;
  date: string;
  time: string;
}

type WeekdayButtons = {
  [date: string]: { dayName: string; dayNumber: number; month: string };
};

const timeCategories: { [key: string]: string[] } = {
  Morning: ["06:30", "10:00"],
  Afternoon: ["13:30", "16:00"],
  Evening: ["19:30"],
  Night: ["23:00"],
};

const BookTicketPageComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [movieId, setMovieId] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaterSchedules, setTheaterSchedules] = useState<TheaterSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<TheaterSchedule[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchTheater, setSearchTheater] = useState<string>("");

  const [selectedTime, setSelectedTime] = useState<string>("All");
  const [weekdays, setWeekdays] = useState<WeekdayButtons>({});
  const [selectedShowtime, setSelectedShowtime] = useState<SelectedShowtime | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false); // Manage popup state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = searchParams.get("movieId");
      setMovieId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (movieId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/book-tickets/${movieId}`);
          const scheduleData = response.data;

          if (scheduleData.length > 0) {
            const movieDetails = scheduleData[0]?.movies[0];

            setMovie({
              title: movieDetails.movieTitle || "N/A",
              genre: movieDetails.genre || "N/A",
              language: movieDetails.language || "N/A",
              duration: movieDetails.duration || "N/A",
              releaseDate: new Date(movieDetails.releaseDate).toLocaleDateString() || "N/A",
              rating: movieDetails.rating || "N/A",
            });

            setTheaterSchedules(scheduleData);
            setFilteredSchedules(filterByDate(scheduleData, selectedDate));
            setWeekdays(calculateWeekdays());
          }
        } catch (error) {
          setErrorMessage("Failed to fetch schedule details.");
        }
      }
    };

    fetchSchedule();
  }, [movieId, selectedDate]);

  const calculateWeekdays = (): WeekdayButtons => {
    const today = new Date();
    const currentDayIndex = today.getDay();

    const daysUntilSunday = (7 - currentDayIndex) % 7;

    const weekdayButtons: WeekdayButtons = {};

    for (let i = 0; i <= daysUntilSunday; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const formattedDate = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'long' });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString('en-IN', { month: 'long' });

      weekdayButtons[formattedDate] = { dayName, dayNumber, month };
    }

    return weekdayButtons;
  };

  useEffect(() => {
    filterSchedules();
  }, [selectedDate, searchTheater, selectedTime, theaterSchedules]);

  const filterByDate = (schedules: TheaterSchedule[], date: string): TheaterSchedule[] => {
    return schedules
      .map((schedule) => ({
        ...schedule,
        movies: schedule.movies
          .map((movie) => ({
            ...movie,
            showDates: movie.showDates.filter(
              (showDate) => new Date(showDate.date).toISOString().split("T")[0] === date
            ),
          }))
          .filter((movie) => movie.showDates.length > 0),
      }))
      .filter((schedule) => schedule.movies.length > 0);
  };

  const filterSchedules = () => {
    let filtered = theaterSchedules;

    filtered = filterByDate(filtered, selectedDate);

    if (searchTheater.trim() !== "") {
      filtered = filtered.filter((schedule) =>
        schedule.theatreName.toLowerCase().includes(searchTheater.toLowerCase())
      );
    }

    if (selectedTime !== "All") {
      const timesToInclude = timeCategories[selectedTime] || [];
      filtered = filtered.map((schedule) => ({
        ...schedule,
        movies: schedule.movies.map((movie) => ({
          ...movie,
          showDates: movie.showDates.map((showDate) => ({
            ...showDate,
            times: showDate.times.filter((time) =>
              timesToInclude.includes(time.time)
            ),
          })).filter((showDate) => showDate.times.length > 0),
        })).filter((movie) => movie.showDates.length > 0),
      })).filter((schedule) => schedule.movies.length > 0);
    }

    setFilteredSchedules(filtered);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTheater(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleShowtimeClick = (theatreId: string, showDate: string, showTime: string) => {
    if (isAuthenticated()) {
      setSelectedShowtime({ theatreId, date: showDate, time: showTime });
    } else {
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleBackToSchedule = () => {
    setSelectedShowtime(null);
  };

  return (
    <section className={styles.scheduleSection}>
      {showPopup && (
        <Popup
          message="Please log in or register to book tickets."
          onClose={handlePopupClose}
        />
      )}
      {selectedShowtime ? (
        <div className={styles.seatsSection}>
          <button onClick={handleBackToSchedule} className={styles.backButton}>
            Back
          </button>
          <Seats
            movieId={movieId!}
            theatreId={selectedShowtime.theatreId}
            showDate={selectedShowtime.date}
            showTime={selectedShowtime.time}
          />
        </div>
      ) : (
        <>
          <div className={styles.movieHeader}>
            <h2>{movie?.title}</h2>
            {movie?.genre?.split(",").map((g, index) => (
              <span className={styles.genre} key={index}>
                {g.trim()}
                {index < (movie.genre?.split(",").length ?? 0) - 1 ? " " : ""}
              </span>
            ))}
            <p>{movie?.language} | {movie?.duration}</p>
            <p>Rating: {movie?.rating} | Release Date: {movie?.releaseDate}</p>
          </div>

          <div className={styles.filters}>
            {/* Weekday slider and filters */}
          </div>

          <div className={styles.scheduleList}>
            {filteredSchedules.length === 0 ? (
              <p className={styles.noSchedules}>No schedules found. Please try again later.</p>
            ) : (
              filteredSchedules.map((schedule) => (
                <div key={schedule.theatreName} className={styles.theatreContainer}>
                  <h3>{schedule.theatreName} - {schedule.location}</h3>
                  {schedule.movies.map((movie, movieIndex) => (
                    <div key={movie.movieTitle + movieIndex} className={styles.movieSchedule}>
                      {movie.showDates.map((showDate, dateIndex) => (
                        <div key={showDate.date + dateIndex} className={styles.dateSchedule}>
                          <h4>{new Date(showDate.date).toLocaleDateString()}</h4>
                          <div className={styles.showtimes}>
                            {showDate.times.map((showTime, timeIndex) => (
                              <button
                                key={showTime.time + timeIndex}
                                className={styles.showtimeButton}
                                onClick={() =>
                                  handleShowtimeClick(schedule.theatreName, showDate.date, showTime.time)
                                }
                              >
                                {showTime.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default BookTicketPageComponent;
