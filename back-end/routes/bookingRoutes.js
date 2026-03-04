const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// create booking
router.post("/", async (req, res) => {

  try {

    const booking = new Booking(req.body);
    const savedBooking = await booking.save();

    res.json(savedBooking);

  } catch (error) {

    res.status(500).json(error);

  }

});

// get bookings of a user
router.get("/user/:id", async (req, res) => {

  const bookings = await Booking
  .find({ userId: req.params.id })
  .populate("carId");

  res.json(bookings);

});
// returning the car
router.put("/return/:id", async (req, res) => {

try {

const booking = await Booking.findByIdAndUpdate(
req.params.id,
{ status: "completed" },
{ new: true }
);

res.json(booking);

} catch (err) {

res.status(500).json({ message: "Error returning car" });

}

});

module.exports = router;