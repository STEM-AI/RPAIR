import html2canvas from "html2canvas";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Certificate from "../../../components/Certificate/Certificate";

export default function MyCertificate() {
  const { team_name } = useParams();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");
  const certificateRefs = useRef([]);
  const [forceFullSize, setForceFullSize] = useState(false);

  // إنشاء مصفوفة من الـ refs لكل شهادة
  certificateRefs.current = teamMembers.map((_, i) => certificateRefs.current[i] ?? React.createRef());

  const handleDownload = async (index) => {
    setForceFullSize(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    await document.fonts.ready;
    
    if (certificateRefs.current[index]) {
      html2canvas(certificateRefs.current[index].current, {
        useCORS: true,
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${teamMembers[index].name}-certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setForceFullSize(false);
      });
    } else {
      setForceFullSize(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }

    const fetchTeams = async () => {
      try {
        const teamsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTeams(teamsResponse.data);
      } catch (error) {
        handleApiError(error);
      }
    };

    const fetchTeamDetails = async (teamName) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setSelectedTeam(response.data);
        setTeamMembers(response.data.members || []);
      } catch (error) {
        handleApiError(error);
      }
    };

    const handleApiError = (error) => {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Failed to fetch data. Please try again later.";
      
      setAlertType("error");
      setResponseMessage(errorMessage);
    };

    const fetchData = async () => {
      await fetchTeams();
      if (team_name) {
        await fetchTeamDetails(team_name);
      }
    };

    fetchData();
  }, [token, team_name]);

  const handleTeamChange = async (e) => {
    const teamName = e.target.value;
    if (teamName) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedTeam(response.data);
        setTeamMembers(response.data.members || []);
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-2xl font-bold text-gray-800 mb-4">
          Select Your Team
        </label>
        <select 
          onChange={handleTeamChange}
          className="w-full p-3 border-2 border-gray-300 rounded-xl mb-4
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                   transition-all duration-200 text-gray-700"
          value={selectedTeam?.name || ""}
        >
          <option value="">Choose a team...</option>
          {teams.map((team, index) => (
            <option key={index} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

    

      {responseMessage && (
        <Alert severity={alertType} className="mb-4">
          <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
          {responseMessage}
        </Alert>
      )}
{teamMembers.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {teamMembers.map((member, index) => (
      <div key={index} className="w-full">
        <Certificate 
          selectedMember={member.name} 
          certificateRef={certificateRefs.current[index]} 
          forceFullSize={forceFullSize} 
        />
        <button 
          onClick={() => handleDownload(index)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download
        </button>
      </div>
    ))}
  </div>
)}
        </div>
     
  );
}