import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./ChallengeCreatePage.css"; 

const ChallengeCreatePage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [startTime, setStartTime] = useState("");
  const [expireTime, setExpireTime] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quiz");
        setQuizzes(res.data.quizzes || res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  const handleCreateChallenge = async () => {
    if (!selectedQuiz || !startTime || !expireTime) return alert("All fields required");

    const start = new Date(startTime);
    const expire = new Date(expireTime);

    if (expire <= start) return alert("Expire time must be after start time!");

    const diffHours = (expire - start) / (1000 * 60 * 60);
    if (diffHours > 1) return alert("Quiz duration cannot exceed 1 hour!");

    try {
      const res = await api.post("/challenge/create", {
        quizId: selectedQuiz,
        startTime: start,
        expireTime: expire,
      });
      setLink(`${window.location.origin}/quiz/challenge/${res.data.challenge.link}`);
      alert("challenge created!!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create challenge");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const startQuiz = () => {
    if (!link) return;
    window.open(link, "_blank");
  };

  return (
      <div className="challenge-container">
    <div className="challenge-page">
      <h2 className="title">Challenge a Friend</h2>

      <div className="form-group">
        <label>Select Quiz:</label>
        <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
          <option value="">--Select--</option>
          {quizzes.map((q) => (
            <option key={q._id} value={q._id}>
              {q.title} ({q.difficulty})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Start Time:</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Expire Time:</label>
        <input type="datetime-local" value={expireTime} onChange={(e) => setExpireTime(e.target.value)} />
      </div>

      <button onClick={handleCreateChallenge} className="btn-create">
        Create Challenge
      </button>

      {link && (
        <div className="challenge-link-box">
          <p>
            Share this link with your friend: The quiz will open at the selected start time. Click the Start Quiz button below to attempt the quiz.
          </p>
          <div className="link-row">
            <a href={link} target="_blank" rel="noreferrer" className="challenge-link">
              {link}
            </a>
            <button onClick={copyLink} className="btn-copy">
              Copy Link
            </button>
          </div>
          <button onClick={startQuiz} className="btn-start">
            Start Quiz
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default ChallengeCreatePage;
