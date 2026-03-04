const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const SECRET = "velocita_secret";


// SIGNUP
router.post("/signup", async (req, res) => {

  try {

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();

    res.json({ message: "User created successfully" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;