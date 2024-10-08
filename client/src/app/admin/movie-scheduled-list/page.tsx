"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../../styles/admin/movieScheduleList.module.css";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/api";

interface ShowTime {
  time: string;
  seats: {
    seatNumber: string;
    isBooked: boolean;
  }[];
}

interface ShowDate {
  date: string;
  times: ShowTime[];
}

interface Movie {
  _id: string;
  title: string;
}

interface Theatre {
  _id: string;
  theatreName: string;
}

interface Schedule {
  _id: string;
  theatre: Theatre;
  movies: {
    movie: Movie;
    showDates: ShowDate[];
  }[];
}

const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [showModal, setShowModal] = useState<boolean>(false); // State for modal
  const [scheduleToDelete, setScheduleToDelete] = useState<{
    scheduleId: string;
    movieId: string;
    date: string;
    time: string;
  } | null>(null); // Track which schedule to delete
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/schedule-details`);
        setSchedules(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch schedules.");
      }
    };
    fetchSchedules();
  }, []);

  // Group schedules by theatre name, but only include those with movies
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const theatreName = schedule.theatre?.theatreName;
    if (theatreName && schedule.movies.length > 0) {
      if (!acc[theatreName]) {
        acc[theatreName] = [];
      }
      acc[theatreName].push(schedule);
    }
    return acc;
  }, {} as { [theatreName: string]: Schedule[] });

  // Function to handle delete confirmation
  const confirmDeleteShowtime = (scheduleId: string, movieId: string, date: string, time: string) => {
    setScheduleToDelete({ scheduleId, movieId, date, time });
    setShowModal(true);
  };

  // Function to handle the actual deletion
  const handleDeleteShowtime = async () => {
    if (!scheduleToDelete) return;

    const { scheduleId, movieId, date, time } = scheduleToDelete;

    try {
      await axios.delete(`${API_URL}/api/admin/schedule/${scheduleId}/showtime`, {
        data: { movieId, date, time },
      });

      setSchedules((prevSchedules) =>
        prevSchedules
          .map((schedule) => {
            if (schedule._id === scheduleId) {
              const updatedMovies = schedule.movies
                .map((movieSchedule) => {
                  if (movieSchedule.movie?._id === movieId) {
                    const updatedShowDates = movieSchedule.showDates
                      .map((showDate) => ({
                        ...showDate,
                        times: showDate.times.filter((t) => t.time !== time),
                      }))
                      .filter((showDate) => showDate.times.length > 0);

                    return { ...movieSchedule, showDates: updatedShowDates };
                  }
                  return movieSchedule;
                })
                .filter((movieSchedule) => movieSchedule.showDates.length > 0);

              return { ...schedule, movies: updatedMovies };
            }
            return schedule;
          })
          .filter((schedule) => schedule.movies.length > 0)
      );

      setShowModal(false); // Close modal after deletion
    } catch (error) {
      setErrorMessage("Failed to delete showtime.");
    }
  };

  // Filtered schedules based on search term
  const filteredSchedules = Object.keys(groupedSchedules)
    .filter((theatreName) =>
      theatreName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reduce((acc, theatreName) => {
      acc[theatreName] = groupedSchedules[theatreName];
      return acc;
    }, {} as { [theatreName: string]: Schedule[] });

  return (
    <div className={styles.mainSection}>
      <div className={styles.container}>
        <div className={styles.headingWithButton}>
          <h2>Schedules</h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by theatre name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <button
            className={styles.addButton}
            onClick={() => router.push("/admin/movie-schedule")}
          >
            Add Schedule
          </button>
        </div>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.cardContainer}>
          {Object.keys(filteredSchedules).length > 0 ? (
            Object.keys(filteredSchedules).map((theatreName, index) => (
              <div key={theatreName} className={styles.theatreCard}>
                <h3>
                  {index + 1}. {theatreName}
                </h3>

                {filteredSchedules[theatreName].map((schedule) => (
                  <div key={schedule._id} className={styles.movieCard}>
                    <div className={styles.movieContent}>
                      <div className={styles.movieDetails}>
                        {schedule.movies.map((movieSchedule) => {
                          const movieId = movieSchedule.movie?._id;
                          if (!movieId) {
                            return null;
                          }

                          return (
                            <div key={movieId} className={styles.movieDetailsSection}>
                              <div className={styles.movieTitle}>
                                {movieSchedule.movie?.title || "No Title"}
                              </div>
                              {Array.isArray(movieSchedule.showDates) && movieSchedule.showDates.length > 0 ? (
                                movieSchedule.showDates
                                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                  .map((showDate) => (
                                    <div key={showDate.date} className={styles.dateCard}>
                                      <strong>{showDate.date}</strong>
                                      {showDate.times
                                        .sort((a, b) => a.time.localeCompare(b.time))
                                        .map((showTime) => (
                                          <div key={`${showDate.date}-${showTime.time}`} className={styles.showtime}>
                                            <span>{showTime.time}</span>
                                            <img
                                              src="/admin/trash.svg"
                                              alt="Delete Showtime"
                                              className={styles.deleteIcon}
                                              onClick={() =>
                                                confirmDeleteShowtime(
                                                  schedule._id,
                                                  movieId,
                                                  showDate.date,
                                                  showTime.time
                                                )
                                              }
                                            />
                                          </div>
                                        ))}
                                    </div>
                                  ))
                              ) : (
                                <p>No showtimes available for this movie.</p>
                              )}
                            </div>
                          );
                        })}

                        {schedule.movies.length === 0 && (
                          <p>No movies available for this schedule.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className={styles.emptyMessage}>No schedules available.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className={styles.confirmationModal}>
          <p>Are you sure you want to delete this showtime?</p>
          <div><button onClick={handleDeleteShowtime} className={styles.confirmButton}>
            Delete
          </button>
          <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
            Cancel
          </button></div>
          
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
