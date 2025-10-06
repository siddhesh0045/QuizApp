const User = require('../../../../models/User.js');
const Quiz = require('../../../../models/Quiz.js');
const Challenge = require('../../../../models/Challenge.js');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const ChallengeParticipant = require("../../../../models/ChallengeParticipant.js");


const submitChallengeResult = async (req, res) => {
  try {
    const { link } = req.params;
    const { score, time } = req.body;

    const challenge = await Challenge.findOne({ link });
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const userId = req.user.id;

    // If user is not challenger or friend and friendId already exists
    if (
      challenge.challengerId.toString() !== userId &&
      challenge.friendId &&
      challenge.friendId.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Sorry, this challenge is already full. You cannot join." });
    }

    // Original 2-user logic
    if (challenge.challengerId.toString() === userId) {
      challenge.challengerScore = score;
      challenge.challengerTime = time;
    } else {
      challenge.friendId = userId;
      challenge.friendScore = score;
      challenge.friendTime = time;
    }

    if (challenge.challengerScore && challenge.friendScore) challenge.status = "completed";

    await challenge.save();
    res.status(200).json({ success: true, challenge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error submitting challenge result" });
  }
};

const createChallenge = async (req, res) => {
  try {
    const { quizId, startTime, expireTime } = req.body;
    if (!quizId || !startTime || !expireTime)
      return res.status(400).json({ message: "All fields required" });

    const start = new Date(startTime);
    const expire = new Date(expireTime);

    // Validate start < expire
    if (expire <= start) {
      return res.status(400).json({ message: "Expire time must be after start time" });
    }

    // Max duration check 1 hour
    const diffHours = (expire - start) / (1000 * 60 * 60);
    if (diffHours > 1) {
      return res.status(400).json({ message: "Quiz duration cannot exceed 1 hour" });
    }

    const link = uuidv4(); // unique challenge link

    const challenge = await Challenge.create({
      quizId,
      challengerId: req.user.id,
      startTime: start,
      expireTime: expire,
      link,
    });

    res.status(201).json({ success: true, challenge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating challenge" });
  }
};




// Get challenge by link
const getChallengeByLink = async (req, res) => {
  try {
    const { link } = req.params;
    const challenge = await Challenge.findOne({ link })
      .populate("quizId")
      .populate("challengerId", "name email");

    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    res.status(200).json({ challenge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching challenge" });
  }
};


// Get challenge result
const getChallengeResult = async (req, res) => {
  try {
    const { link } = req.params;
    const challenge = await Challenge.findOne({ link })
      .populate("quizId")
      .populate("challengerId", "name")
      .populate("friendId", "name");

    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    res.status(200).json({ challenge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching challenge result" });
  }
};

module.exports = {
  createChallenge,
  getChallengeByLink,
  submitChallengeResult,
  getChallengeResult,
};
