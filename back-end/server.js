const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*"
}));

// body parser
app.use(express.json());

// static images
app.use("/images", express.static(path.join(__dirname, "../Images")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// routes
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

// server start
const PORT = process.env.PORT || 4044;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});