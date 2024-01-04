// database/db.js

const mongoose = require('mongoose');

// Create a Mongoose schema and model (e.g., User)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Ensure usernames are unique
    required: true,
  },
  email: {
    type: String,
    unique: true, // Ensure emails are unique
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
