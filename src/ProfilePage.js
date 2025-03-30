import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "./ProfileCard.css";

const dp = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const profiles = [
  { id: 1, client: "John Doe", issue: "Trauma & Abuse", status: "Completed", profilePic: dp },
  { id: 2, client: "Jane Smith", issue: "Identity & Self-Esteem", status: "Upcoming", profilePic: dp },
  { id: 3, client: "David Lee", issue: "Financial Anxiety", status: "Cancelled", profilePic: dp },
  { id: 4, client: "Emily Clark", issue: "End-of-Life Planning", status: "In Progress", profilePic: dp },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"];

const ProfilePage = () => {
  const { id } = useParams();
  const profile = profiles.find((p) => p.id.toString() === id);
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [emotions, setEmotions] = useState([]);

  if (!profile) {
    return <h2>Profile Not Found</h2>;
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));

      // Simulated backend response
      setTimeout(() => {
        setTranscript("This is a sample transcript of the uploaded audio.");
        setEmotions([
          { name: "Happy", value: 35 },
          { name: "Sad", value: 25 },
          { name: "Angry", value: 15 },
          { name: "Fearful", value: 15 },
          { name: "Neutral", value: 10 },
        ]);
      }, 2000);
    }
  };

  return (
    <div className="grid-container">
      {/* Top Section - Profile Card */}
      <div className="cprofile-card">
        <div className="profile-image-container">
          <img src={profile.profilePic} alt="Profile" className="profile-image" />
        </div>
        <div className="profile-details">
          <h2>{profile.client}</h2>
          <p><strong>Service:</strong> {profile.issue}</p>
          <p><strong>Status:</strong> {profile.status}</p>
        </div>
      </div>

      {/* Bottom Left - Audio Upload & Transcript */}
      <div className="audio-transcript-card">
        <div className="profile-audio-section">
          <input type="file" accept="audio/*" onChange={handleFileUpload} />
          {audioFile && <audio controls src={audioFile} className="audio-player"></audio>}
        </div>
        {transcript && (
          <div className="ctranscript-box">
            <h3>Transcript:</h3>
            <p>{transcript}</p>
          </div>
        )}
        {transcript && <button className="show-details-btn" onClick={() => setShowDetails(true)}>Show Details</button>}
      </div>

      {/* Bottom Right - Emotion Analysis */}
      {showDetails && (
        <div className="emotion-analysis-card">
          <h3>Emotion Analysis</h3>
          <PieChart width={300} height={300}>
            <Pie data={emotions} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
              {emotions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <h4>Recommended Sessions: {Math.ceil(emotions.reduce((sum, e) => sum + e.value, 0) / 20)}</h4>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
