/**
 * Auth Routes for Quiz App
 */

const express = require("express");
const {
 

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
} = require("../controllers/authController");

 const authMiddleware = require("../middleware/authMiddleware.js");



const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// router.get("/user/:id", authMiddleware, getUserById); // not needed now
router.get("/me", authMiddleware, getMe); // used by frontend to verify session
router.post("/refresh",refreshTask);
router.post("/updateResult",authMiddleware,updateQuizResult);
router.post("/submitFeedback", submitFeedback);


module.exports = router;
