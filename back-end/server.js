const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../Images")));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const carRoutes = require("./routes/carRoutes");
app.use("/api/cars", carRoutes);

/* Serve frontend */
app.use(express.static(path.join(__dirname, "../front-end")));

/* Open index.html on homepage */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/index.html"));
});

const PORT = process.env.PORT || 4044;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});