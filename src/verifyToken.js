const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

// Replace 'YOUR_PROVIDED_TOKEN' with the actual token you want to verify
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZkYjhiMzc4MTc0NzQyMmJjMDNhZmQiLCJpYXQiOjE2OTQzNTAzMzd9.DCV7BT_q3b_MyIBFTVB6bv7IxqnYHFVHdSkZgN3WVxw';

// Replace 'YOUR_JWT_SECRET' with your JWT secret (the same secret used to sign the token)
const JWT_ECRET = process.env.JWT_SECRET;

// Verify and decode the token
try {
  const decodedToken = jwt.verify(token, JWT_ECRET);
  console.log('Token verification successful:');
  console.log(decodedToken);
} catch (error) {
  console.error('Token verification failed:', error.message);
}

