import html2canvas from "html2canvas";
import logo from "../../../assets/Static/logo2.png";
import logoAlm from "../../../assets/Static/egyptian-clipart-eagle-2.png";
import done from "../../../assets/Static/Dr._Ayman_Elnag.png";
import watermarkLeft from "../../../assets/Static/bgleft.png";
import watermarkRight from "../../../assets/Static/bg.png";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import vex123 from "../../../assets/comp/vex123.png"

export default function MyCertificate() {
  const { team_name } = useParams();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");
  const certificateRef = useRef(null);

  const handleDownload = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, {
        useCORS: true,
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${selectedMember}-certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
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
        <label className="block text-lg font-medium mb-2">Select Team</label>
        <select 
          onChange={handleTeamChange}
          className="w-full p-2 border rounded-lg mb-4"
          value={selectedTeam?.name || ""}
        >
          <option value="">Select Team</option>
          {teams.map((team, index) => (
            <option key={index} value={team.name}>
             {team.name}
            </option>
          ))}
        </select>
      </div>

      {teamMembers.length > 0 && (
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Member</label>
          <select 
  onChange={(e) => setSelectedMember(e.target.value)}
  className="w-full p-2 border rounded-lg"
  value={selectedMember}
>
  <option value="">Select Member</option>
  {teamMembers.map((member, index) => (
    <option key={index} value={member.name}> {/* هنا */}
      {member.name}
    </option>
  ))}
</select>
        </div>
      )}

      {selectedMember && (
        <button 
          onClick={handleDownload}
          className="mb-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Download Certificate for {selectedMember}
        </button>
      )}

      {responseMessage && (
        <Alert severity={alertType} className="mb-4">
          <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
          {responseMessage}
        </Alert>
      )}

      <div className="flex items-center justify-center p-4 print:p-0">
        <div ref={certificateRef} className="w-1/2 md:w-full max-w-6xl bg-white shadow-2xl rounded-lg overflow-hidden relative">
          {/* Watermark Background */}
          <div className="absolute inset-0 opacity-40 z-0">
            <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 opacity-40 z-0">
            <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
          </div>

          {/* Certificate Content */}
          <div className="py-7 px-8 text-center relative min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
              <div className="w-40 md:w-32">
                <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
              </div>
              <div className="w-40 md:w-32">
                <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2 text-black">
              CERTIFICATE
            </h1>
            <p className="text-xl italic text-black font-medium">of Excellence</p>

            <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide mt-8">
              This certificate is proudly presented to
            </p>

            <div className="mb-12 relative z-10">
            <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
                {selectedMember || "Team Member Name"}
                </p>
            </div>

            <div className="space-y-2 mb-16">
              <p className="text-2xl text-gray-700 italic font-medium">
                              For his achievement in Robotics, Programming, and Artificial Intelligence
                                            </p>
              <p className="text-2xl text-gray-700 italic font-medium">
                        and proves that he is competent in his field  
                          </p>
            
            </div>

            <div className="text-black py-6 px-8 flex flex-col md:flex-row justify-between gap-8">
              <div className="text-center flex-1 mb-4 md:mb-0">
                <div className="border-t-2 border-black pt-4 mx-auto w-3/4">
                <p className="font-bold text-lg mb-1">Date of Issue</p>
                <p className="text-base font-medium">May 8, 2025</p>
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="flex items-center justify-center">
                  <img src={vex123} alt="Signature" className="text-violet-800 h-28 w-auto" />
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="border-t-2 border-black pt-4 w-3/4 flex items-center justify-center">
                  <img src={done} alt="Signature" className="h-28 w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}