const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('hbs');
const path = require('path')
const authenticateJWT = require('./src/middleware/authMiddleware');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

// Set up Handlebars as the template engine
app.set('view engine', 'hbs');

// Define the views directory
app.set('views', path.join(__dirname, 'src/views'));


// Route to render the login page
app.get('/', (req, res) => {
  res.render('login');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
// Route to render the communities page
app.get('/communities', authenticateJWT, (req, res) => {
  res.render('communities');
});

// Route to render the create community page
app.get('/create-community', authenticateJWT, (req, res) => {
  res.render('create-community');
});

// Route to render the community members page
app.get('/community-members', authenticateJWT, (req, res) => {
  res.render('community-members');
});

// Route to render the remove member page
app.get('/remove-member', authenticateJWT, (req, res) => {
  res.render('remove-member');
});
app.get('/addmember', authenticateJWT,(req, res) => {
  res.render('addmember');
})
// Define routes
app.use('/auth', require('./src/routes/auth'));
app.use('/community', require('./src/routes/community'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
