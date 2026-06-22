const { Clerk } = require('@clerk/clerk-sdk-node');

const clerkClient = new Clerk({
  apiKey: process.env.CLERK_SECRET_KEY,
});

module.exports = clerkClient; 