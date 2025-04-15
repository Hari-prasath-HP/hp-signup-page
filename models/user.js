// models/user.js
const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true},
  email: { type: String, required: true},
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
});

// Create the User model from the schema
const User = mongoose.model('Users', userSchema);

module.exports = User;
