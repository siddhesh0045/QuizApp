import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import "./Auth.css"
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Read redirect param from URL
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // HttpOnly cookie set by server
      setError("");
      navigate(redirectTo); // redirect to challenge or default page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
  
    </div>
  );
};

Login.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default Login;
