// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";

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
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
//       <h2 className="text-4xl font-extrabold text-center text-cyan-800 mb-4">{team.name}</h2>
//       <p className="text-lg text-gray-600 text-center mb-6">{team.competition_event}</p>
      
//       <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
//         <p className="text-lg"><span className="font-semibold">Robot Name:</span> {team.robot_name || "N/A"}</p>
//         <p className="text-lg"><span className="font-semibold">Team Leader:</span> {team.team_leader_name || "N/A"}</p>
//         <p className="text-lg"><span className="font-semibold">Leader Email:</span> {team.team_leader_email || "N/A"}</p>
//         <p className="text-lg"><span className="font-semibold">Phone:</span> {team.team_leader_phone_number || "N/A"}</p>
//         <p className="text-lg"><span className="font-semibold">Organization:</span> {team.organization?.name || "N/A"}</p>
//         <p className="text-lg"><span className="font-semibold">Competition:</span> {team.competition_event || "N/A"}</p>
//       </div>
      
//       <h3 className="text-2xl font-semibold mt-6">Members</h3>
//       <ul className="list-disc pl-6 mt-2 text-lg text-gray-700">
//         {team.members?.length ? (
//           team.members.map((member, index) => (
//             <li key={index} className="mt-1">{member.name} - {member.email}</li>
//           ))
//         ) : (
//           <li>No members available</li>
//         )}
//       </ul>
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
  EmojiEvents
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
      <div className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white p-8 rounded-2xl text-center shadow-md">
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
      </div>
    </div>
  );
};

export default MyTeamDetails;