import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "./ProfileCard.css";

const generateColor = (index) => {
  const hue = (index * 137) % 360; // Spread colors evenly
  return `hsl(${hue}, 70%, 60%)`; // Use HSL for better variety
};

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [prediction, setPrediction] = useState(null)
  const [sessionHistory, setSessionHistory] = useState([]);


  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/clients/${id}`)
      .then((response) => {
        setProfile(response.data);
        setSessionHistory(response.data.sessionHistory || []);})
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

      setFilePath(response.data.file_path)

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


  const handleTranscribe = async () => {
    if (!filePath){
      alert("please upload an audio file firs.");
      return;
    }
    try {
      const response=await axios.post("http://localhost:8000/transcribe_audio",{file_path:filePath});
      setTranscript(response.data.transcript)
    }catch (e){
      console.error("Error transcribing the audio: ",e);
    }
  }

  const handleAnalyzeEmotions = async ()=>{
    if (!filePath){
      alert("please upload the audio file first.");
      return;
    }
    try{
      const response= await axios.post("http://localhost:8000/analyze_emotions",{file_path:filePath});
      const emotionsData=response.data;
      console.log(emotionsData);

      const emotionNames = emotionsData.map(emotion => emotion.name);

      setEmotions(emotionsData);
      setShowDetails(true);

      const predictResponse = await axios.post("http://localhost:8000/predict_emotions", {
        emotions: emotionNames,  // Send extracted names
        disease: profile.issue,  // Rename issue to disease
      });
  
      setPrediction(predictResponse.data.prediction);

      const timestamp = new Date().toISOString();
      const sessionData = {
        transcript,
        emotions: emotionsData,
        prediction: predictResponse.data.prediction,
        timestamp,
      };

      await axios.post(`http://localhost:5000/api/clients/${id}/session`, sessionData);

      // Update local session history to re-render chart
      setSessionHistory(prev => [...prev, sessionData]);

    }catch(e){
      console.error("error analyzing emotions: ",e);
    }
  }

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

      {/* Bottom Left - Audio Upload */}
      <div className="audio-transcript-card">
        <div className="profile-audio-section">
          <input type="file" accept="audio/*" onChange={handleFileChange} className="rounded-input" />
          <button onClick={handleFileUpload}>Upload Audio</button>
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

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleTranscribe} disabled={!filePath}>Transcribe Audio</button>
          <button onClick={handleAnalyzeEmotions} disabled={!filePath}>Analyze Emotions</button>
        </div>

        {/* Transcription Display */}
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
                <Cell key={`cell-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          {prediction !== null ? (
            <h4><strong>Predicted Sessions:</strong> {prediction}</h4> // ?? I changed here
          ) : (
            <h4>Waiting for prediction...</h4> // ?? I changed here
          )}
        </div>
      )}
      {sessionHistory.length > 0 && (
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
)}

    </div>
  );
};

export default ProfilePage;