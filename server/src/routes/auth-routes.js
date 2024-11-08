// routes/auth-router.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/auth-middleware");
const sendEmail = require("../config/mailer");
const router = express.Router();
const userHelper = require("../helpers/user-helper");

// Google authentication route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
  }),
  (req, res) => {
    // Create a JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Redirect with token only
    res.redirect(
      `${process.env.FRONTEND_URL}/user/email-verification?token=${token}`
    );
  }
);

router.get("/user-details", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming verifyToken middleware adds user to req
    const user = await userHelper.getUserDetails(userId);

    res.json(user);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});



router.post("/send-otp", async (req, res) => {
  const { field, value } = req.body;
  
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiryTime = Date.now() + 60 * 1000; // 1 minute

    const subject = "Your OTP for Verification";
    const text = `Your OTP is ${otp}`;
    const html = `<p>Your OTP is <strong>${otp}</strong></p>`;

    if (field === "email") {
      const emailSent = await sendEmail(value, subject, text, html);
      
      if (emailSent) {
        // Attempt to store OTP in a cookie
        res.cookie("otpData", { storedOtp:otp, expiryTime }, { 
          httpOnly: true,
          signed: true,
          maxAge: 60 * 1000, // 1 minute
          secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ message: "OTP sent successfully." });
      } else {
        res.status(500).json({ message: "Failed to send OTP. Please try again later." });
      }
    } else {
      res.status(400).json({ message: "Invalid field type." });
    }
  } catch (err) {
    console.error("Error in sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP. Please try again later." });
  }
});
router.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  
  const storedOtpData = req.signedCookies.otpData;

  if (!storedOtpData) {
    return res.status(400).json({ message: "OTP expired or not found." });
  }

  const { storedOtp, expiryTime } = storedOtpData;

  if (Date.now() > expiryTime) {
    res.clearCookie("otpData");
    return res.status(400).json({ message: "OTP expired." });
  }

  if (otp === storedOtp) {
    res.clearCookie("otpData");
    res.status(200).json({ message: "OTP verified successfully.", verified: true });
  } else {
    res.status(201).json({ message: "Invalid OTP." });
  }
});





module.exports = router;
