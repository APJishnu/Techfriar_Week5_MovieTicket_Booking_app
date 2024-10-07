"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/admin/moviesList.module.css';
import { API_URL } from '@/utils/api';

interface Movie {
    _id: string;
    title: string;
    description: string;
    duration: string;
    genre: string;
    certification: string;
    releaseDate: string;
    image: string;
    photo: string;
}

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false); // State for confirmation popup
    const [movieToDelete, setMovieToDelete] = useState<string | null>(null); // Store the ID of the movie to delete
    const router = useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/admin/movies-list`);
                setMovies(response.data);
                setFilteredMovies(response.data);  // Set both movies and filteredMovies initially
            } catch (error) {
                setErrorMessage('Failed to fetch movies. Please try again later.');
            }
        };
        fetchMovies();
    }, []);

    // Search filtering logic
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(query) ||
            movie.genre.toLowerCase().includes(query)
        );
        setFilteredMovies(filtered);
    };

    const handleDeleteConfirmation = (movieId: string) => {
        setMovieToDelete(movieId); // Set the movie ID to delete
        setShowConfirmation(true); // Show the confirmation popup
    };

    const handleDelete = async () => {
        if (!movieToDelete) return; // If there's no movie to delete, exit
        try {
            await axios.delete(`${API_URL}/api/admin/movie-delete/${movieToDelete}`);
            setMovies(movies.filter((movie) => movie._id !== movieToDelete));
            setFilteredMovies(filteredMovies.filter((movie) => movie._id !== movieToDelete)); // Reflect in filtered list too
            setShowConfirmation(false); // Close the confirmation popup
            setMovieToDelete(null); // Reset movieToDelete
        } catch (error) {
            setErrorMessage('Failed to delete the movie. Please try again.');
        }
    };

    return (
        <section className={styles.mainSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Movie List</h2>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            className={styles.searchInput}
                            placeholder="Search by title or genre..."
                        />
                    </div>
                    <button className={styles.addButton} onClick={() => router.push('/admin/add-movies')}>Add Movie</button>
                </div>

                {errorMessage && <div className={styles.error}>{errorMessage}</div>}

                {filteredMovies.length > 0 ? (
                    <div className={styles.movieTable}>
                        {filteredMovies.map((movie, index) => (
                            <div key={movie._id} className={styles.movieCard}>
                                <span className={styles.movieIndex}>{index + 1}</span>
                                <img
                                    src={movie.photo ? `${API_URL}${movie.photo}` : movie.image}
                                    alt={movie.title}
                                    className={styles.movieImage}
                                />
                                <div className={styles.movieContent}>
                                    <div className={styles.movieHeader}>
                                        <span className={styles.movieTitle}>{movie.title}</span>
                                        <div className={styles.movieDetails}>
                                            <span className={styles.movieDetail}>{movie.genre}</span>
                                            <span className={styles.movieDetail}>{movie.duration}</span>
                                            <span className={styles.movieDetail}>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                                            <span className={styles.movieDetail}>{movie.certification}</span>
                                        </div>
                                    </div>
                                    <div className={styles.movieDescription}>
                                        {movie.description}
                                    </div>
                                </div>
                                <div className={styles.movieActions}>
                                    <button onClick={() => handleDeleteConfirmation(movie._id)} className={styles.deleteButton}>
                                        Delete
                                    </button>
                                    <button className={styles.editButton}>Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h3 className={styles.emptyMessage}>No movies available</h3>
                )}

                {/* Confirmation Popup */}
                {showConfirmation && (
                    <div className={styles.confirmationPopup}>
                        <div className={styles.popupContent}>
                            <h3>Are you sure you want to delete this movie?</h3>
                            <div className={styles.popupActions}>
                                <button onClick={handleDelete} className={styles.confirmButton}>Yes</button>
                                <button onClick={() => setShowConfirmation(false)} className={styles.cancelButton}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MovieList;
