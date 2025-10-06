import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./ChallengeResultPage.css";

const ChallengeResultPage = () => {
  const { link } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/challenge/${link}/result`);
        setChallenge(res.data.challenge);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch challenge result");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
    const interval = setInterval(fetchResult, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, [link, navigate]);

  if (loading) return <p>Loading results...</p>;
  if (!challenge) return <p>Challenge not found</p>;

  const { quizId: quiz, challengerId, friendId, challengerScore, challengerTime, friendScore, friendTime, expireTime } = challenge;

  const getWinner = () => {
    const now = new Date();
    const quizEnd = new Date(expireTime);

    const challengerDone = challengerScore > 0 || challengerTime > 0;
    const friendDone = friendId ? friendScore > 0 || friendTime > 0 : true;

    if (!challengerDone || !friendDone) {
      if (now < quizEnd) return "Waiting for both players to finish...";
    }

  if (now < quizEnd) return "Lets Wait for the Quiz Timer to End...";

    if (challengerScore > friendScore) return challengerId.name + " wins!";
    if (friendScore > challengerScore) return friendId.name + " wins!";
    if (challengerTime < friendTime) return challengerId.name + " wins by time!";
    if (friendTime < challengerTime) return friendId.name + " wins by time!";
    return "It's a tie!";
  };

  return (
     <div className="challenge-result-wrapper">
    <div className="challenge-result-page">
      <h2 className="title">{quiz.title} - Challenge Result</h2>
       <h3 className="winner">{getWinner()}</h3>
      <div className="players">
        <div className="player-card">
          <p className="player-name">Player name: {challengerId.name}</p>
          <p className="player-score">Points Earned: {challengerScore} pts</p>
          <p className="player-time">Time Taken: {challengerTime}s</p>
        </div>
        {friendId && (
          <div className="player-card">
            <p className="player-name">Player name: {friendId.name}</p>
            <p className="player-score">Points Earned: {friendScore} pts</p>
            <p className="player-time">Time Taken: {friendTime}s</p>
          </div>
        )}
      </div>

     

      <button
        onClick={() => navigate("/quizTypeSelection")}
        className="btn-back"
      >
        Back to Quizzes
      </button>
    </div>
    </div>
  );
};

export default ChallengeResultPage;
