"use client";

import React, { useState } from "react";
import axios from "axios";
import styles from '../../../styles/admin/addMovies.module.css';
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/api";

const AddMovies: React.FC = () => {
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    duration: "",
    genre: "",
    certification: "",
    releaseDate: "",
    imageUrl: "",
    director: "",
    cast: "",
    imdbRating: "",
    language: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData({ ...movieData, [name]: value });
  };

  const handleSearch = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.get(`${API_URL}/api/admin/movies-lookup`, {
        params: {
          title: searchTitle,
          year: searchYear
        }
      });

      if (response.data) {
        const movie = response.data;
        setMovieData({
          title: movie.Title,
          description: movie.Plot,
          duration: movie.Runtime,
          genre: movie.Genre,
          certification: movie.Rated,
          releaseDate: formatReleaseDate(movie.Released),
          imageUrl: movie.Poster,
          director: movie.Director,
          cast: movie.Actors,
          imdbRating: movie.imdbRating,
          language: movie.Language
        });
        setSuccessMessage("Movie details fetched successfully.");
      } else {
        setErrorMessage("Movie not found.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error || "Failed to fetch movie details. Please try again."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", movieData.title);
    formData.append("description", movieData.description);
    formData.append("duration", movieData.duration);
    formData.append("genre", movieData.genre);
    formData.append("certification", movieData.certification);
    formData.append("releaseDate", movieData.releaseDate);
    formData.append("director", movieData.director);
    formData.append("cast", movieData.cast);
    formData.append("imdbRating", movieData.imdbRating);
    formData.append("language", movieData.language);

    // Always include imageUrl in the formData
    if (movieData.imageUrl) {
      formData.append("imageUrl", movieData.imageUrl);
    }

    // Include photo in the formData only if it's uploaded
    if (selectedFile) {
      formData.append("moviePhoto", selectedFile);
    }


    try {
      const response = await axios.post(`${API_URL}/api/admin/add-movies`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Movie added successfully!");
        setMovieData({
          title: "",
          description: "",
          duration: "",
          genre: "",
          certification: "",
          releaseDate: "",
          imageUrl: "",
          director: "",
          cast: "",
          imdbRating: "",
          language: "",
        });
        setSelectedFile(null);
        setTimeout(() => {
          router.push("/admin/movies-list");
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error || "Failed to add the movie. Please try again."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.mainSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add a New Movie</h2>
        </div>
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

        <div className={styles.inputGroup}>
          <div className={styles.searchInputWithButton}>
            <input
              type="text"
              placeholder="Movie Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Year"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className={styles.inputField}
            />
            <button type="button" onClick={handleSearch} className={styles.addButton}>
              Search
            </button>
          </div>
        </div>

        {(movieData.imageUrl || selectedFile) && (
          <form onSubmit={handleSubmit} className={styles.movieForm}>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="title"
                name="title"
                value={movieData.title}
                onChange={handleChange}
                required
                className={styles.inputFieldTitle}
                placeholder="Title"
              />
              <textarea
                id="description"
                name="description"
                value={movieData.description}
                onChange={handleChange}
                required
                className={styles.inputField}
                placeholder="Description"
              />
            </div>

            <div className={styles.imageGroup}>
              <div className={styles.imagePreview}>
                <img
                  src={
                    movieData.imageUrl
                      ? movieData.imageUrl
                      : selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : '/illustrations/userProfile.svg'
                  }
                  alt="Movie Poster"
                  className={styles.moviePoster}
                />

                <div className={styles.detailsRightImageDiv}>
                  <table className={styles.formTable}>
                    <tbody>
                      <tr>
                        <th>Duration</th>
                        <td>
                          <input
                            type="text"
                            id="duration"
                            name="duration"
                            value={movieData.duration}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Genre</th>
                        <td>
                          <input
                            type="text"
                            id="genre"
                            name="genre"
                            value={movieData.genre}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Certification</th>
                        <td>
                          <input
                            type="text"
                            id="certification"
                            name="certification"
                            value={movieData.certification}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Release Date</th>
                        <td>
                          <input
                            type="date"
                            id="releaseDate"
                            name="releaseDate"
                            value={movieData.releaseDate}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Director</th>
                        <td>
                          <input
                            type="text"
                            id="director"
                            name="director"
                            value={movieData.director}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Cast</th>
                        <td>
                          <input
                            type="text"
                            id="cast"
                            name="cast"
                            value={movieData.cast}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>IMDB Rating</th>
                        <td>
                          <input
                            type="number"
                            id="imdbRating"
                            name="imdbRating"
                            value={movieData.imdbRating}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Language</th>
                        <td>
                          <input
                            type="text"
                            id="language"
                            name="language"
                            value={movieData.language}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={styles.uploadGroup}>
              <label>Add Another poster</label>
              <input
                type="file"
                id="moviePhoto"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.inputField}
              />
            </div>
            <button type="submit" className={styles.addButton}>
              Add Movie
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMovies;
