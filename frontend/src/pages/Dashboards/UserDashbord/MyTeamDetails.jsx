

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import {
//   Group,
//   Person,
//   Engineering,
//   SmartToy,
//   Email,
//   Phone,
//   CorporateFare,
//   EmojiEvents
// } from "@mui/icons-material";

// const MyTeamDetails = () => {
//   const { team_name } = useParams();
//   const [team, setTeam] = useState(null);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     if (!token) {
//       setError("You are not authorized. Please log in.");
//       return;
//     }

//     const fetchTeamDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/team/user/${team_name}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setTeam(response.data);
//       } catch (err) {
//         setError("Failed to fetch team details. Please try again.");
//       }
//     };

//     fetchTeamDetails();
//   }, [team_name, token]);

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Alert severity="error">
//           <AlertTitle>Error</AlertTitle>
//           {error}
//         </Alert>
//       </div>
//     );
//   }

//   if (!team) {
//     return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 mb-10 transition-all hover:shadow-2xl">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white p-8 rounded-2xl text-center shadow-md">
//         <h2 className="text-4xl font-bold mb-2 drop-shadow-md">{team.name}</h2>
//         <div className="flex items-center justify-center gap-2">
//           <EmojiEvents className="text-yellow-300" />
//           <p className="text-xl font-medium">{team.competition_event}</p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="space-y-6 mt-8">
//         {/* Key Details Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
//             <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600">
//               <SmartToy className="!text-2xl" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Robot Name</p>
//               <p className="font-medium text-gray-800">{team.robot_name || "TBA"}</p>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
//             <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600">
//               <CorporateFare className="!text-2xl" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Organization</p>
//               <p className="font-medium text-gray-800">
//                 {team.organization?.name ? `${team.organization.name} (${team.organization.type})` : "N/A"}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
//             <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600">
//               <Engineering className="!text-2xl" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Team Type</p>
//               <p className="font-medium text-gray-800">{team.type || "N/A"}</p>
//             </div>
//           </div>
//         </div>

//         {/* Team Leader Card */}
//         <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
//           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
//             <Person className="!text-2xl" /> Team Leader
//           </h3>
//           <div className="space-y-3 pl-8">
//             <div className="flex items-center gap-3 text-gray-700">
//               <span className="text-gray-500"><Person /></span>
//               <span>{team.team_leader_name || "Not provided"}</span>
//             </div>
//             <div className="flex items-center gap-3 text-gray-700">
//               <span className="text-gray-500"><Email /></span>
//               <span>{team.team_leader_email || "Not provided"}</span>
//             </div>
//             <div className="flex items-center gap-3 text-gray-700">
//               <span className="text-gray-500"><Phone /></span>
//               <span>{team.team_leader_phone_number || "Not provided"}</span>
//             </div>
//           </div>
//         </div>

//         {/* Members Section */}
//         <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
//           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
//             <Group className="!text-2xl" /> Team Members
//           </h3>
//           {team.members?.length ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {team.members.map((member, index) => (
//                 <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
//                   <Person className="text-gray-500" />
//                   <div>
//                     <p className="font-medium">{member.name}</p>
//                     <p className="text-sm text-gray-600">{member.email}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-4 bg-gray-100 rounded-lg text-gray-500">
//               No members registered yet
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyTeamDetails;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { 
  Group, 
  Person, 
  Engineering, 
  SmartToy, 
  Email, 
  Phone, 
  CorporateFare,
  EmojiEvents,
  Badge,
  Image
} from "@mui/icons-material";

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 mb-10 transition-all hover:shadow-2xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white p-8 rounded-2xl text-center shadow-md relative">
        {/* Team Image */}
        {team.image && (
          <div className="absolute -top-8 left-8 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img 
              src={team.image} 
              alt={`${team.name} logo`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
        )}
        
        {/* Team Number Badge */}
        <div className="absolute -top-4 right-8 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
          <Badge className="!text-sm" />
          <span>{team.team_number || "TBD"}</span>
        </div>
        
        <h2 className="text-4xl font-bold mb-2 drop-shadow-md">{team.name}</h2>
        <div className="flex items-center justify-center gap-2">
          <EmojiEvents className="text-yellow-300" />
          <p className="text-xl font-medium">{team.competition_event}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 mt-8">
        {/* Key Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600">
              <SmartToy className="!text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Robot Name</p>
              <p className="font-medium text-gray-800">{team.robot_name || "TBA"}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600">
              <CorporateFare className="!text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-medium text-gray-800">
                {team.organization?.name ? `${team.organization.name} (${team.organization.type})` : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600">
              <Engineering className="!text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Team Type</p>
              <p className="font-medium text-gray-800">{team.type || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Team Image Section (if available) */}
        {team.image && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
              <Image className="!text-2xl" /> Team Image
            </h3>
            <div className="flex justify-center">
              <img 
                src={team.image} 
                alt={`${team.name} team`} 
                className="max-h-64 rounded-lg shadow-md"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/500x300";
                }}
              />
            </div>
          </div>
        )}

        {/* Team Leader Card */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
            <Person className="!text-2xl" /> Team Leader
          </h3>
          <div className="space-y-3 pl-8">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-gray-500"><Person /></span>
              <span>{team.team_leader_name || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-gray-500"><Email /></span>
              <span>{team.team_leader_email || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-gray-500"><Phone /></span>
              <span>{team.team_leader_phone_number || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
            <Group className="!text-2xl" /> Team Members
          </h3>
          {team.members?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {team.members.map((member, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <Person className="text-gray-500" />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-100 rounded-lg text-gray-500">
              No members registered yet
            </div>
          )}
        </div>

        {/* Coaches Section (if available) */}
        {team.coach?.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-700">
              <Person className="!text-2xl" /> Coaches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {team.coach.map((coach, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <Person className="text-gray-500" />
                  <div>
                    <p className="font-medium">{coach.name}</p>
                    <p className="text-sm text-gray-600">{coach.email}</p>
                    {coach.phone_competition_event && (
                      <p className="text-xs text-gray-500">{coach.phone_competition_event}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeamDetails;