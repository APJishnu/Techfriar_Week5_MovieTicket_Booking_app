const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String }, // Optional field to store profile picture URL
});

const User = mongoose.model('User', userSchema);
module.exports = User;
