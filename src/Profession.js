import React, { useState } from "react";
import "./profession.css";

const dp = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const videoBg = "https://videos.pexels.com/video-files/1918465/1918465-uhd_2560_1440_24fps.mp4"; // Replace with your video URL

const Profession = () => {
  const [sections, setSections] = useState([
    { id: 1, client: "John Doe", issue: "Trauma & Abuse", status: "Completed", locked: false, profilePic: dp },
    { id: 2, client: "Jane Smith", issue: "Identity & Self-Esteem", status: "Upcoming", locked: false, profilePic: dp },
    { id: 3, client: "David Lee", issue: "Financial Anxiety", status: "Cancelled", locked: false, profilePic: dp },
    { id: 4, client: "Emily Clark", issue: "End-of-Life Planning", status: "In Progress", locked: false, profilePic: dp },
  ]);

  const [selectedProfile, setSelectedProfile] = useState(null);

  const statusOptions = ["Completed", "In Progress", "Cancelled", "Upcoming"];

  const addClient = () => {
    setSections([
      ...sections,
      { id: Date.now(), client: "", issue: "", status: "Upcoming", locked: false, profilePic: dp },
    ]);
  };

  const removeClient = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const updateField = (id, field, value) => {
    setSections(
      sections.map((section) => (section.id === id ? { ...section, [field]: value } : section))
    );
  };

  const updateProfilePic = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSections(
        sections.map((section) =>
          section.id === id ? { ...section, profilePic: reader.result } : section
        )
      );
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const toggleLock = (id) => {
    setSections(
      sections.map((section) => (section.id === id ? { ...section, locked: !section.locked } : section))
    );
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
              <tr key={section.id} className="profession-row">
                <td className="profession-profile">
                  <div className="profile-hover-wrapper">
                    <img src={section.profilePic} alt="Profile" className="profile-img" />
                    <div className="profile-hover-options">
                      <button onClick={() => document.getElementById(`fileInput-${section.id}`).click()}>
                        Change Profile Pic
                      </button>
                      <button onClick={() => window.location.href = `/profile/${section.id}`}>
                        View Profile
                      </button>
                    </div>
                    <input
                      id={`fileInput-${section.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => updateProfilePic(section.id, e.target.files[0])}
                    />
                  </div>
                </td>
                <td>
                  <input
                    className="profession-input"
                    type="text"
                    value={section.client}
                    onChange={(e) => updateField(section.id, "client", e.target.value)}
                    disabled={section.locked}
                  />
                </td>
                <td>
                  <input
                    className="profession-input"
                    type="text"
                    value={section.issue}
                    onChange={(e) => updateField(section.id, "issue", e.target.value)}
                    disabled={section.locked}
                  />
                </td>
                <td>
                  <select
                    className="profession-status"
                    value={section.status}
                    onChange={(e) => updateField(section.id, "status", e.target.value)}
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
                  <button className="profession-lock-btn" onClick={() => toggleLock(section.id)}>
                    {section.locked ? "🔒" : "🔓"}
                  </button>
                  <button className="profession-remove-btn" onClick={() => removeClient(section.id)}>
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
