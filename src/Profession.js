
import './App.css'; // Use the same CSS file or create a new one for profession page styles
import React, { useState } from 'react';

const ProfessionPage = () => {
  const [profession, setProfession] = useState('');

  const handleProfessionChange = (e) => {
    setProfession(e.target.value);
  };

  const handleSubmit = () => {
    console.log("Selected Profession:", profession);
  };

  return (
    <div className="container">
    <video autoPlay muted loop className="video-background">
      <source
        src="https://videos.pexels.com/video-files/1918465/1918465-uhd_2560_1440_24fps.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div className="overlay">
    <div className="main-container">
      <div className="form-container">
        <div className="back-button">
          <button>&#8592;</button>
        </div>
        <div className="card">
        <div className="form-content">
          <label className="label"><h2>We would love to know more about You ! </h2>
            <br></br>Sharing your work and responsibilities helps us tailor content and recommendations to better<br></br> support your personal and professional growth. We're excited to learn about your journey .</label>
          <br></br>
          <select className="select" value={profession} onChange={handleProfessionChange}>
            <option value="">Student</option>
            <option value="interview">interview prep</option>
            <option value="Seminor/Speach">Seminor/Speach</option>
            <option value="publicspeaking">Public speaking</option>
            <option value="generalpurpose">General Purpose</option>
          </select>
          <select className="select" value={profession} onChange={handleProfessionChange}>
            <option value="">Working Professional</option>
            <option value="TechnicalSpeech">Technical Speech</option>
            <option value="Seminor/Speach">Seminor/Speech</option>
            <option value="publicspeaking">Public speaking</option>
            <option value="generalpurpose">General Purpose</option>
          </select>
          <select className="select" value={profession} onChange={handleProfessionChange}>
            <option value="">Physciatrist</option>
            <option value="Patient">Patient examination</option>
            <option value="Seminor/Speach">Technical Seminor</option>
            <option value="publicspeaking">Public speaking</option>
            <option value="generalpurpose">General Purpose</option>
          </select>
          <select className="select" value={profession} onChange={handleProfessionChange}>
            <option value="">General Purpose</option>
          </select>
          <button className="start-button" onClick={handleSubmit}>Start</button>
        </div>
        </div>
      </div>
      <div className="image-section">
      <div className="top-right">
        <h2>Communicate to Conquer</h2>
      </div>
        <br></br>
        <br></br><br></br><br></br><br></br>
        <br></br><br></br><br></br><br></br><br></br>
        <div className="image-grid">
          <img src="https://images.pexels.com/photos/6914648/pexels-photo-6914648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Option 1" className="image" />
          <img src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Option 2" className="image" />
          <img src="https://images.pexels.com/photos/7579367/pexels-photo-7579367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Option 3" className="image" />
          <img src="https://images.pexels.com/photos/210661/pexels-photo-210661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Option 4" className="image" />
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default ProfessionPage;
