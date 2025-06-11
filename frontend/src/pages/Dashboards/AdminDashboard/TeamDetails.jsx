import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamDetails, setTeamDetails] = useState(null);
  const [error, setError] = useState(null);
  const [deletionError, setDeletionError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeamDetails(response.data);
      } catch (err) {
        setError("Failed to fetch team details.");
      }
    };

    fetchTeamDetails();
  }, [id, token]);

  const handleDeleteTeam = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/Dashboard/Admin/Teams");
    } catch (err) {
      setDeletionError("Failed to delete the team.");
    }
  };

  if (error) {
    return <div className="text-red-600 text-center text-lg font-medium">{error}</div>;
  }

  if (!teamDetails) {
    return <div className="text-center mt-8 text-lg font-medium">Loading...</div>;
  }

  // Safely get competition name
  const getCompetitionName = () => {
    if (!teamDetails.competition_event) return "N/A";
    if (typeof teamDetails.competition_event === 'object') {
      return teamDetails.competition_event.name || "N/A";
    }
    return teamDetails.competition_event;
  };

  // Filter out null items in arrays
  const validMembers = (teamDetails.members || []).filter(m => m);
  const validCoaches = (teamDetails.coach || []).filter(c => c);
  const validSponsors = (teamDetails.sponsors || []).filter(s => s);
  const validSocialMedia = (teamDetails.social_media || []).filter(sm => sm);
  const validPreviousCompetitions = (teamDetails.previous_competition || []).filter(pc => pc);

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        {teamDetails.name || "Unnamed Team"}
      </h2>

      {/* Basic Information */}
      <div className="space-y-4">
        <p className="text-lg font-semibold text-gray-700">
          Competition: <span className="font-normal">{getCompetitionName()}</span>
        </p>
        <p className="text-lg text-gray-700">
          Organization: <span className="font-medium">
            {teamDetails.organization?.name || "N/A"}
          </span>
        </p>
      </div>

      {/* Team Information */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Team Information</h3>
        <div className="mt-4 space-y-2 text-gray-700">
          <p>Robot Name: <span className="font-medium">{teamDetails.robot_name || "N/A"}</span></p>
          <p>Type: <span className="font-medium">{teamDetails.type || "N/A"}</span></p>
          <p>Team Leader Name: <span className="font-medium">{teamDetails.team_leader_name || "N/A"}</span></p>
          <p>Team Leader Email: <span className="font-medium">{teamDetails.team_leader_email || "N/A"}</span></p>
          <p>Team Leader Phone: <span className="font-medium">{teamDetails.team_leader_phone_number || "N/A"}</span></p>
        </div>
      </section>

      {/* Members */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Members</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {validMembers.length > 0 ? (
            validMembers.map((member, index) => (
              <li key={index} className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md">
                <span className="font-semibold">{member.name || "N/A"}</span> - 
                {member.email || "N/A"} - 
                {member.phone_number || "N/A"}
              </li>
            ))
          ) : (
            <p>No members available.</p>
          )}
        </ul>
      </section>

      {/* Coaches */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Coaches</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {validCoaches.length > 0 ? (
            validCoaches.map((coach, index) => (
              <li key={index} className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md">
                <span className="font-semibold">{coach.name || "N/A"}</span> - 
                {coach.email || "N/A"} - 
                {coach.phone_number || "N/A"} ({coach.position || "N/A"})
              </li>
            ))
          ) : (
            <p>No coaches available.</p>
          )}
        </ul>
      </section>

      {/* Sponsors */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Sponsors</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {validSponsors.length > 0 ? (
            validSponsors.map((sponsor, index) => (
              <li key={index} className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md">
                <span className="font-semibold">{sponsor.name || "N/A"}</span> - 
                {sponsor.email || "N/A"}
              </li>
            ))
          ) : (
            <p>No sponsors available.</p>
          )}
        </ul>
      </section>

      {/* Social Media */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Social Media</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {validSocialMedia.length > 0 ? (
            validSocialMedia.map((platform, index) => (
              <li key={index}>
                <a 
                  href={platform.url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 underline"
                >
                  {platform.platform || "N/A"}
                </a>
              </li>
            ))
          ) : (
            <p>No social media links available.</p>
          )}
        </ul>
      </section>

      {/* Previous Competitions */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Previous Competitions</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {validPreviousCompetitions.length > 0 ? (
            validPreviousCompetitions.map((competition, index) => (
              <li key={index}>
                {competition.name || "N/A"} - 
                {competition.year ? new Date(competition.year).toLocaleDateString() : "N/A"}
              </li>
            ))
          ) : (
            <p>No previous competitions available.</p>
          )}
        </ul>
      </section>

      {/* Delete Team Button */}
      <section className="mt-8">
        {deletionError && <div className="text-red-600 text-center mt-4">{deletionError}</div>}
        <button 
          onClick={handleDeleteTeam} 
          className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete Team
        </button>
      </section>
    </div>
  );
};

export default TeamDetails;