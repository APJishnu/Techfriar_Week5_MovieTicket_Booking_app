const express = require('express');
const router = express.Router();
const adminHelper = require('../helpers/admin-helper');
const adminApi = require('../helpers/admin-api');
const axios = require('axios');

// Route handlers
module.exports = {
  searchMoviesByTitleRouter: async (req, res) => {
    try {
      const { title, year } = req.query;
      const searchMovieApi = await adminApi.searchMovie(title, year);
      const movieDetails = await axios.get(searchMovieApi);

      if (movieDetails.data.Response === 'False') {
        res.status(200).json({ message: 'Failed to fetch movie details.', error: movieDetails.data.Error });
      } else {
        res.status(200).json(movieDetails.data);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch movie details.', error: error.message });
    }
  },

  addMovieRouter: async (req, res) => {
    try {
      const { title, description, duration, genre, certification, releaseDate, imageUrl, director, cast, imdbRating, language } = req.body;

      if (!title || !description || !duration || !genre || !certification || !releaseDate) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
      }

      const movieDetails = {
        title,
        description,
        duration,
        genre,
        certification,
        releaseDate,
        imageUrl,
        director,
        cast: cast.split(',').map(actor => actor.trim()),
        imdbRating,
        language
      };

      const storedMovieDetails = await adminHelper.addMovie(movieDetails);

      if (storedMovieDetails.error) {
        return res.status(400).json({ error: storedMovieDetails.error });
      }

      res.status(200).json({ success: true, message: 'Movie added successfully!', movieId: storedMovieDetails });
    } catch (error) {
      console.error('Error while adding movie:', error);
      res.status(500).json({ error: 'An error occurred while adding the movie. Please try again.' });
    }
  },

  addTheatreRouter: async (req, res) => {
    try {
      const theatreData = req.body;
      const storedTheatreDetails = await adminHelper.addTheatre(theatreData);
      res.status(200).json({ message: 'Theatre added successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add the theatre. Please try again.' });
    }
  },

  getMoviesListRouter: async (req, res) => {
    try {
      const moviesDetails = await adminHelper.getMoviesList();
      res.status(200).json(moviesDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch movie details. Please try again.' });
    }
  },

  deleteMovieRouter: async (req, res) => {
    try {
      const movieId = req.params.id;
      const deletedMovie = await adminHelper.deleteMovie(movieId);

      if (!deletedMovie) {
        return res.status(204).json({ message: 'Movie not found' });
      }

      res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({ message: 'Failed to delete the movie. Please try again.' });
    }
  },

  getTheatreListRouter: async (req, res) => {
    try {
      const theatres = await adminHelper.getTheatreList();
      res.status(200).json(theatres);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch theatres. Please try again.' });
    }
  },

  addMovieScheduleRouter: async (req, res) => {
    const { movie, theatre, showtime } = req.body;

    try {
      if (!movie || !theatre || !showtime || !showtime.date || !showtime.time) {
        return res.status(400).json({ error: 'Movie, theatre, and showtime (including date and time) are required.' });
      }

      const addedSchedule = await adminHelper.addMovieSchedule(movie, theatre, showtime);
      if (addedSchedule.error) {
        return res.status(400).json({ error: addedSchedule.error });
      }

      res.status(201).json({ message: 'Movie scheduled successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to schedule the movie. Please try again.' });
    }
  },

  getScheduleDetailsRouter: async (req, res) => {
    try {
      const schedules = await adminHelper.getSchedulesList();
      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      res.status(500).json({ error: 'Failed to fetch schedule details' });
    }
  },

  deleteShowtimeRouter: async (req, res) => {
    const { scheduleId } = req.params;
    const { movieId, date, time } = req.body;

    try {
      const result = await adminHelper.deleteShowtime(scheduleId, movieId, date, time);
      if (result.success) {
        return res.json({ message: result.message });
      } else {
        return res.json(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete showtime', error });
    }
  }
};