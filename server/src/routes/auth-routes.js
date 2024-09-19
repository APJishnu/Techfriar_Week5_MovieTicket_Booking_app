// routes/auth-router.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/auth-middleware');
const sendEmail = require('../config/mailer');
const { sendSms } = require('../config/sms-sender');
const authValidation = require('../helpers/auth-helper');
const router = express.Router();
const userHelper = require('../helpers/user-helper')


// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'https://techfriar-week5-movie-ticket-booking-app-f73m.vercel.app/',
}), (req, res) => {
  // Create a JWT token
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('authToken', token, { httpOnly: true, maxAge: 3600 * 1000 }); // 1 hour in milliseconds
  // Redirect with token only
  res.redirect(`https://techfriar-week5-movie-ticket-booking-app-f73m.vercel.app/user/email-verification?token=${token}`);
});


router.get('/user-details', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming verifyToken middleware adds user to req
    const user = await userHelper.getUserDetails(userId);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});


// Route to send OTP
router.post('/send-otp', async (req, res) => {
  const { field, value } = req.body;
  try {
    // Generate a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    // Define expiry time for the OTP (1 minute from now)
    const expiryTime = Date.now() + 60 * 1000; // Current time + 60 seconds

    req.session.otp = {
      field,
      value,
      otp,
      expiryTime
    };

    const subject = 'Your OTP for Verification';
    const text = `Your OTP is ${otp}`;
    const html = `<p>Your OTP is <strong>${otp}</strong></p>`;

    if (field === 'email') {
      const response = await sendEmail(value, subject, text, html);
      if (response) {
        res.status(200).json({ message: 'OTP sent successfully.' });
      } else {
        res.status(200).json({ message: 'Failed to send OTP. Please try again later.' });
      }


    } else if (field == 'phone') {
      const response = await sendSms(value, otp);
      if (response) {
        res.status(200).json({ message: 'OTP sent successfully.' });
      } else {
        res.status(200).json({ message: 'Failed to send OTP. Please try again later.' });
      }
    }

  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }

});


// Route to verify OTP
router.post('/verify-otp', async (req, res) => {

  const { field, value, otp, userId } = req.body;
  try {
    console.log(req.session);
    
    const sessionOtp = req.session.otp;

    if (!sessionOtp) {
      return res.status(200).json({ message: 'No OTP found. Please request an OTP first.' });
    }
    // Check if OTP has expired
    if (Date.now() > sessionOtp.expiryTime) {
      return res.status(200).json({ message: 'OTP has expired.' });
    }

    // Validate that the OTP matches
    if (otp === sessionOtp.otp && field === sessionOtp.field && value === sessionOtp.value) {
      const date = Date.now();

      if (field === "email") {
        await authValidation.emailVerified(value, date);
      } else if (field === "phone") {
        await authValidation.phoneVerified(value, date, userId);
      }
      req.session.otp = null; // Optionally, clear OTP from session
      res.status(200).json({ verified: true });
    } else {
      res.status(200).json({ message: 'Invalid OTP.' });
    }
  } catch (err) {
    req.session.otp = null;
    res.status(500).json({ message: 'An error occurred during OTP verification.' });
  }
});


module.exports = router;

