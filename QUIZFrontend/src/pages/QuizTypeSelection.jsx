import { useNavigate } from "react-router-dom";
import "./QuizTypeSelection.css"; 
import soloQ from "../assets/images/soloQ.png"
import challengeQ from "../assets/images/challengeQ.png"
const QuizTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="quiz-type-container">
      <h2>Select Your Quiz Mode</h2>
      <div className="quiz-type-cards">
        <div className="quiz-card self-quiz">
          <img src={soloQ} alt="Self Quiz" />
          <h3>Self Quiz</h3>
          <p>Play solo and test your skills at your own pace.</p>
          <button onClick={() => navigate("/selfQuizEntry")}>Start Self Quiz</button>
        </div>

        <div className="quiz-card challenge-quiz">
          <img src={challengeQ} alt="Challenge Friend" />
          <h3>Challenge Friend</h3>
          <p>Invite a friend and compete head-to-head for the top score.</p>
          {/* <button onClick={() => navigate("/quiz/challenge")}>Start Challenge Quiz</button> */}
          <button onClick={() => navigate("/quiz/challenge/create")}>Start Challenge Quiz</button>

        </div>
      </div>
    </div>
  );
};

export default QuizTypeSelection;