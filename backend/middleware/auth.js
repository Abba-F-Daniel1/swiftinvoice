const { requireAuth } = require('@clerk/express');

// Middleware to authenticate requests
const authenticateToken = requireAuth();

module.exports = authenticateToken; // Ensure you are exporting the middleware function 