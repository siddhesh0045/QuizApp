import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/quizTypeSelection"); 
  };

  return (
    <div className="home-container">
      <h1>Welcome to Quiz App!</h1>
      {isAuthenticated ? (
        <>
          <p>Get ready, {user?.name}! Start your quiz journey </p>
          <button onClick={handleContinue} className="nav-btn continue-btn">
            Click to Continue
          </button>
        </>
      ) : (
        <p>Please login or signup to start playing quizzes.</p>
      )}
    </div>
  );
};

export default HomePage;