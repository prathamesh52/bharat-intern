// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const app = express();
const PORT = 3000;

// Connect to MongoDB
const username = process.env.mongo_username;
const password = process.env.mongo_password;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.7ksrmra.mongodb.net/?retryWrites=true&w=majority`,{
  useNewUrlParser : true,
  useUnifiedTopology : true,
});


// Create Expense schema
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: Date,
});

const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
app.get('/', async (req, res) => {
  try {
    // Fetch expenses from MongoDB
    const expenses = await Expense.find();
    // Calculate total spending and today's spending
    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
    const todaySpending = expenses.filter(expense => isToday(expense.date)).reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
    res.render('index.ejs', { expenses, totalSpending, todaySpending });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add', async (req, res) => {
  // Create a new expense and save it to MongoDB
  const { description, amount, category, date } = req.body;
  const expense = new Expense({ description, amount, category, date });
  await expense.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  // Fetch expense by ID and render edit page
  const expense = await Expense.findById(req.params.id);
  res.render('edit.ejs', { expense });

});

app.post('/edit/:id', async (req, res) => {
  // Update expense in MongoDB
  const { description, amount, category, date } = req.body;
  await Expense.findByIdAndUpdate(req.params.id, { description, amount, category, date });
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  // Delete expense from MongoDB
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Helper function to check if a date is today
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
