const mongoose = require('mongoose');

module.exports = async function connectDB(url) {
  await mongoose.connect(url);
};
