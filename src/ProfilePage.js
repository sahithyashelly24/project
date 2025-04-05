import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "./ProfileCard.css";

const generateColor = (index) => {
  const hue = (index * 137) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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
      setUploadStatus("");
    }
  };

  const handleFileUpload = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const response = await axios.post("http://localhost:8000/upload_audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFilePath(response.data.file_path);
      setUploadStatus("✅ Audio uploaded successfully.");
    } catch (error) {
      console.error("Error uploading audio:", error);
      setUploadStatus("❌ Failed to upload audio.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied!");
  };

  const handleTranscribe = async () => {
    if (!filePath) {
      alert("Please upload an audio file first.");
      return;
    }

    setIsTranscribing(true);

    try {
      const response = await axios.post("http://localhost:8000/transcribe_audio", {
        file_path: filePath,
      });
      setTranscript(response.data.transcript);
    } catch (e) {
      console.error("Error transcribing the audio: ", e);
      setTranscript("Error transcribing the audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleAnalyzeEmotions = async () => {
    if (!filePath) {
      alert("Please upload the audio file first.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/analyze_emotions", {
        file_path: filePath,
      });

      const emotionsData = response.data;
      const emotionNames = emotionsData.map((emotion) => emotion.name);

      setEmotions(emotionsData);
      setShowDetails(true);

      const predictResponse = await axios.post("http://localhost:8000/predict_emotions", {
        emotions: emotionNames,
        disease: profile.issue,
      });

      setPrediction(predictResponse.data.prediction);
    } catch (e) {
      console.error("Error analyzing emotions: ", e);
    }
  };

  return (
    <div className="grid-container">
      {/* Profile Card */}
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

      {/* Audio Upload and Transcription */}
      <div className="audio-transcript-card">
        <div className="profile-audio-section">
          <input type="file" accept="audio/*" onChange={handleFileChange} className="rounded-input" />
          <button onClick={handleFileUpload}>Upload Audio</button>
          {uploadStatus && <p style={{ marginTop: "10px" }}>{uploadStatus}</p>}

          {audioFile && (
            <audio controls src={URL.createObjectURL(audioFile)} className="audio-player"></audio>
          )}
        </div>

        {/* Transcribe & Analyze Buttons (initially both shown) */}
        <div className="action-buttons">
          <button onClick={handleTranscribe} disabled={!filePath || isTranscribing}>
            {transcript
              ? "🎧 Here is the transcribed audio"
              : isTranscribing
              ? "Transcribing..."
              : "Transcribe Audio"}
          </button>

          {/* Only show Analyze Emotions up here if transcription NOT complete */}
          {!transcript && (
            <button onClick={handleAnalyzeEmotions} disabled={!filePath}>
              Analyze Emotions
            </button>
          )}
        </div>

        {/* Loading bar */}
        {isTranscribing && <div className="loading-bar"></div>}

        {/* Transcript display + Analyze Button shown BELOW after transcript */}
        {transcript && (
          <>
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

            {/* Show "Analyze Emotions" under transcript AFTER transcribe */}
            <button
              onClick={handleAnalyzeEmotions}
              disabled={!filePath}
              className="show-details-btn"
              style={{ marginTop: "15px" }}
            >
              Analyze Emotions
            </button>
          </>
        )}
      </div>

      {/* Emotion Analysis Card */}
      {showDetails && (
        <div className="emotion-analysis-card">
          <h3>Emotion Analysis</h3>
          <PieChart width={300} height={300}>
            <Pie data={emotions} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
              {emotions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          {prediction !== null ? (
            <h4><strong>Predicted Sessions:</strong> {prediction}</h4>
          ) : (
            <h4>Waiting for prediction...</h4>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
