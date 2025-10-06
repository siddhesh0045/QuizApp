import { useState } from "react";
import "./Login.css";
import PropTypes from "prop-types";
import api from "../../utils/api";

const Signup = ({ toggleForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ New

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Phone number must be exactly 10 digits and contain only numbers.");
      return;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      setError("First name must contain only letters with no spaces or special characters.");
      return;
    }

    try {
      setLoading(true); // ✅ Start loading
      const response = await api.post("/users/register", {
        name: name.toUpperCase(),
        email,
        password,
        phoneNumber,
      });

      setError("");
      alert("Signup successful!");
      setName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      toggleForm();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  return (
    <div className="login-container">
      <h1>Signup</h1>
      
      {loading && (
        <div className="loading-message">
           <div className="spinner"></div>
          <p>please wait a moment! 😊...</p>
        </div>
      )}

      {error && !loading && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}>
        <div className="form-group">
          <label><i className="fas fa-user"></i> First Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[A-Za-z]*$/.test(val)) {
                setName(val);
              }
            }}
            required
          />
        </div>
        <div className="form-group">
          <label><i className="fas fa-envelope"></i> Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label><i className="fas fa-lock"></i> Create Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>
        <div className="form-group">
          <label><i className="fas fa-phone"></i> Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,10}$/.test(val)) {
                setPhoneNumber(val);
              }
            }}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Signup
        </button>
      </form>

      <p>
        Back to login{" "}
        <button onClick={toggleForm} className="signup-link">
          Login
        </button>
      </p>
    </div>
  );
};

Signup.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default Signup;
