
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "./QuizResultPage.css"; 

const QuizResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    score = 0,
    totalScore = 0,
    quizTitle = "",
    answers = {},
    questions = [],
  } = location.state || {};

  useEffect(() => {
    const saveResult = async () => {
      try {
        await api.post("/auth/updateResult", { quizId: id, score });
      //  console.log(" Quiz result saved successfully");
      } catch (err) {
        console.error(" Error saving quiz result:", err);
      }
    };
    if (score && id) saveResult();
  }, [id, score]);

  return (
    <div className="quiz-result-page">
      {/* Confetti for perfect score */}
      {score === totalScore && totalScore > 0 && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} className="confetti"></span>
          ))}
        </div>
      )}

      <h2 className={`quiz-title ${score === totalScore ? "glow" : ""}`}>
        {quizTitle} - Summary 
      </h2>

      <h1 className="score-text">
        Your Score: <strong>{score}</strong> / {totalScore}
      </h1>

      <div className="questions-list">
        {questions.map((q, idx) => {
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <div
              key={idx}
              className={`question-card ${isCorrect ? "correct" : "wrong"}`}
            >
              <p className="question-text">
                Q{idx + 1}: {q.questionText}
              </p>
              <p>
                Your Answer: <span className="answer">{userAnswer || "Not answered"}</span>
              </p>
              <p>
                Correct Answer: <span className="correct-answer">{q.correctAnswer}</span>
              </p>
              <p className="points">Points: {q.points}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/quizTypeSelection")}
        className={`back-btn ${score === totalScore ? "full-score-btn" : ""}`}
      >
        Back to Quizzes
      </button>
    </div>
  );
};

export default QuizResultPage;
