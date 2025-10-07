import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = () => {
    navigate("/");
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>

      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rank:</strong> {user.rank || "Not Implemented Yet"}</p>
        <p><strong>Points:</strong> {user.points || "Not Implemented Yet"}</p>
      </div>

      <div className="quiz-history">
        <h3>Quiz History</h3>
        {user.quizHistory && user.quizHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {user.quizHistory.map((quiz, index) => (
                <tr key={quiz.quizId._id || index}>
                  <td>{index + 1}</td>
                  <td>{quiz.quizId.title || "Unknown Quiz"}</td>
                  <td>{quiz.score}</td>
                  <td>{new Date(quiz.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Not Implemented Yet.</p>
        )}
      </div>

      <button onClick={handleSubmit} className=" continue-btn">
        Home
      </button>
    </div>
  );
};

export default Profile;
