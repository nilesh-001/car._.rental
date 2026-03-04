const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: String,
  category: String,
  type: String,
  price: Number,
  seats: Number,
  transmission: String,
  fuel: String,
  image: String,
  rating: Number
});

module.exports = mongoose.model("Car", carSchema);