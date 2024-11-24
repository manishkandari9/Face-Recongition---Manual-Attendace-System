const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // No need to use deprecated options like useNewUrlParser and useUnifiedTopology
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
