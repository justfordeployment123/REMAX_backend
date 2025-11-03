const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/remax';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // In production, you might want to retry or use a different strategy
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Production MongoDB connection failed. Please check:');
      console.error('1. MongoDB Atlas connection string is correct');
      console.error('2. IP whitelist includes your VPS IP');
      console.error('3. Database user has proper permissions');
      console.error('4. Network connectivity to MongoDB cluster');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;