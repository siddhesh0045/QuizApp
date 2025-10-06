// models/Quiz.js

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 1, // points per question
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["General", "Science", "Math", "History", "Sports", "Tech"],
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    questions: [questionSchema], // embed multiple questions
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to admin
      required: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt, updatedAt
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
