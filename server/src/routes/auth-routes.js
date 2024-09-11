// routes/auth-router.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user-models'); // Adjust the path to your User model
const { verifyToken } = require('../middlewares/auth-middleware')

const router = express.Router();

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const userData = {
    firstname: req.user.firstname,
    photo: req.user.photo,
  };

  console.log(userData);
  console.log(token)
  res.redirect(`http://localhost:3000/?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
});


router.get('/user-details', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

