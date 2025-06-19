
// import html2canvas from "html2canvas";
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import Certificate from "../../../components/Certificate/Certificate";


// export default function MyCertificate() {
//   const { id } = useParams();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
// useEffect(() => {
//   const handleResize = () => setWindowWidth(window.innerWidth);
//   window.addEventListener('resize', handleResize);
//   return () => window.removeEventListener('resize', handleResize);
// }, []);
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [responseMessage, setResponseMessage] = useState(null);
//   const [alertType, setAlertType] = useState("");
//   const token = localStorage.getItem("access_token");
//   const certificateRefs = useRef([]);
//   const [forceFullSize, setForceFullSize] = useState(false);

//   // إنشاء مصفوفة من الـ refs لكل شهادة
//   certificateRefs.current = teamMembers.map((_, i) => certificateRefs.current[i] ?? React.createRef());

//   const handleDownload = async (index) => {
//     setForceFullSize(true);
//     await new Promise(resolve => setTimeout(resolve, 100));
//     await document.fonts.ready;
    
//     if (certificateRefs.current[index]) {
//       html2canvas(certificateRefs.current[index].current, {
//         useCORS: true,
//         scale: 2
//       }).then(canvas => {
//         const link = document.createElement('a');
//         link.download = `${teamMembers[index].name}-certificate.png`;
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//         setForceFullSize(false);
//       });
//     } else {
//       setForceFullSize(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       setResponseMessage("You are not authorized. Please log in.");
//       setAlertType("error");
//       return;
//     }

//     const fetchTeamDetails = async (id) => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/team/${id}/certification/`, // استخدام الـ id هنا
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const teamData = response.data;
//         setSelectedTeam(teamData);
        
//         const membersWithLeader = [
//           {
//             name: response.data.team_leader_name,
//             isLeader: true
//           },
//           ...(response.data.members || []).map(member => ({
//             ...member,
//             isLeader: false
//           }))
//         ];
        
//         setTeamMembers(membersWithLeader);
//       } catch (error) {
//         handleApiError(error);
//       }
//   };

//     const handleApiError = (error) => {
//       const errorMessage = error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch data. Please try again later.";
      
//       setAlertType("error");
//       setResponseMessage(errorMessage);
//     };

//     if (id && token) {
//       fetchTeamDetails(id);
//     }
//   }, [token, id]);

  

//   return (
//     <div className="p-4">
      

    

//       {responseMessage && (
//         <Alert severity={alertType} className="mb-4">
//           <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
//           {responseMessage}
//         </Alert>
//       )}
// {windowWidth < 900 ? (
//   <div className="p-4 text-center">
//     <Alert severity="warning" className="mb-4">
//       <AlertTitle>Screen Size Warning</AlertTitle>
//       This certificate can only be viewed on screens wider than 933 pixels. Please use a larger screen or desktop computer.
//     </Alert>
//   </div>
// ) :teamMembers.length > 0 && (
//   <div className="grid text-center">
//     {teamMembers.map((member, index) => (
//       <div key={index} className="w-full">
//         <Certificate
//           key={`${member.name}-${windowWidth}`}
//           selectedMember={member.name}
//           certificateRef={certificateRefs.current[index]}
//           forceFullSize={forceFullSize}
//           teamName={selectedTeam.name}
//           competitionName={selectedTeam.competition_name}
//           startDate={selectedTeam.start_date}
//         />
//         <button
//           onClick={() => handleDownload(index)}
//           className="mt-4  bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Download
//         </button>
//       </div>
//    ))}
//   </div>
// )}
//         </div>
     
//   );
// }





// import html2canvas from "html2canvas";
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import Certificate from "../../../components/Certificate/Certificate";


// export default function MyCertificate() {
//   const { id } = useParams();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
// useEffect(() => {
//   const handleResize = () => setWindowWidth(window.innerWidth);
//   window.addEventListener('resize', handleResize);
//   return () => window.removeEventListener('resize', handleResize);
// }, []);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [responseMessage, setResponseMessage] = useState(null);
//   const [alertType, setAlertType] = useState("");
//   const token = localStorage.getItem("access_token");
//   const certificateRefs = useRef([]);

//   certificateRefs.current = teamMembers.map((_, i) => certificateRefs.current[i] ?? React.createRef());


//   useEffect(() => {
//     if (!token) {
//       setResponseMessage("You are not authorized. Please log in.");
//       setAlertType("error");
//       return;
//     }

//     const fetchTeamDetails = async (id) => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/team/${id}/certification/`, // استخدام الـ id هنا
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const teamData = response.data;
//         setSelectedTeam(teamData);
        
//         const membersWithLeader = [
//           {
//             name: response.data.team_leader_name,
//             isLeader: true
//           },
//           ...(response.data.members || []).map(member => ({
//             ...member,
//             isLeader: false
//           }))
//         ];
        
//         setTeamMembers(membersWithLeader);
//       } catch (error) {
//         handleApiError(error);
//       }
//   };

//     const handleApiError = (error) => {
//       const errorMessage = error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch data. Please try again later.";
      
//       setAlertType("error");
//       setResponseMessage(errorMessage);
//     };

//     if (id && token) {
//       fetchTeamDetails(id);
//     }
//   }, [token, id]);

  

//   return (
//     <div className="p-4">
      

    

//       {responseMessage && (
//         <Alert severity={alertType} className="mb-4">
//           <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
//           {responseMessage}
//         </Alert>
//       )}
//             {teamMembers.length > 0 && (
//             <div className="grid ">
//                 {teamMembers.map((member, index) => (
//                   <div key={index} className="w-full">
//                     <Certificate
//                       key={`${member.name}-${windowWidth}`}
//                       selectedMember={member.name}
//                       certificateRef={certificateRefs.current[index]} // Pass the specific ref
//                       teamName={selectedTeam.name}
//                       competitionName={selectedTeam.competition_name}
//                       startDate={selectedTeam.start_date}
//                     />
                  
//                   </div>
//               ))}
//               </div>
//             )}
//         </div>
     
//   );
// }

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