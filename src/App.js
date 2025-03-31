import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from "react-router-dom";
import "./App.css";
import ProfessionPage from "./Profession";
import ProfilePage from "./ProfilePage";
import Authu from "./Authu";

const Home = ({ onStart, user }) => {
  const [name, setName] = useState("");
  const [showNewCard, setShowNewCard] = useState(false);

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    if (name) {
      setShowNewCard(true);
    }
  };

  const handleCloseCard = () => {
    setShowNewCard(false);
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="nav-left">Home</Link>
        <h1 className="nav-center">Cognitive Vox</h1>
        <Link to="/profile" className="nav-right">{user ? user.username : "Profile"}</Link>
      </nav>

      
      <div className="headline-section">
        <div className="background-video">
          <video autoPlay muted loop playsInline>
            <source src="https://videos.pexels.com/video-files/8428331/8428331-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <header className="headline">
          <h1>Cognitive Vox</h1>
          <p>Smart Psychiatry, Simplified!</p>
        </header>
        <div className="card">
          <h2>What name feels right for you?</h2>
          <input type="text" placeholder="Enter your name to start ..." value={name} onChange={handleInputChange} />
          <button onClick={handleSubmit}>→</button>
        </div>
        {showNewCard && (
          <div className="new-card">
            <button className="close-button" onClick={handleCloseCard}>×</button>
            <h2>Hello, {name}!</h2>
            <p>Unlock deeper patient insights. Monitor mental states, streamline your schedule. Ready to get started?</p>
            <button className="start-button" onClick={onStart}>Start</button>
          </div>
        )}
      </div>
      <section className="features">
        <h2 >Why Choose Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>AI-Powered</h3>
            <p>Get AI-powered insights into your patients' emotions</p>
          </div>
          <div className="feature-card">
            <h3>Conversational & Engaging</h3>
            <p>Make informed decisions about therapy needs.</p>
          </div>
          <div className="feature-card">
            <h3>Personalized Insights</h3>
            <p>Always here to help you.</p>
          </div>
        </div>
      </section>

      <section className="trust">
        <h2>Trusted by Thousands</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"Amazing service! It changed how we work."</p>
            <h4>- John Doe</h4>
          </div>
          <div className="testimonial">
            <p>"Super easy to use and very efficient."</p>
            <h4>- Jane Smith</h4>
          </div>
          <div className="testimonial">
            <p>"A must-have tool for every business."</p>
            <h4>- David Lee</h4>
          </div>
        </div>
      </section>

      <footer className="cta">
        <button className="cta-button">Start for Free</button>
      </footer>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Home onStart={() => navigate("/profession")} user={user} />} />
      <Route path="/profession" element={<ProfessionPage />} />
      <Route path="/profile" element={<Authu setUser={setUser} />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
    </Routes>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
