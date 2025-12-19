require("dotenv").config();
const userHelper = require("../helpers/user-helper");
const createRazorpayOrder = require("../config/razorpay");
const { sendWhatsAppMessage } = require("../config/sms-sender");
const { generateQRCode } = require("../config/qr-code");
const crypto = require("crypto");

module.exports = {
  // Route handlers
  getAllMoviesRouter: async (req, res) => {
    try {
      const movies = await userHelper.getAllMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMovieDetailsRouter: async (req, res) => {
    const { movieId } = req.params;
    try {
      const movieDetails = await userHelper.getMovieDetails(movieId);
      res.json({ movie: movieDetails });
    } catch (error) {
      res.status(500).json({ message: error.message, error });
    }
  },

  getMovieScheduleRouter: async (req, res) => {
    const { movieId } = req.params;
    try {
      const schedule = await userHelper.getMovieSchedule(movieId);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: error.message, error });
    }
  },

  getSeatsForShowtimeRouter: async (req, res) => {
    const { theatreId, movieId, showDate, showTime } = req.query;
    try {
      const result = await userHelper.getSeatsForShowtime(
        theatreId,
        movieId,
        showDate,
        showTime
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message, error });
    }
  },

  searchMoviesByTitleRouter: async (req, res) => {
    const { title } = req.query;
    try {
      const movies = await userHelper.searchMoviesByTitle(title);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createOrderRouter: async (req, res) => {
    const { amount } = req.body;
    try {
      const order = await createRazorpayOrder(amount);
      res.json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  confirmBookingRouter: async (req, res) => {
    const {
      userDetails,
      movieTitle,
      theatreId,
      showDate,
      showTime,
      selectedSeats,
      totalPrice,
      paymentId,
      orderId,
    } = req.body;
    try {
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET); // Secret key from Razorpay
      hmac.update(orderId + "|" + paymentId); // Order and payment ID concatenation
      const generatedSignature = hmac.digest("hex");

      // if (generatedSignature !== razorpay_signature) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Invalid payment signature" });
      // }

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

      await userHelper.updateMovieSchedule({
        theatreId,
        movieTitle,
        showDate,
        showTime,
        selectedSeats,
        userId: userDetails.userId,
      });

      const qrData = `
  🎬 Movie: ${movieTitle}
  🎟️ Theatre: ${theatreId}
  📅 Date: ${showDate}
  🕒 Time: ${showTime}
  🎫 Seats: ${selectedSeats.join(", ")}
  💵 Total Price: Rs. ${totalPrice}
  🧑‍🤝‍🧑 User: ${userDetails.firstname} ${userDetails.lastname}
  📧 Email: ${userDetails.email}
  📞 Phone: ${userDetails.phone}
  💳 Payment ID: ${paymentId}
`;
      const qrCodeUrl = await generateQRCode(qrData);

      const messageBody = `
      🎬 **Movie Booking Confirmation** 🎬
      
      Hi ${userDetails.firstname} ${userDetails.lastname} 👋,
      
      Your booking for the movie *"${movieTitle}"* has been successfully confirmed! 🎉
      
      **Booking Details:**
      🎟️ **Theatre:** ${theatreId}
      📅 **Date:** ${showDate}
      🕒 **Time:** ${showTime}
      🎫 **Seats:** ${selectedSeats.join(", ")}
      💵 **Total Price:** Rs. ${totalPrice}
      
      We look forward to seeing you at the movies! 🍿🎥
      
      Thank you for choosing us for your movie experience. If you have any questions, feel free to reach out.
      
      Enjoy your movie! 🎬🍿
      
      Best regards,  
      The CineMagic Team
      
      📞 Contact Us: 8714804072
      🌐 Visit Us: http://localHost:3000/
    `;

      const whatsappMessage = await sendWhatsAppMessage(
        userDetails.phone,
        messageBody,
        qrCodeUrl
      );
      res.json({ success: true, booking, qrCodeUrl });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getUserBookingsRouter: async (req, res) => {
    const userId = req.params.userId;
    try {
      const result = await userHelper.getUserBookings(userId);
      if (result.status === 204) {
        return res.status(404).json({ message: result.message });
      }
      res.status(200).json(result.data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error while fetching booking details." });
    }
  },
};
