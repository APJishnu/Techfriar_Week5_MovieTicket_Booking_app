// src/pages/booking-details/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import styles from './booking-details.module.css'; // Importing the CSS module
import { API_URL } from '../../../utils/api';

interface Booking {
    movie: string;
    theatre: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
    paymentId: string;
}

interface GroupedBookings {
    [movie: string]: Booking[];
}

const BookingDetails = () => {
    const [bookingData, setBookingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [expandedMovies, setExpandedMovies] = useState<string[]>([]);
    
    // States for filters
    const [movieFilter, setMovieFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const storedUserDetails = localStorage.getItem('userData');
        if (storedUserDetails) {
            const userDetails = JSON.parse(storedUserDetails);
            setUserId(userDetails._id); // Assuming the user ID is saved in 'userId' field
        }
    }, []);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`${API_URL}/api/booking-details/${userId}`);
                    setBookingData(response.data);
                    setLoading(false);
                } catch (err) {
                    setError('Error fetching booking details');
                    setLoading(false);
                }
            }
        };

        if (userId) {
            fetchBookingDetails();
        }
    }, [userId]);

    // Function to group bookings by movie name
    const groupBookingsByMovie = (bookings: Booking[]): GroupedBookings => {
        return bookings.reduce((grouped: GroupedBookings, booking: Booking) => {
            if (!grouped[booking.movie]) {
                grouped[booking.movie] = [];
            }
            grouped[booking.movie].push(booking);
            return grouped;
        }, {});
    };

    // Function to filter bookings
    const applyFilters = (bookings: Booking[]): Booking[] => {
        let filteredBookings = bookings;

        if (movieFilter) {
            filteredBookings = filteredBookings.filter((booking) =>
                booking.movie.toLowerCase().includes(movieFilter.toLowerCase())
            );
        }

        if (dateFilter) {
            filteredBookings = filteredBookings.filter((booking) =>
                booking.date === dateFilter
            );
        }

        return filteredBookings;
    };

    // Function to toggle movie details visibility
    const toggleMovieDetails = (movie: string) => {
        if (expandedMovies.includes(movie)) {
            setExpandedMovies(expandedMovies.filter((m) => m !== movie));
        } else {
            setExpandedMovies([...expandedMovies, movie]);
        }
    };

    // Function to download PDF slip for a booking
    const downloadPDF = (booking: Booking) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Booking Slip', 105, 20);
        doc.setFontSize(12);

        doc.text(`Movie: ${booking.movie}`, 20, 40);
        doc.text(`Theatre: ${booking.theatre}`, 20, 50);
        doc.text(`Date: ${booking.date}`, 20, 60);
        doc.text(`Time: ${booking.time}`, 20, 70);
        doc.text(`Seats: ${booking.seats.join(', ')}`, 20, 80);
        doc.text(`Total Price: ₹${booking.totalPrice}`, 20, 90);
        doc.text(`Payment ID: ${booking.paymentId}`, 20, 100);

        doc.save(`Booking_Slip_${booking.movie}_${booking.date}.pdf`);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>;

    const allBookings = bookingData ? bookingData.bookings : [];
    const filteredBookings = applyFilters(allBookings);
    const groupedBookings = groupBookingsByMovie(filteredBookings);

    return (
        <div className={styles.bookingDetailsContainer}>
            <h1 className={styles.mainHeader}>Booking Details</h1>

            {/* Filter Section */}
            <div className={styles.filterSection}>
                <input
                    type="text"
                    placeholder="Filter by movie name"
                    value={movieFilter}
                    onChange={(e) => setMovieFilter(e.target.value)}
                    className={styles.filterInput}
                />
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={styles.filterInput}
                />
            </div>

            {bookingData ? (
                <div className={styles.bookingCard}>
                    <div className={styles.userInfo}>
                        <h2>{`${bookingData.user.firstname} ${bookingData.user.lastname}`}</h2>
                        <p>Email: {bookingData.user.email}</p>
                        <p>Phone: {bookingData.user.phone}</p>
                    </div>

                    <div className={styles.bookingInfo}>
                        {Object.keys(groupedBookings).map((movie, index) => (
                            <div key={index} className={styles.movieGroup}>
                                <h3 onClick={() => toggleMovieDetails(movie)} className={styles.movieTitle}>
                                    {movie}
                                </h3>

                                {expandedMovies.includes(movie) && (
                                    <div className={styles.movieDetails}>
                                        {groupedBookings[movie].map((booking, i) => (
                                            <div key={i} className={styles.bookingItem}>
                                                <p>Theatre: <span>{booking.theatre}</span></p>
                                                <p>Date: <span>{booking.date}</span></p>
                                                <p>Time: <span>{booking.time}</span></p>
                                                <p>Seats: <span>{booking.seats.join(', ')}</span></p>
                                                <p>Total Price: <span>₹{booking.totalPrice}</span></p>
                                                <button
                                                    onClick={() => downloadPDF(booking)}
                                                    className={styles.downloadButton}
                                                >
                                                    Download Slip
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No booking details available.</p>
            )}
        </div>
    );
};

export default BookingDetails;
