
const express = require("express");
const router = express.Router();
require('dotenv').config();

const userHelper = require('../helpers/user-helper')
const createRazorpayOrder = require('../config/razorpay')
const {sendWhatsAppMessage} = require('../config/sms-sender');



// Get all movies
router.get('/all-movies', async (req, res) => {
  try {
    const movies = await userHelper.getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/movie-details/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    // Fetch the movie details using the helper function
    const movieDetails = await userHelper.getMovieDetails(movieId);
    // Return the movie details
    res.json({ movie: movieDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
});


router.get('/book-tickets/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
    const schedule = await userHelper.getMovieSchedule(movieId);
    console.log(schedule);
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
});


router.get('/seats', async (req, res) => {
  const { theatreId, movieId, showDate, showTime } = req.query;
  try {
    const result = await userHelper.getSeatsForShowtime(theatreId, movieId, showDate, showTime);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, error });
  }
});



router.get('/search-movies', async (req, res) => {
  const { title } = req.query;
  try {
    const movies = await userHelper.searchMoviesByTitle(title);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





router.post('/razorpay-order', async (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  try {
    const order = await createRazorpayOrder(amount);
    res.json({ success: true, order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



router.post('/confirm-booking', async (req, res) => {
  const { userDetails, movieTitle, theatreId, showDate, showTime, selectedSeats, totalPrice, paymentId } = req.body;
  try {
    console.log(userDetails);

    // Save the booking details in your database
    const booking = await userHelper.confirmBooking({
      userDetails,
      movieTitle,
      theatreId,
      showDate,
      showTime,
      selectedSeats,
      totalPrice,
      paymentId,
    });
    // Update the movie schedule by marking the selected seats as booked
    await userHelper.updateMovieSchedule({
      theatreId,
      movieTitle,
      showDate,
      showTime,
      selectedSeats,
      userId: userDetails.userId,
    });
    // Generate a QR code containing booking details
    const qrData = `
     Movie: ${movieTitle}
     Theatre: ${theatreId}
     Date: ${showDate}
     Time: ${showTime}
     Seats: ${selectedSeats.join(", ")}
     Total Price: Rs. ${totalPrice}
   `;
    const qrCodeUrl = await generateQRCode(qrData);

    const messageBody = `
      Hello ${userDetails.firstname} ${userDetails.lastname},
      Your booking for the movie "${movieTitle}" has been confirmed!
      Details:
      - Theatre: ${theatreId}
      - Date: ${showDate}
      - Time: ${showTime}
      - Seats: ${selectedSeats.join(", ")}
      - Total Price: Rs. ${totalPrice}
   
      Thank you for booking with us!
    `;
    // Sending the WhatsApp message to the user's phone number
    const whatsappMessage = await sendWhatsAppMessage(userDetails.phone, messageBody);

    console.log('WhatsApp message sent:', whatsappMessage.sid);

    console.log(booking, qrCodeUrl);

    res.json({ success: true, booking, qrCodeUrl });
  } catch (error) {
    console.error('Error confirming booking or sending WhatsApp message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/booking-details/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log("hai", userId)

  try {
    const result = await userHelper.getUserBookings(userId);
    console.log(result)
    if (result.status === 204) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error('Error in booking details route:', error);
    res.status(500).json({ message: 'Server error while fetching booking details.' });
  }
});


module.exports = router;