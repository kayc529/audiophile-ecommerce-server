import mongoose from 'mongoose';

async function connectDB(url: string) {
  await mongoose.connect(url);
}

export default connectDB;
