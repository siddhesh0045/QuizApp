const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    challengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // friend may join later
    },
    link: {
      type: String,
      unique: true,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    expireTime: {
      type: Date,
      required: true,
    },
    challengerScore: { type: Number, default: 0 },
    challengerTime: { type: Number, default: 0 }, // in seconds
    friendScore: { type: Number, default: 0 },
    friendTime: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Challenge", challengeSchema);
