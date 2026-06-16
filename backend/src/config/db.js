const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careerforge";

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Connection Host: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed:`, error.message);
    console.error(`🔗 URI: ${uri.replace(/:[^@]*@/, ":***@")}`);
    throw error;
  }
}

module.exports = connectDB;
