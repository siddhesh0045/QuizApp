import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import "./Auth.css"
const Signup = ({ toggleForm }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Read redirect param if coming from challenge link
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect"); // undefined if normal signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password); // backend signup
      setError("");

      if (redirectTo) {
        navigate(redirectTo); // go to challenge quiz
      } else {
        navigate("/"); // normal signup → go to quizzes/home
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      {error && <p className="error">{error +" Render server takes wake-up time please try once again or refresh page"}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
      {toggleForm && (
        <p>
          Already have an account?{" "}
          <button type="button" onClick={toggleForm} className="text-blue-500 underline">
            Login
          </button>
        </p>
      )}
    </div>
  );
};

Signup.propTypes = {
  toggleForm: PropTypes.func,
};

export default Signup;
