


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeamDetails = () => {
  const { name } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `http://147.93.56.71:8000/api/team/${name}/team-profile/`,
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
  }, [name, token]);

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  if (!teamDetails) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-center text-3xl font-bold">
        {teamDetails.name}
      </h2>
      <p className="font-semibold">Competition: {teamDetails.competition || "N/A"}</p>
      <p>Organization: {teamDetails.organization_info?.name || "N/A"}</p>

      <h3 className="mt-6 text-xl font-semibold">Team Information</h3>
      <p>Robot Name: {teamDetails.robot_name || "N/A"}</p>
      <p>Type: {teamDetails.type || "N/A"}</p>
      <p>Team Leader Name: {teamDetails.team_leader_name || "N/A"}</p>
      <p>Team Leader Email: {teamDetails.team_leader_email || "N/A"}</p>
      <p>Team Leader Phone: {teamDetails.team_leader_phone_number || "N/A"}</p>

      <h3 className="mt-6 text-xl font-semibold">Members</h3>
      <ul>
        {teamDetails.members?.length > 0 ? (
          teamDetails.members.map((member, index) => (
            <li key={index}>
              {member.name} - {member.email} - {member.phone_number}
            </li>
          ))
        ) : (
          <p>No members available.</p>
        )}
      </ul>

      <h3 className="mt-6 text-xl font-semibold">Sponsors</h3>
      <ul>
        {teamDetails.sponsors?.length > 0 ? (
          teamDetails.sponsors.map((sponsor, index) => (
            <li key={index}>
              {sponsor.name} - {sponsor.email}
            </li>
          ))
        ) : (
          <p>No sponsors available.</p>
        )}
      </ul>
    </div>
  );
};

export default TeamDetails;
