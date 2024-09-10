const mongoose = require('mongoose');
const { Movie, movieSchedule } = require('../models/admin-models');

module.exports = {
  getAllMovies: async () => {
    try {
      // Find all schedules and extract movie IDs
      const schedules = await movieSchedule.find().populate('movies.movie');
      
      // Extract movies from the schedules
      const movies = schedules.flatMap(schedule => 
        schedule.movies.map(movieEntry => movieEntry.movie)
      );
  
      // Ensure unique movies
      const uniqueMovies = Array.from(new Map(movies.map(movie => [movie._id.toString(), movie])).values());
  
      return uniqueMovies;
    } catch (error) {
      console.error('Error fetching all movies:', error);
      throw new Error('Error fetching all movies');
    }
  }
};
