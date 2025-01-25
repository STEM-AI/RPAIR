import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";

const ListTeams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "http://147.93.56.71:8000/api/team/teams-list/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeams(response.data);
        setFilteredTeams(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setAlertType("error");
          setResponseMessage("Unauthorized access. Please check your token.");
        } else {
          setAlertType("error");
          setResponseMessage("Failed to fetch teams. Please try again.");
        }
      }
    };

    fetchTeams();
  }, [token]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = teams.filter((team) =>
      team.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  if (!token) {
    return (
      <div className="text-red-600 text-center mt-8">{responseMessage}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
        ALL TEAMS
      </h2>

      {responseMessage && (
        <div className="mb-4">
          <Alert severity={alertType}>
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </div>
      )}

      <div className="mb-4 flex justify-center">
        <TextField
          label="Search Teams"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          sx={{ maxWidth: 400 }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {team.name || "Unnamed Team"}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Robot Name: {team.robot_name || "N/A"}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Team Leader
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {team.team_leader_name || "N/A"} ({team.team_leader_email || "N/A"})
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Members</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul>
                      {team.members?.map((member, index) => (
                        <li key={index}>
                          {member.name} - {member.email}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Coaches</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul>
                      {team.coach?.map((coach, index) => (
                        <li key={index}>
                          {coach.name} ({coach.email})
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Sponsors
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul>
                      {team.sponsors?.map((sponsor, index) => (
                        <li key={index}>
                          {sponsor.name} ({sponsor.email})
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListTeams;
