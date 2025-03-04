import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const MyTeamDetails = () => {
  const { team_name } = useParams();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setError("You are not authorized. Please log in.");
      return;
    }

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/${team_name}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeam(response.data);
      } catch (err) {
        setError("Failed to fetch team details. Please try again.");
      }
    };

    fetchTeamDetails();
  }, [team_name, token]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
    );
  }

  if (!team) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-4xl font-extrabold text-center text-cyan-800 mb-4">{team.name}</h2>
      <p className="text-lg text-gray-600 text-center mb-6">{team.competition_event}</p>
      
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <p className="text-lg"><span className="font-semibold">Robot Name:</span> {team.robot_name || "N/A"}</p>
        <p className="text-lg"><span className="font-semibold">Team Leader:</span> {team.team_leader_name || "N/A"}</p>
        <p className="text-lg"><span className="font-semibold">Leader Email:</span> {team.team_leader_email || "N/A"}</p>
        <p className="text-lg"><span className="font-semibold">Phone:</span> {team.team_leader_phone_number || "N/A"}</p>
        <p className="text-lg"><span className="font-semibold">Organization:</span> {team.organization?.name || "N/A"}</p>
        <p className="text-lg"><span className="font-semibold">Competition:</span> {team.competition?.name || "N/A"}</p>
      </div>
      
      <h3 className="text-2xl font-semibold mt-6">Members</h3>
      <ul className="list-disc pl-6 mt-2 text-lg text-gray-700">
        {team.members?.length ? (
          team.members.map((member, index) => (
            <li key={index} className="mt-1">{member.name} - {member.email}</li>
          ))
        ) : (
          <li>No members available</li>
        )}
      </ul>
    </div>
  );
};

export default MyTeamDetails;

