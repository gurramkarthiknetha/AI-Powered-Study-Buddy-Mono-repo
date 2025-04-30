import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, connectOptions);
    console.log("Connected to MongoDB using Mongoose");
    
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectToDB, 5000);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export { connectToDB, mongoose };
