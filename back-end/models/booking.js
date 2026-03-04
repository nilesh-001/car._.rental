const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car"
  },
  pickupDate: Date,
  returnDate: Date,
  totalPrice: Number,
  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
