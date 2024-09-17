// movieScheduleHelper.js
const {movieSchedule} = require('../models/admin-models'); // Adjust the path

// Helper function to remove the showtime after the movie ends
const removeMovieShowtime = async (scheduleId, movieId, date, time) => {
    try {
        // Find the schedule by ID
        const schedule = await movieSchedule.findById(scheduleId);
  
        if (!schedule) {
          return { success: false, message: 'Schedule not found' };
        }
  
        // Find the movie entry in the schedule
        const movieEntry = schedule.movies.find(movie => movie.movie._id.toString() === movieId);
  
        if (!movieEntry) {
          return { success: false, message: 'Movie not found in schedule' };
        }
  
        // Find the date entry to update
        const showDate = movieEntry.showDates.find(st => st.date === date);
  
        if (!showDate) {
          return { success: false, message: 'Date not found for movie in schedule' };
        }
  
        // Remove the specified time from the date
        showDate.times = showDate.times.filter(t => t.time !== time);
  
        if (showDate.times.length === 0) {
          // Remove the date entry if no times are left
          movieEntry.showDates = movieEntry.showDates.filter(st => st.date !== date);
        }
  
        if (movieEntry.showDates.length === 0) {
          // Remove the movie entry if no show dates are left
          schedule.movies = schedule.movies.filter(movie => movie.movie._id.toString() !== movieId);
        }
  
        // Check if there are no remaining movie entries
        if (schedule.movies.length === 0) {
          // Delete the entire schedule if no movies are left
          await movieSchedule.findByIdAndDelete(scheduleId);
          return { success: true, message: 'Schedule deleted successfully' };
        }
  
        // Save the updated schedule
        await schedule.save();
  
        return { success: true, message: 'Showtime deleted successfully' };
  
      } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete showtime' };
      }
};

module.exports = removeMovieShowtime;