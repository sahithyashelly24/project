import React from "react";
import { useParams, Link } from "react-router-dom";

const Profile = ({ sections }) => {
  const { id } = useParams();
  const profileData = sections.find((section) => section.id === parseInt(id));

  if (!profileData) {
    return <h2>User Not Found</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Profile Details</h2>
      <img src={profileData.profilePic} alt="Profile" style={{ width: "100px", borderRadius: "50%" }} />
      <h3>{profileData.client}</h3>
      <p><strong>Service:</strong> {profileData.issue}</p>
      <p><strong>Status:</strong> {profileData.status}</p>
      <Link to="/">🔙 Go Back</Link>
    </div>
  );
};

export default Profile;
