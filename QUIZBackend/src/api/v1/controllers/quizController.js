const Quiz = require("../../../../models/Quiz");
const User = require("../../../../models/User");

//  Create a new quiz (Admin only)
const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions are required." });
    }

    
    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      questions,
      createdBy: req.user.id, // will come from auth middleware (admin)
    });

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get all quizzes
const getAllQuizzes = async (req, res) => {
  // try {
  //   const quizzes = await Quiz.find().populate("createdBy", "name email");
  //   res.status(200).json({ success: true, count: quizzes.length, quizzes });
  // } catch (error) {
  //   res.status(500).json({ message: "Error fetching quizzes" });
  // }
   try {
    const { category, difficulty } = req.query;

    // Build dynamic filter object
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (difficulty && difficulty !== "All") filter.difficulty = difficulty;

    // Fetch quizzes (filtered or all)
    const quizzes = await Quiz.find(filter).select(
      "title description difficulty category createdAt"
    );

    return res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

//  Get a single quiz by ID
const getQuizById = async (req, res) => {
try {
    const quiz = await Quiz.findById(req.params.id).select(
      "title description questions"
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Update quiz (Admin only)
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this quiz" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Quiz updated", updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz" });
  }
};

//  Delete quiz (Admin only)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this quiz" });
    }

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz" });
  }
};













module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,

};
