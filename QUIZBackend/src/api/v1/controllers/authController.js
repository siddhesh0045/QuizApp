/**
 * *******************************************************************************
 * @description Authentication Controller (Users + Admins)
 * *******************************************************************************
 * Handles register, login, logout, profile update, password reset, etc.
 * Includes JWT handling with secure cookies and middleware compatibility.
 * @author siddheshwar ghuge
 * @date 2-10-25
 * *******************************************************************************
 */

const User = require('../../../../models/User.js');
const Quiz = require('../../../../models/Quiz.js');
const Feedback = require('../../../../models/Feedback.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


// Helper: Generate Access Token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }); // short-lived
};

// Helper: Generate Refresh Token (optional, 7 days)
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};


const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, isAdmin } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    // Auto-login after register: generate token
    const accessToken = generateAccessToken({ id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin });
    const refreshToken = generateRefreshToken({ id: newUser._id });

    res.cookie("token", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
       secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password." });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email, isAdmin: user.isAdmin });
    const refreshToken = generateRefreshToken({ id: user._id });

    // res.cookie("token", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 15 * 60 * 1000, // 15 min
    // });
res.cookie("token", accessToken, {
  httpOnly: true,
  secure: false, // keep false for localhost
  sameSite: "lax", // use lax, not strict (strict blocks cookies on some navigations)
  maxAge: 15 * 60 * 1000,
});

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
       secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name, phoneNumber: user.phoneNumber },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

/**
 * *******************************************************************************
 * @description loginAdmin
 * *******************************************************************************
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log("This route is used");
  try {
    const admin = await User.findOne({ email });
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Access forbidden: Admins only" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password." });
    }

    const accessToken = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.cookie("tokenAdmin", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
       secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

// Also return token in response body
    res.status(200).json({
      message: "Admin Login Success with token",
      token: accessToken
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};



const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "User logged out successfully" });
};

const adminLogout = (req, res) => {
  res.clearCookie("tokenAdmin");
  res.status(200).json({ message: "Admin logged out successfully" });
};

const getMe = async (req, res) => {
const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded msg: ",decoded );
     const user = await User.findById(decoded.id).select("name email isAdmin");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user});
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * *******************************************************************************
 * @description getUserById (Protected)
 * *******************************************************************************
 */
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id; // either param or token user
    const user = await User.findById(userId).select("name email phoneNumber");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * *******************************************************************************
 * @description updateUser (Protected)
 * *******************************************************************************
 */
const updateUser = async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;
    const userId = req.user.id; // comes from token

    if (!name && !phoneNumber && !password) {
      return res.status(400).json({ message: "Please provide fields to update." });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ message: "User not found." });

    res.status(200).json({
      message: "User updated successfully",
      user: { name: updatedUser.name, phoneNumber: updatedUser.phoneNumber },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

/**
 * *******************************************************************************
 * @description forgotPassword + resetPassword
 * *******************************************************************************
 * 
 */
const forgotPassword = async (req, res) => {

};
const resetPassword = async (req, res) => {
 
};


const refreshTask = async (req, res) => {
  try {
    // in refreshTask
console.log("refreshToken cookie:", req.cookies.refreshToken);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    //  Verify using JWT_REFRESH_SECRET (make sure it's correct in .env)
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    //  Always double-check this part — some tokens have `decoded.id` or `_id`
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    //  Generate a new access token (keep payload consistent)
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );


    //  Send new cookies
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: false, // keep false for localhost
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });



    return res.json({ message: "Access token refreshed successfully" });
  } catch (err) {
    console.error(" Refresh error:", err.message);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

const updateQuizResult = async (req, res) => {
  console.log("Route called");
  try {
    const userId = req.user.id; // from auth middleware
    const { quizId, score } = req.body;

    if (!quizId || score == null) {
      return res.status(400).json({ message: "Quiz ID and score are required" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add quiz to history
    user.quizHistory.push({
      quizId,
      score,
      date: new Date(),
    });

    // Update total points
    user.points += score;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Quiz result updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating quiz result:", error);
    res.status(500).json({ message: "Server error updating quiz result" });
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

