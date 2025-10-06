import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./ChallengeQuizPage.css";

const ChallengeQuizPage = () => {
  const { link } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [locked, setLocked] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await api.get(`/challenge/${link}`);
        const challengeData = res.data.challenge;
        setChallenge(challengeData);
        checkTime(challengeData.startTime, challengeData.expireTime);
      } catch (err) {
        console.error(err);
        alert("Challenge not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [link, navigate]);

  const checkTime = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (now < startTime) {
      setLocked(true);
      const interval = setInterval(() => {
        const diff = startTime - new Date();
        if (diff <= 0) {
          clearInterval(interval);
          setLocked(false);
          setStartTimestamp(Date.now());
        } else {
          const hours = Math.floor(diff / 3600000);
          const mins = Math.floor((diff % 3600000) / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setCountdown(
            `Wait for  ${hours ? hours + "h " : ""}${mins}m ${secs}s to start quiz`
          );
        }
      }, 1000);
    } else if (now > endTime) {
      setLocked(true);
      setCountdown("Challenge Expired");
    } else {
      setLocked(false);
      setStartTimestamp(Date.now());
    }
  };

  if (loading) return <p className="loading-text">Loading challenge...</p>;
  if (!challenge) return <p className="loading-text">Challenge not found</p>;

  const quiz = challenge.quizId;

  if (locked) {
    return (
      <div className="locked-challenge flex flex-col items-center justify-center">
        <h2 className="locked-title">Challenge Locked</h2>
        <p className="locked-countdown">{countdown}</p>
        <p className="locked-time">
          Starts at: {new Date(challenge.startTime).toLocaleString()} <br />
          Ends at: {new Date(challenge.expireTime).toLocaleString()}
        </p>
      </div>
    );
  }

  const question = quiz.questions[currentQ];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentQ]: option });
  };

  const handleNext = async () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      let score = 0;
      let totalTime = Math.floor((Date.now() - startTimestamp) / 1000);

      quiz.questions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) score += q.points;
      });

      try {
        await api.post(`/challenge/${link}/submit`, { score, time: totalTime });
        navigate(`/quiz/challenge/${link}/result`);
      } catch (err) {
        console.error(err);
          const msg = err.response?.data?.message || "Failed to submit challenge result";
      alert(msg);
      }
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  return (
    <div className="challenge-quiz-page p-4 max-w-3xl mx-auto">
      <h2 className="quiz-title">{quiz.title}</h2>
      <p className="quiz-desc">{quiz.description}</p>
      <p className="quiz-time">
        Quiz Starts At: {new Date(challenge.startTime).toLocaleString()} <br />
        Quiz Ends At: {new Date(challenge.expireTime).toLocaleString()}
      </p>

      <div className="question mb-4">
        <p className="question-text">
          Q{currentQ + 1}: {question.questionText}
        </p>
        <div className="options flex flex-col gap-2 mt-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              className={`option-btn ${answers[currentQ] === opt ? "selected" : ""}`}
              onClick={() => handleOptionSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation flex gap-2 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="nav-btn prev-btn"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="nav-btn next-btn"
        >
          {currentQ === quiz.questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ChallengeQuizPage;
