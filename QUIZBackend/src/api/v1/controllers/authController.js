/**
 * *******************************************************************************
 * @description Authentication Controller (Users + Admins)
 * Handles register, login, logout, profile update, password reset, etc.
 * Includes JWT handling with secure cookies and middleware compatibility.
 * *******************************************************************************
 */

const User = require('../../../../models/User.js');
const Quiz = require('../../../../models/Quiz.js');
const Feedback = require('../../../../models/Feedback.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Detect production environment
const isProd = process.env.NODE_ENV === "production";

// Helpers
const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// ------------------ User Registration ------------------
const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, isAdmin } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password, isAdmin: isAdmin || false });

    const accessToken = generateAccessToken({ id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin });
    const refreshToken = generateRefreshToken({ id: newUser._id });

    // Set cookies (cross-site safe)
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours

    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ User Login ------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password." });

    const accessToken = generateAccessToken({ id: user._id, email: user.email, isAdmin: user.isAdmin });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
     maxAge: 3 * 60 * 60 * 1000, // 3 hours

    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name, phoneNumber: user.phoneNumber },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// ------------------ Admin Login ------------------
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email });
    if (!admin || !admin.isAdmin) return res.status(403).json({ message: "Access forbidden: Admins only" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password." });

    const accessToken = jwt.sign({ id: admin._id, email: admin.email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("tokenAdmin", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Admin Login Success with token", token: accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// ------------------ Logout ------------------
const logoutUser = (req, res) => {
  // Clear access token
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  // Clear refresh token
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  return res.status(200).json({ message: "User logged out successfully" });
};

// Admin logout
const adminLogout = (req, res) => {
  res.clearCookie("tokenAdmin", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  return res.status(200).json({ message: "Admin logged out successfully" });
};


// ------------------ Get Me ------------------
const getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email isAdmin");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------ Refresh Token ------------------
const refreshTask = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Access token refreshed successfully" });
  } catch (err) {
    console.error("Refresh error:", err.message);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// ------------------ Other routes (placeholders) ------------------
const updateUser = async () => {};
const getUserById = async () => {};
const forgotPassword = async () => {};
const resetPassword = async () => {};
const updateQuizResult = async () => {};


// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;

    if (!name || !email || !rating || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = await Feedback.create({
      name,
      email,
      rating,
      feedback,
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback: newFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
};



module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  logoutUser,
  adminLogout,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  getMe,
  refreshTask,
  updateQuizResult,
  submitFeedback
};
