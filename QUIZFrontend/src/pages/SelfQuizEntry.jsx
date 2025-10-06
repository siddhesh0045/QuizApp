import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; 
import "./SelfQuizEntry.css";
const categories = ["All", "General", "Science", "Math", "History", "Sports", "Tech"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

const SelfQuizEntry = () => {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


const fetchQuizzes = async (filters = {}) => {
  setLoading(true);
  try {
    const res = await api.get("/quiz/", { params: filters });
    console.log(res.data);
    setQuizzes(Array.isArray(res.data.quizzes) ? res.data.quizzes : []);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    setQuizzes([]); // clear list on error
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => {
    fetchQuizzes(); // no filters = fetch all
  }, []);


  const handleFilter = () => {
    const filters = {};
    if (category && category !== "All") filters.category = category;
    if (difficulty && difficulty !== "All") filters.difficulty = difficulty;
    fetchQuizzes(filters);
  };

  return (
    <div className="self-quiz-entry">
      <h2 className="text-xl font-bold mb-4">Select Your Quiz</h2>

      {/* Filters */}
      <div className="filters flex gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded"
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>

        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>

      {/* Loader */}
      {loading && <p>Loading quizzes...</p>}

      {/* Quiz List */}
      <div className="quiz-list grid gap-4">
        {!loading && quizzes.length === 0 && (
          <p>No quizzes found for selected filters.</p>
        )}

        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="quiz-card border p-4 rounded shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p className="text-gray-700 mb-1">{quiz.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {quiz.category} |{" "}
              <strong>Difficulty:</strong> {quiz.difficulty}
            </p>
            <button
              onClick={() => navigate(`/quiz/self/${quiz._id}`)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfQuizEntry;
