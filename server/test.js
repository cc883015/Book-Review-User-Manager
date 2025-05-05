require('dotenv').config();
const jwt = require('jsonwebtoken');

// Create a test token
const payload = {
  user_id: '123456789',
  is_admin: true
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Token:', token);

// Verify the token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded:', decoded);
} catch (err) {
  console.error('Verification failed:', err);
}
