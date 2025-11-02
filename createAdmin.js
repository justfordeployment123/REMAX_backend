// please delete it after testing

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

const adminData = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'admin123!',
  role: 'admin',
  isVerified: true,
};

async function createAdmin() {
  try {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI is missing in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const existingUser = await User.findOne({ email: adminData.email });
    if (existingUser) {
      console.error('User with this email already exists:', adminData.email);
      process.exit(1);
    }

    const newAdmin = new User(adminData);
    await newAdmin.save();

    console.log(`Admin user created successfully: ${adminData.email}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();
