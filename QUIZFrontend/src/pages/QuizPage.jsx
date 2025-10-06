
// export default QuizPage;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./QuizPage.css";
const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${id}`);
        setQuiz(res.data.quiz);
     //   console.log("this is the quiz",res.data.quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        alert("Failed to fetch quiz");
        navigate("/selfQuizEntry");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found</p>;

  const question = quiz.questions[currentQ];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentQ]: option });
  };

  const handleNext = () => {
  if (currentQ < quiz.questions.length - 1) {
    setCurrentQ(currentQ + 1);
  } else {
    let s = 0;
    let totalScore = 0;

    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) s += q.points;
      totalScore += q.points;
    });

    // Navigate to result page with full data
    navigate(`/quiz/result/${quiz._id}`, {
      state: {
        score: s,
        totalScore,
        quizTitle: quiz.title,
        answers,
        questions: quiz.questions,
      },
    });
  }
};


  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  return (
    <div className="quiz-page p-4">
      <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
      <p className="mb-4">{quiz.description}</p>

      <div className="question mb-4">
        <p>
          Q{currentQ + 1}: {question.questionText}
        </p>
        <div className="options flex flex-col gap-2 mt-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              className={`p-2 border rounded ${
                answers[currentQ] === opt ? "bg-selected" : ""
              }`}
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
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {currentQ === quiz.questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
