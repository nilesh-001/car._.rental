const express = require("express");
const router = express.Router();
const Car = require("../models/car");

// GET all cars
router.get("/", async (req, res) => {

  const cars = await Car.find();
  res.json(cars);

});

module.exports = router;