import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const LoginPage = () => {
  const [showSignup, setShowSignup] = useState(false);

  const toggleForm = () => setShowSignup((prev) => !prev);

  return (
    <div className="auth-page">
      {showSignup ? (
        <Signup toggleForm={toggleForm} />
      ) : (
        <Login toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default LoginPage;
