const dotenv = require('dotenv');
dotenv.config(); // Must be FIRST before any other imports that use env vars

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware - CORS must explicitly allow Authorization header
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://cameracart.vercel.app',
  'https://cameracart-lvjhzb58r-hariprasaths-projects-fa26b109.vercel.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Normalize: remove trailing slash and convert to lowercase
    const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
    
    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, '').toLowerCase() === normalizedOrigin);
    const isVercel = normalizedOrigin.endsWith('.vercel.app');

    if (isAllowed || isVercel) {
      callback(null, true);
    } else {
      console.log('CORS Blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

