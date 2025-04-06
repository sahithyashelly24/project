import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useParams,Link } from "react-router-dom";
import { PieChart, Pie, Cell, Legend } from "recharts";
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
  const [sessionHistory, setSessionHistory] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [showPreviousRecords, setShowPreviousRecords] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/clients/${id}`)
      .then((response) => {
        setProfile(response.data);
        setSessionHistory(response.data.sessionHistory || []);
      })
      .catch((error) => console.error("Error fetching client:", error));
  }, [id]);

  if (!profile) {
    return <h2>Loading!...</h2>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setUploadStatus("");
      setIsUploaded(false);
      setTranscript("");
      setShowDetails(false);
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
      setIsUploaded(true);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setUploadStatus("❌ Failed to upload audio.");
    }
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

      const timestamp = new Date().toISOString();
      const sessionData = {
        transcript,
        emotions: emotionsData,
        prediction: predictResponse.data.prediction,
        timestamp,
        audioUrl: URL.createObjectURL(audioFile),
      };

      await axios.post(`http://localhost:5000/api/clients/${id}/session`, sessionData);
      setSessionHistory((prev) => [...prev, sessionData]);
    } catch (e) {
      console.error("Error analyzing emotions: ", e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied!");
  };

  return (
    <div className="grid-container">
      <nav className="navbar">
          <Link to="/" className="nav-left">Home</Link>
          <h1 className="nav-center">Cognitive Vox</h1>
      </nav>
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
          <button onClick={handleFileUpload}>Upload Audio</button>
          {uploadStatus && <p style={{ marginTop: "10px" }}>{uploadStatus}</p>}

          {audioFile && (
            <audio controls src={URL.createObjectURL(audioFile)} className="audio-player"></audio>
          )}
        </div>

        <div className="action-buttons">
          {!transcript ? (
            <>
              <button
                onClick={handleTranscribe}
                disabled={!isUploaded || isTranscribing}
              >
                {isTranscribing ? "Transcribing..." : "Transcribe Audio"}
              </button>
              <button
                onClick={handleAnalyzeEmotions}
                disabled={!isUploaded}
              >
                Analyze Emotions
              </button>
            </>
          ) : (
            <>
              <button disabled>
                🎧 Here is the transcribed audio
              </button>
              <button onClick={handleAnalyzeEmotions}>
                Analyze Emotions
              </button>
            </>
          )}
        </div>

        {isTranscribing && <div className="loading-bar"></div>}

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
      </div>

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

      {sessionHistory.length > 0 && (
        <>
          <div className="prediction-graph-card">
            <h3>Prediction Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sessionHistory.map(session => ({
                timestamp: new Date(session.timestamp).toLocaleString(),
                prediction: session.prediction
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="prediction" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="previous-records-card">
            <button
              className="toggle-history-btn"
              onClick={() => setShowPreviousRecords(prev => !prev)}
              style={{ marginTop: "20px" }}
            >
              {showPreviousRecords ? "Hide Previous Records" : "Show Previous Records"}
            </button>

            {showPreviousRecords && (
              <div className="previous-records-container">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Timestamp</th>
                      <th>Transcript</th>
                      <th>Emotions</th>
                      <th>Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionHistory.map((session, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{new Date(session.timestamp).toLocaleString()}</td>
                        <td className="transcript-cell">{session.transcript}</td>
                        <td>
                          {session.emotions.map((emotion, i) => (
                            <span key={i}>
                              {emotion.name}
                              {i < session.emotions.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </td>
                        <td>{session.prediction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
