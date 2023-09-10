const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from the .env file in the current directory
const { JWT_SECRET } = process.env;
console.log('Loaded environment variables:');
console.log(`JWT_SECRET: ${JWT_SECRET}`);

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Validate the password field
    if (!password || typeof password !== 'string' || password.length < 8) {
      console.error('Invalid password:', password);
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Set the authToken cookie
    res.cookie('authToken', token, { httpOnly: true });

    // Redirect the user to the communities page with the token as a query parameter
    res.redirect(`/communities?token=${token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


