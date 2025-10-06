// import { useState } from "react";
// import "./Login.css";
// import PropTypes from "prop-types";
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../../context/AuthContext";
// import api from "../../utils/api"
// const Login = ({ toggleForm  }) => {
//   const { isAuthenticated,login,user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   // const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate(); 
//   const handleContinue = () => { navigate('/cab-rent'); };

//   const handleSubmit = async (e) => {
   
//     e.preventDefault();
    
//     try {
//          const response = await api.post("/users/login", 
//           { email, password },       
//         );
//       //console.log(response.data.user);
//       login(response.data.user);
//       setError("");
//       setEmail("");
//       setPassword("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "An error occurred. Please try again.");
//       setTimeout(() => {
//         setError("");
//     }, 2000);
//       setEmail("");
//       setPassword("");
//     }
//   };
  
//   if(isAuthenticated){
//     return (
//       <div className={`login-container  ${isAuthenticated ? "welcome" : ""}`}>
//          <h1>Welcome Back!</h1>
//         <p>
//         Welcome, {user.name}! We are thrilled to have you here. We offer a wide variety of cars, each with a dedicated driver to ensure your journey is smooth and enjoyable. Follow these simple steps to rent a car, and select a driver that suits your needs. We are here to make your trip unforgettable.
      
//         </p>
//        <button onClick={handleContinue}>Lets Begin!</button>
//       </div>
//     )
//   }

//   return (
//     <div className="login-container">
      
//       <h1>Login</h1>
//       {error ? <div className="error-message-error">{error}</div>:<div className="error-message-noError">Please Login to continue Booking!</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>
//             <i className="fas fa-envelope"> </i>   Email:
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>
//             <i className="fas fa-lock"></i> Password:
//           </label>
//           <div className= "password-container">
//           <input
//           //  type={showPassword ? "text" : "password"}
//           type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
          
//           >
            
//           </input>
//           {}
//            {/* <i
//         className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
//         onClick={() => setShowPassword(!showPassword)}
//       ></i> */}
//           </div>
         
        
//         </div>
//         <button type="submit" className="login-btn">
//           Login
//         </button>
//       </form>
//       <p>
//       Don&apos;t have an account? <button onClick={toggleForm} className="signup-link">Sign up</button>
//       </p>
//     </div>
//   );
// };
// Login.propTypes = { toggleForm: PropTypes.func.isRequired, // Validate that toggleForm is a required function
//  };
// export default Login;

import { useState } from "react";
import "./Login.css";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Login = ({ toggleForm }) => {
  const { isAuthenticated, login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- loading state
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/cab-rent');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader
    setError("");

    try {
      const response = await api.post("/users/login", { email, password });
      login(response.data.user);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setTimeout(() => {
        setError("");
      }, 2000);
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false); // stop loader
    }
  };

  if (isAuthenticated) {
    return (
      <div className={`login-container ${isAuthenticated ? "welcome" : ""}`}>
        <h1>Welcome Back!</h1>
        <p>
          Welcome, {user.name}! We are thrilled to have you here. We offer a wide variety of cars, each with a dedicated driver to ensure your journey is smooth and enjoyable. Follow these simple steps to rent a car, and select a driver that suits your needs. We are here to make your trip unforgettable.
        </p>
        <button onClick={handleContinue}>Let's Begin!</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error ? (
        <div className="error-message-error">{error}</div>
      ) : (
        <div className="error-message-noError">Please Login to continue Booking!</div>
      )}

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>please wait a moment! 😊...</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="fas fa-envelope"> </i> Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>
            <i className="fas fa-lock"></i> Password:
          </label>
          <div className="password-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don&apos;t have an account?{" "}
        <button onClick={toggleForm} className="signup-link" disabled={loading}>
          Sign up
        </button>
      </p>
    </div>
  );
};

Login.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default Login;
