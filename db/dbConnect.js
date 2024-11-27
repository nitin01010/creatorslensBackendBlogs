const mongoose = require("mongoose");
const MONGOURI = process.env.MONGOURI

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.log(error);
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = dbConnect;
