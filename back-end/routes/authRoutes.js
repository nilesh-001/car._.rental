const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const transporter = require("../utils/mailer");

const SECRET = "velocita_secret";
const otpStore = {};


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

// TEST EMAIL
router.get("/test-email", async (req, res) => {

  try {

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "290905nilesh@gmail.com",
      subject: "Velocita Email Test",
      text: "If you received this email, Nodemailer is working correctly!"
    });

    console.log("Email info:", info);

    res.send("Email sent successfully");

  } catch (error) {

    console.error(error);
    res.status(500).send("Email failed");

  }

});

// SEND OTP
router.post("/send-otp", async (req, res) => {

  const { email } = req.body;

  try {

    // CHECK IF USER EXISTS
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No account found with this email. Please sign up."
      });
    }

    // PREVENT OTP SPAM (30 sec cooldown)
    const existing = otpStore[email];

    if (existing && Date.now() - existing.lastSent < 30000) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      lastSent: Date.now()
    };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Velocita Password Reset OTP",
      text: `Your OTP for resetting your Velocita password is: ${otp}`
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {

  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "OTP not requested" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ verified: true });

});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {

  const { email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email: email },
      { password: hashedPassword }
    );

    delete otpStore[email];

    res.json({ message: "Password reset successful" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;