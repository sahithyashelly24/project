import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "./ProfileCard.css";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"];

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/clients/${id}`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching client:", error));
  }, [id]);

  if (!profile) {
    console.log("Client ID:", id);
    return <h2>Loading!...</h2>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioFile);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/upload_audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTranscript(response.data.transcription.transcript);
      setEmotions([
        { name: "Happy", value: 35 },
        { name: "Sad", value: 25 },
        { name: "Angry", value: 15 },
        { name: "Fearful", value: 15 },
        { name: "Neutral", value: 10 },
      ]);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setTranscript("Error transcribing the audio.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied!");
  };

  return (
    <div className="grid-container">
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

      <div className="audio-transcript-card">
        <div className="profile-audio-section">
          <input type="file" accept="audio/*" onChange={handleFileChange} className="rounded-input" />
          {audioFile && <audio controls src={URL.createObjectURL(audioFile)} className="audio-player"></audio>}
          
          <button 
            onClick={handleFileUpload} 
            className="transcribe-btn rounded-btn"
            disabled={isLoading}
          >
            {isLoading ? "Transcribing..." : "Transcribe Audio"}
          </button>
          
          {isLoading && <div className="loading-bar"></div>}
        </div>

        {transcript && (
          <div className="ctranscript-box">
          <div className="transcript-header">
            <h4>Transcript:</h4>
            <span className="copy-icon" onClick={copyToClipboard} title="Copy to Clipboard">
              📄
            </span>
          </div>
          <div className="transcript-content">
            <p>{transcript}</p>
          </div>
        </div>
        
        )}

        {transcript && <button className="show-details-btn rounded-btn" onClick={() => setShowDetails(true)}>Show Details</button>}
      </div>

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
