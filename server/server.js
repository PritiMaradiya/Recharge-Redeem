require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/walletDB';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const walletRoutes = require('./Routes/walletRoutes');
const login = require('./Routes/login')
app.use('/api/wallet', walletRoutes);
app.use('/api/auth', login);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});
  // Start Server on HTTP
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
