const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  
} = require("../controllers/quizController");

const authenticate = require("../../../api/v1/middleware/authMiddleware");
const authenticateAdmin = require("../../../api/v1/middleware/varifyAdminMiddleware");

const router = express.Router();

//  Public
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);

//  Admin only
router.post("/", authenticate, authenticateAdmin, createQuiz);
router.put("/:id", authenticate, authenticateAdmin, updateQuiz);
router.delete("/:id", authenticate, authenticateAdmin, deleteQuiz);

module.exports = router;
