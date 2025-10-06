import "./About.css";
import { useNavigate } from "react-router-dom";
const About = () => {
    const navigate = useNavigate();
  return (
    <div className="abouPage-about-container">
      <h1 className="abouPage-about-container-headings">About TourChess</h1>
      <p>
        Welcome to <strong>TourChess</strong>, your trusted cab rental service. Whether you're planning a long trip, a business tour, or just need a reliable vehicle, we provide the best rental experience with a seamless booking process.
      </p>

      <h2 className="abouPage-about-container-headings">🚖 Why Choose Us?</h2>
      <ul>
        <li>✅ Wide range of cabs: Sedan, SUV, Hatchback & Luxury</li>
        <li>✅ Option to rent with or without a driver</li>
        <li>✅ Transparent pricing with no hidden charges</li>
        <li>✅ Secure & hassle-free booking experience</li>
      </ul>

      <h2 className="abouPage-about-container-headings">📍 Our Mission</h2>
      <p>
        Our goal is to make cab rentals easier, affordable, and accessible for everyone. We strive to provide a top-notch experience with well-maintained vehicles and reliable drivers.
      </p>

      <h2 className="abouPage-about-container-headings">📞 Get in Touch</h2>
      <p>
        Have any questions? Reach out to us at <strong>support@tourchess.com</strong> or call us at <strong>+91 98765 43210</strong>.
      </p>

      <button className="book-now-btn" onClick={()=>navigate("/")}>🚗 Book a Cab Now</button>
    </div>
  );
};

export default About;
