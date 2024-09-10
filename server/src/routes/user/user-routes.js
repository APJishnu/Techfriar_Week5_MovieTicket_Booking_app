
const { Movie, Theatre, movieSchedule } = require('../../models/admin-models')
const express = require("express");
const userHelper = require('../../helpers/user-helper')
const router = express.Router();


// Get all movies
router.get('/all-movies', async (req, res) => {
  try {
    const movies = await userHelper.getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/movie-details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the movie details
    const movie = await Movie.findById(id).exec();

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    console.log(movie)

    // Return movie details with the additional fields: cast, crew, rating, IMDb rating, and language
    res.json({
      movie: {
        _id: movie._id,
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        genre: movie.genre,
        certification: movie.certification,
        releaseDate: movie.releaseDate,
        image: movie.image,
        director: movie.director,  // Adding director
        cast: movie.cast,          // Adding cast
        imdbRating: movie.imdbRating,  // Adding IMDb rating
        language: movie.language    // Adding language
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch movie details', error });
  }
});

// backend/routes/movieRoutes.js
router.get('/book-tickets/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const schedule = await movieSchedule.find({ 'movies.movie': movieId })
      .populate('theatre')
      .populate('movies.movie')
      .exec();

    if (!schedule || schedule.length === 0) {
      return res.status(404).json({ message: 'No schedule found for this movie' });
    }

    // Transform the data if necessary here before sending it to the client
    const transformedSchedule = schedule.map(theatreSchedule => ({
      theatreName: theatreSchedule.theatre.theatreName,
      location: theatreSchedule.theatre.location,
      movies: theatreSchedule.movies
        .filter(movie => movie.movie._id.toString() === movieId) // Filter to get the specific movie
        .map(movie => ({
          movieTitle: movie.movie.title,
          genre: movie.movie.genre,
          language: movie.movie.language,
          imdbRating: movie.movie.imdbRating,
          duration: movie.movie.duration,
          releaseDate: movie.movie.releaseDate,
          showDates: movie.showDates.map(showDate => ({
            date: showDate.date,
            times: showDate.times.map(time => ({
              time: time.time,
              seats: time.seats
            }))
          }))
        }))
    }));

    console.log(transformedSchedule)
    res.json(transformedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch schedule', error });
  }
});



router.get('/seats', async (req, res) => {
  const { theatreId, movieId, showDate, showTime } = req.query;

  try {
    // Find the theatre by name
    const theatre = await Theatre.findOne({ theatreName: theatreId }).exec();
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    // Find the schedule using the theatre's ObjectId
    const schedule = await movieSchedule.findOne({
      'theatre': theatre._id,
      'movies.movie': movieId,
      'movies.showDates.date': showDate,
      'movies.showDates.times.time': showTime
    }).populate({
      path: 'movies.showDates.times',
      match: { time: showTime }
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Seats not found for this showtime' });
    }

    const showtime = schedule.movies.flatMap(movie =>
      movie.showDates.find(date => date.date === showDate)
    )?.times.find(time => time.time === showTime);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    console.log(showtime.seats)
    // Return the seats for the found showtime
    res.json({ seats: showtime.seats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch seats', error });
  }
});


module.exports = router;