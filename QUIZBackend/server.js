const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const authRoute = require("./src/api/v1/routes/authRoute.js");
const quizRoutes = require("./src/api/v1/routes/quizRoutes");
const challengeRoute = require("./src/api/v1/routes/challengeRoute");
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);


// Routes
app.use("/api/auth", authRoute);
app.use("/api/quiz", quizRoutes);
app.use("/api/challenge", challengeRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
