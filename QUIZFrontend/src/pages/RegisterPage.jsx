import { useNavigate } from "react-router-dom";
import Signup from "../components/Signup";

const RegisterPage = () => {
  const navigate = useNavigate();
  const toggleForm = () => navigate("/login");

  return (
    <div className="auth-page">
      <Signup toggleForm={toggleForm} />
    </div>
  );
};

export default RegisterPage;
