
import html2canvas from "html2canvas";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Certificate from "../../../components/Certificate/Certificate";

export default function MyCertificate() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");
  const certificateRefs = useRef({});
  const [isRendering, setIsRendering] = useState(false);

  // إنشاء refs لكل شهادة
  useEffect(() => {
    if (teamMembers.length > 0) {
      certificateRefs.current = teamMembers.reduce((acc, member, index) => {
        acc[member.name] = React.createRef();
        return acc;
      }, {});
    }
  }, [teamMembers]);

  // دالة لتنزيل جميع الشهادات
  const handleDownloadAll = async () => {
    setIsRendering(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      for (const member of teamMembers) {
        if (certificateRefs.current[member.name]?.current) {
          await new Promise(resolve => {
            html2canvas(certificateRefs.current[member.name].current, {
              useCORS: true,
              scale: 2
            }).then(canvas => {
              const link = document.createElement('a');
              link.download = `${member.name}-certificate.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              resolve();
            });
          });
        }
      }
    } catch (error) {
      console.error("Error downloading certificates:", error);
      setResponseMessage("Failed to download certificates. Please try again.");
      setAlertType("error");
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/${id}/${eventId}/certification/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const teamData = response.data;
        setSelectedTeam(teamData);
        
        const membersWithLeader = [
          { 
            name: response.data.team_leader_name, 
            isLeader: true 
          },
          ...(response.data.members || []).map(member => ({
            ...member,
            isLeader: false
          }))
        ];
        
        setTeamMembers(membersWithLeader);
      } catch (error) {
        const errorMessage = error.response?.data?.message ||
          error.message ||
          "Failed to fetch data. Please try again later.";
        setAlertType("error");
        setResponseMessage(errorMessage);
      }
    };

    if (id && token) {
      fetchTeamDetails();
    }
  }, [token, id]);

  return (
    <div className="p-4">
      {responseMessage && (
        <Alert severity={alertType} className="mb-4">
          <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
          {responseMessage}
        </Alert>
      )}
      
      {windowWidth < 1500 ? (
        <div className="p-4 text-center">
          <Alert severity="warning" className="mb-4">
            <AlertTitle>Screen Size Warning</AlertTitle>
            It looks like your screen is a bit too small to display the certificate properly.  
            For the best experience, please use a larger screen like a desktop or laptop.
          </Alert>
          
          {/* زر تنزيل الكل فقط */}
          <button
            onClick={handleDownloadAll}
            disabled={isRendering}
            className={`mt-4 px-6 py-3 rounded-lg shadow-lg transition-colors ${
              isRendering 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isRendering ? "Generating Certificates..." : "Download All Certificates"}
          </button>

          <div style={{ position: 'absolute', left: '-9999px' }}>
            {teamMembers.map((member, index) => (
              <div key={index} className="w-full">
                <Certificate 
                  selectedMember={member.name}
                  certificateRef={certificateRefs.current[member.name]}
                  teamName={selectedTeam?.name}
                  competitionName={selectedTeam?.competition_name}
                  startDate={selectedTeam?.start_date}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        teamMembers.length > 0 && (
            <div className="grid text-center">
               <button
            onClick={handleDownloadAll}
            disabled={isRendering}
            className={`my-5 px-6 py-3 rounded-lg shadow-lg transition-colors ${
              isRendering 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isRendering ? "Generating Certificates..." : "Download All Certificates"}
          </button>
            {teamMembers.map((member, index) => (
              <div key={index} className="w-full mb-8">
                <Certificate
                  selectedMember={member.name}
                  certificateRef={certificateRefs.current[member.name]}
                  teamName={selectedTeam.name}
                  competitionName={selectedTeam.competition_name}
                  startDate={selectedTeam.start_date}
                />
                
              </div>
            ))}
             
          </div>
        )
      )}
    </div>
  );

};