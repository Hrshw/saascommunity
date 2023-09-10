const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Automatically loads environment variables from the .env file in the current directory

const { JWT_SECRET } = process.env;
console.log('Loaded environment variables:');
console.log(`JWT_SECRET: ${JWT_SECRET}`);

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  console.log('Token:', token);
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = authenticateJWT;
