


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB

const username = process.env.mongo_username;
const password = process.env.mongo_password;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.fks1lhd.mongodb.net/RegistrationFormDB`,{
  useNewUrlParser : true,
  useUnifiedTopology : true,
});

// Create a Mongoose schema and model (e.g., User)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists by username or email
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    // User already exists
    res.send('User already exists!');
  } else {
    // Save the new user to MongoDB
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.send('Registration successful!');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
