const express = require("express");
const router = express.Router();
const { 
  createChallenge,
  getChallengeByLink,
  submitChallengeResult,
  getChallengeResult 
} = require("../controllers/challengeController");
const authMiddleware = require("../middleware/authMiddleware.js");

// create challenge
router.post("/create", authMiddleware, createChallenge);

// get challenge by link
router.get("/:link", authMiddleware, getChallengeByLink);

// submit result
router.post("/:link/submit", authMiddleware, submitChallengeResult);

// get challenge result
router.get("/:link/result", authMiddleware, getChallengeResult);

module.exports = router;
