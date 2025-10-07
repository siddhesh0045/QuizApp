import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // toggle state

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };


  if (loading) {
    return (
      <div className="navbar-loading">
        <div className="loader"></div>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect")
    ? `?redirect=${encodeURIComponent(params.get("redirect"))}`
    : "";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">QuizApp</Link>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/admin" className="nav-btn">Admin</Link>
          <Link to="/aboutUs" className="nav-btn">About Us</Link>
        </div>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        {!isAuthenticated ? (
          <>
            <Link to={`/login${redirect}`} className="nav-btn">Login</Link>
            <Link to={`/register${redirect}`} className="nav-btn">Register</Link>
          </>
        ) : (
          <>
            <span className="user-name">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
            <Link to="/profile" className="nav-btn">Profile</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
