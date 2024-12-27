require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const authenticateToken = require('./middleware/auth');
const { requireAuth } = require('@clerk/express');

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Use routes
app.use('/', routes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message,
    details: err.details || 'No additional details'
  });
});

// Middleware
app.use(authenticateToken); // Use the authentication middleware

// Middleware to authenticate requests
app.use(requireAuth());

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});