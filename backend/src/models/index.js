const mongoose = require('mongoose');

// Import models
const User = require('./User');
const Member = require('./Member');
const Donation = require('./Donation');
const Event = require('./Event');
const BlogPost = require('./BlogPost');
const Sermon = require('./Sermon');
const Notification = require('./Notification');
const Service = require('./Service');

// Register models with Mongoose if not already registered
// This ensures the schemas are compiled

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.log(`❌ MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Export everything
module.exports = {
  connectDB,
  User,
  Member,
  Donation,
  Event,
  BlogPost,
   Service,
  Sermon,
  Notification,
};