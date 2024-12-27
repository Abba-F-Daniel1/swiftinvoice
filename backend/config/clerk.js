const { Clerk } = require('@clerk/clerk-sdk-node');

const clerkClient = new Clerk({
  apiKey: process.env.VITE_CLERK_PUBLISHABLE_KEY, 
});

module.exports = clerkClient; 