const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   STATIC FILES
========================= */

// Serve car images
app.use("/images", express.static(path.join(__dirname, "../Images")));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../front-end")));

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

/* =========================
   ROUTES
========================= */

// Cars API
const carRoutes = require("./routes/carRoutes");
app.use("/api/cars", carRoutes);

// Auth API (signup, login, forgot password)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

/* =========================
   FRONTEND ROUTE
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/index.html"));
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 4044;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});