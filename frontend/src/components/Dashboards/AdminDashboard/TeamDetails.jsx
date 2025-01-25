
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
          `http://147.93.56.71:8000/api/team/team-profile/${name}`,
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
      <p className="font-semibold">Robot Name: {teamDetails.robot_name}</p>
      <p>Type: {teamDetails.type}</p>
      <p>Competition: {teamDetails.competition}</p>
      <p>Team Leader Name: {teamDetails.team_leader_name}</p>
      <p>Team Leader Email: {teamDetails.team_leader_email}</p>
      <p>Team Leader Phone: {teamDetails.team_leader_phone_number}</p>

      <h3 className="mt-6 text-xl font-semibold">Organization Info</h3>
      <p>Name: {teamDetails.organization_info?.name}</p>
      <p>Address: {teamDetails.organization_info?.address}</p>
      <p>Type: {teamDetails.organization_info?.type}</p>
      <p>Email: {teamDetails.organization_info?.email}</p>
      <h4 className="mt-2 text-lg font-semibold">Contacts:</h4>
      <ul>
        {teamDetails.organization_info?.contacts?.map((contact, index) => (
          <li key={index}>{contact.phone_number}</li>
        ))}
      </ul>

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

      <h3 className="mt-6 text-xl font-semibold">Previous Competitions</h3>
      <ul>
        {teamDetails.previous_competition?.map((competition, index) => (
          <li key={index}>{competition.name}</li>
        ))}
      </ul>

      <h3 className="mt-6 text-xl font-semibold">Coaches</h3>
      <ul>
        {teamDetails.coach?.map((coach, index) => (
          <li key={index}>
            {coach.name} - {coach.email} - {coach.phone_number} -{" "}
            {coach.position}
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-xl font-semibold">Social Media</h3>
      <ul>
        {teamDetails.social_media?.map((social, index) => (
          <li key={index}>
            {social.platform}:{" "}
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {social.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;
