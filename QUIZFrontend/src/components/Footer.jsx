// src/components/Footer.jsx
import { useState } from "react";
import "./Footer.css";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please Login to submit feedback!");
      return;
    }

    const name = user.name;
    const email = user.email;

    try {
      const response = await api.post("/auth/submitFeedback", {
        name,
        email,
        rating,
        feedback,
      });

      //console.log("Feedback submitted:", { name, email, rating, feedback });
      alert("Thank you for your feedback!");

      // Reset fields
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Try again later.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Left Side: About / Contact / Social */}
        <div className="footer-left">
          <div className="footer-section about">
            <h3>About</h3>
             <p>
    Our quiz app empowers learners to challenge themselves, compete with friends, and grow through engaging, interactive quizzes. Whether you are brushing up on skills or battling for the top score, we make learning fun, fast, and rewarding.
  </p>

          </div>
          <div className="footer-section contact">
            <h3>Contact</h3>
            <p>Email: siddheshwarg4u@gmail.com</p>
            <p>Phone: +91 9730534308</p>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <a href="https://www.linkedin.com/in/siddheshwar-ghuge-34835a207/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>

        {/* Right Side: Feedback Form */}
        <div className="footer-right">
          <div className="footer-section feedback">
            <h3>Feedback</h3>
            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="rating">
                <p>Rate Us:</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? "selected" : ""}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Your Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} QuizApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
