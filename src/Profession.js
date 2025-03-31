import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profession.css";

const dp = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const videoBg = "https://videos.pexels.com/video-files/1918465/1918465-uhd_2560_1440_24fps.mp4"; // Replace with your video URL

const Profession = () => {
  const [sections, setSections] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const statusOptions = ["Completed", "In Progress", "Cancelled", "Upcoming"];

  // Fetch clients from the database
  useEffect(() => {
    axios.get("http://localhost:5000/api/clients")
      .then(response => setSections(response.data))
      .catch(error => console.error("Error fetching clients:", error));
  }, []);

  // Add a new client
  const addClient = () => {
    const newClient = {
      client: "client name",
      issue: "what is the issue",
      status: "Upcoming",
      locked: false,
      profilePic: dp
    };

    axios.post("http://localhost:5000/api/clients", newClient)
      .then(response => setSections([...sections, response.data]))
      .catch(error => console.error("Error adding client:", error));
  };

  // Remove a client
  const removeClient = (id) => {
    axios.delete(`http://localhost:5000/api/clients/${id}`)
      .then(() => setSections(sections.filter(section => section._id !== id)))
      .catch(error => console.error("Error deleting client:", error));
  };

  // Update a field
  const updateField = (id, field, value) => {
    setSections(sections.map(section => 
      section._id === id ? { ...section, [field]: value } : section
    ));
  
    axios.put(`http://localhost:5000/api/clients/${id}`, { [field]: value })
      .catch(error => console.error("Error updating client:", error));
  };

  // Update profile picture
  const updateProfilePic = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedSections = sections.map(section =>
        section._id === id ? { ...section, profilePic: reader.result } : section
      );
      setSections(updatedSections);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Toggle lock
  const toggleLock = (id) => {
    setSections(sections.map(section => 
      section._id === id ? { ...section, locked: !section.locked } : section
    ));
  };

  return (
    <div className="profession-wrapper">
      <video autoPlay loop muted className="profession-video">
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="profession-container">
        <div className="profession-header">
          <h2>Projects Overview</h2>
          <button className="profession-add-btn" onClick={addClient}>
            + Add Client
          </button>
        </div>
        <table className="profession-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Client Name</th>
              <th>Service/Issue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section._id} className="profession-row">
                <td className="profession-profile">
                  <div className="profile-hover-wrapper">
                    <img src={section.profilePic} alt="Profile" className="profile-img" />
                    <div className="profile-hover-options">
                      <button onClick={() => document.getElementById(`fileInput-${section._id}`).click()}>
                        Change Profile Pic
                      </button>
                      <button onClick={() => window.location.href = `/profile/${section.id}`}>
                        View Profile
                      </button>
                    </div>
                    <input
                      id={`fileInput-${section._id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => updateProfilePic(section._id, e.target.files[0])}
                    />
                  </div>
                </td>
                <td>
                  <input
                    className="profession-input"
                    type="text"
                    value={section.client}
                    onChange={(e) => updateField(section._id, "client", e.target.value)}
                    disabled={section.locked}
                  />
                </td>
                <td>
                  <input
                    className="profession-input"
                    type="text"
                    value={section.issue}
                    onChange={(e) => updateField(section._id, "issue", e.target.value)}
                    disabled={section.locked}
                  />
                </td>
                <td>
                  <select
                    className="profession-status"
                    value={section.status}
                    onChange={(e) => updateField(section._id, "status", e.target.value)}
                    disabled={section.locked}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="profession-lock-btn" onClick={() => toggleLock(section._id)}>
                    {section.locked ? "🔒" : "🔓"}
                  </button>
                  <button className="profession-remove-btn" onClick={() => removeClient(section._id)}>
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProfile && (
        <div className="profile-overlay">
          <div className="profile-card">
            <button className="profile-close-btn" onClick={() => setSelectedProfile(null)}>✖</button>
            <div className="profile-content">
              <img src={selectedProfile.profilePic} alt="Profile" className="profile-image" />
              <div className="profile-details">
                <h2>{selectedProfile.client}</h2>
                <p><strong>Service:</strong> {selectedProfile.issue}</p>
                <p><strong>Status:</strong> {selectedProfile.status}</p>
              </div>
            </div>
            <div className="profile-audio-section">
              <input type="file" accept="audio/*" className="profile-audio-input" />
              <button className="profile-submit-btn">Submit Audio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profession;
