const express = require('express');
const router = express.Router();
const userRouter = require('./user-routes');
const adminRouter = require('./admin-routes');
const upload = require('../config/multer');


//User Routes
router.get('/all-movies', userRouter.getAllMoviesRouter);
router.get('/movie-details/:movieId', userRouter.getMovieDetailsRouter);
router.get('/book-tickets/:movieId', userRouter.getMovieScheduleRouter);
router.get('/seats', userRouter.getSeatsForShowtimeRouter);
router.get('/search-movies', userRouter.searchMoviesByTitleRouter);
router.post('/razorpay-order', userRouter.createOrderRouter);
router.post('/confirm-booking', userRouter.confirmBookingRouter);
router.get('/booking-details/:userId', userRouter.getUserBookingsRouter);



// Admin Routes
router.post('/admin/admin-login', adminRouter.adminLoginRouter);
router.get('/admin/movies-lookup', adminRouter.searchMoviesByTitleRouter);
router.post('/admin/add-movies', upload.single('moviePhoto'), adminRouter.addMovieRouter);
router.post('/admin/add-theatre', adminRouter.addTheatreRouter);
router.get('/admin/movies-list', adminRouter.getMoviesListRouter);
router.delete('/admin/movie-delete/:id', adminRouter.deleteMovieRouter);
router.get('/admin/theatre-list', adminRouter.getTheatreListRouter);
router.delete('/admin/Theatre-delete/:id', adminRouter.deleteTheatreRouter);
router.post('/admin/add-movie-schedule', adminRouter.addMovieScheduleRouter);
router.get('/admin/schedule-details', adminRouter.getScheduleDetailsRouter);
router.delete('/admin/schedule/:scheduleId/showtime', adminRouter.deleteShowtimeRouter);


module.exports = router;    