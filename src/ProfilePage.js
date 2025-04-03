import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [filePath, setFilePath] = useState("");
  const [prediction, setPrediction] = useState(null)

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

  // Handle file selection (trigger upload)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file); // Store the file in state for later upload
    }
  };

  // Handle file upload and send to FastAPI backend for transcription
  const handleFileUpload = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      // Send the file to FastAPI for processing
      const response = await axios.post("http://localhost:8000/upload_audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFilePath(response.data.file_path)

    } catch (error) {
      console.error("Error uploading audio:", error);
    }
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

    }catch(e){
      console.error("error analyzing emotions: ",e);
    }
  }

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

      {/* Bottom Left - Audio Upload */}
      <div className="audio-transcript-card">
        <div className="profile-audio-section">
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload Audio</button>
          {audioFile && <audio controls src={URL.createObjectURL(audioFile)} className="audio-player"></audio>}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleTranscribe} disabled={!filePath}>Transcribe Audio</button>
          <button onClick={handleAnalyzeEmotions} disabled={!filePath}>Analyze Emotions</button>
        </div>

        {/* Transcription Display */}
        {transcript && (
          <div className="ctranscript-box">
            <h4>Transcript:</h4>
            <p>{transcript}</p>
          </div>
        )}
      </div>

      {/* Bottom Right - Emotion Analysis */}
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
    </div>
  );
};

export default ProfilePage;