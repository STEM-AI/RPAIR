import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeamDetails = () => {
  const { id } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `http://147.93.56.71:8000/api/team/team-profile/${id}/`,
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
      <p>Robot Name: {teamDetails.robot_name}</p>
      <p>Type: {teamDetails.type}</p>
      <p>Competition: {teamDetails.competition}</p>

      <h3 className="mt-6 text-xl font-semibold">Organization Info</h3>
      <p>Name: {teamDetails.organization_info?.name}</p>
      <p>Address: {teamDetails.organization_info?.address}</p>
      <p>Email: {teamDetails.organization_info?.email}</p>

      <h3 className="mt-6 text-xl font-semibold">Team Members</h3>
      <ul>
        {teamDetails.members?.map((member, index) => (
          <li key={index}>
            {member.name} - {member.email} - {member.phone_number}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-xl font-semibold">Sponsors</h3>
      <ul>
        {teamDetails.sponsors?.map((sponsor, index) => (
          <li key={index}>
            {sponsor.name} - {sponsor.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;

