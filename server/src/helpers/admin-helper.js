
const { Movie, Theatre, movieSchedule } = require('../models/admin-models');
const removeMovieShowtime = require('../helpers-helper/movie-schedule-helper');

const generateSeats = (capacity) => {
  const seats = [];
  const rows = Math.ceil(capacity / 20); // Assuming 10 seats per row
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let row = 0; row < rows; row++) {
    for (let seat = 1; seat <= 20; seat++) {
      const seatNumber = `${alphabet[row]}${seat}`;
      seats.push({
        seatNumber,
        isBooked: false,
        bookedBy: null
      });

      if (seats.length === capacity) break; // Stop when capacity is reached
    }
    if (seats.length === capacity) break;
  }
  return seats;
};


module.exports = {

  adminUser: async () => {
    // Dummy user data for illustration purposes
    const adminUser = {
      email: 'admin@example.com',
      password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeQmqMv5Upjc1J7uZ1dHAs5ZXOaK5iwk2' // bcrypt hash of 'adminpassword'
    };

    return adminUser
  },

  addMovie: async (movieDetails) => {
    try {
      // Check if a movie with the same title and release date already exists
      const existingMovie = await Movie.findOne({
        title: movieDetails.title,
        releaseDate: movieDetails.releaseDate
      });

      if (existingMovie) {
        return { error: "A movie with the same title and release date already exists." };
      }

      const movie = new Movie({
        title: movieDetails.title,
        description: movieDetails.description,
        duration: movieDetails.duration,
        genre: movieDetails.genre,
        certification: movieDetails.certification,
        releaseDate: movieDetails.releaseDate,
        image: movieDetails.imageUrl,
        director: movieDetails.director, // Add director
        cast: movieDetails.cast, // Add cast
        imdbRating: movieDetails.imdbRating, // Add IMDb rating
        language: movieDetails.language // Add language
      });

      const savedMovie = await movie.save();
      const movieId = savedMovie._id.toString();
      return movieId;

    } catch (error) {
      return error.message;
    }
  },

  addTheatre: async (theatreDetials) => {
    try {
      const newTheatre = new Theatre({
        theatreName: theatreDetials.theatreName,
        location: theatreDetials.location,
        screenResolution: theatreDetials.screenResolution,
        amenities: theatreDetials.amenities,
        capacity: theatreDetials.capacity

      });
      await newTheatre.save();

      const savedTheatre = await movie.save();
      theatreId = savedTheatre._id.toString()
      return (movieId);


    } catch (error) {
      return error
    }

  },



  getMoviesList: async () => {
    try {
      const movies = await Movie.find();
      return movies;
    } catch (error) {
      throw new Error('Error fetching movie details');
    }

  },


  deleteMovie: async (movieId) => {
    try {
      await Movie.findByIdAndDelete(movieId);

      return true;
    } catch (error) {
      throw new Error('Error deleting movie details');
    }

  },


  getTheatreList: async () => {
    try {
      const theatres = await Theatre.find();
      return theatres;
    } catch (error) {
      throw new Error('Error fetching theatre details');
    }

  },

  addMovieSchedule: async (movieId, theatreId, showtime) => {
    try {
      // Find the theatre
      const theatre = await Theatre.findById(theatreId);
      if (!theatre) {
        return { error: 'The specified theatre does not exist.' };
      }
  
      // Find the movie
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return { error: 'The specified movie does not exist.' };
      }
  
      const durationInMinutes = parseInt(movie.duration.split(' ')[0]);
      // Parse the showtime (e.g., '10:00 AM') to a Date object
      const showtimeDate = new Date(`${showtime.date} ${showtime.time}`);
  
      // Check if the showtime is in the future
      const currentTime = new Date();
      if (showtimeDate <= currentTime) {
        return { error: 'Showtime must be in the future.' };
      }
  
      // Calculate the end time by adding the movie duration
      const endTime = new Date(showtimeDate);
      endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
  
      // Find or create the schedule for the theatre
      let schedule = await movieSchedule.findOne({ theatre: theatreId });
  
      if (!schedule) {
        // Create a new schedule if none exists
        schedule = new movieSchedule({
          theatre: theatreId,
          movies: [{
            movie: movieId,
            showDates: [{
              date: showtime.date,
              times: [{
                time: showtime.time,
                seats: generateSeats(theatre.capacity)
              }]
            }]
          }]
        });
        await schedule.save();
      } else {
        // Check for conflicts
        const conflictingMovie = schedule.movies.find(m => {
          return m.showDates.some(d => {
            return d.date === showtime.date && d.times.some(t => t.time === showtime.time);
          });
        });
  
        if (conflictingMovie) {
          return { error: 'A movie is already scheduled at this time on the same date in this theatre.' };
        }
  
        // Update the existing schedule
        const movieEntry = schedule.movies.find(m => m.movie.toString() === movieId.toString());
  
        if (movieEntry) {
          // Update existing movie schedule
          let dateEntry = movieEntry.showDates.find(d => d.date === showtime.date);
  
          if (dateEntry) {
            // Check for existing time
            let timeEntry = dateEntry.times.find(t => t.time === showtime.time);
  
            if (timeEntry) {
              return { error: 'A schedule for the same movie, date, and time already exists.' };
            } else {
              // Add new time with seats
              dateEntry.times.push({
                time: showtime.time,
                seats: generateSeats(theatre.capacity)
              });
            }
          } else {
            // Add new date with time and seats
            movieEntry.showDates.push({
              date: showtime.date,
              times: [{
                time: showtime.time,
                seats: generateSeats(theatre.capacity)
              }]
            });
          }
        } else {
          // Add new movie to the schedule
          schedule.movies.push({
            movie: movieId,
            showDates: [{
              date: showtime.date,
              times: [{
                time: showtime.time,
                seats: generateSeats(theatre.capacity)
              }]
            }]
          });
        }
        await schedule.save();
      }
  
      // Set a timeout to automatically remove the showtime after the movie's duration
      const timeUntilRemoval = endTime - currentTime; // Calculate time until movie ends
  
      if (timeUntilRemoval > 0) {
        setTimeout(async () => {
          await removeMovieShowtime(schedule._id, movieId, showtime.date, showtime.time);
        }, timeUntilRemoval);
      }
  
      return { message: 'Movie schedule updated successfully!' };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to update movie schedule. Please try again.' };
    }
  },



  getSchedulesList: async () => {
    try {
      const schedules = await movieSchedule.find()
        .populate('theatre', 'theatreName') // Populate theatre name
        .populate('movies.movie', 'title') // Populate movie title
        .exec(); // Use exec() to get the results

      return schedules;
    } catch (error) {
      throw error;
    }
  },

  deleteShowtime: async (scheduleId, movieId, date, time) => {
    try {
      const result = await removeMovieShowtime(scheduleId, movieId, date, time);

      if (!result.success) {
        return { success: false, message: result.message };
      }

      return { success: true, message: 'Showtime deleted successfully' };

    } catch (error) {
      return { success: false, message: 'Failed to delete showtime' };
    }
  },






}