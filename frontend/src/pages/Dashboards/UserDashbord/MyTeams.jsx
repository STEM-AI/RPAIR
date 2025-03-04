


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useParams } from "react-router-dom";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import TextField from "@mui/material/TextField";

// const MyTeams = () => {
//   const { team_name } = useParams(); // استخراج اسم الفريق من الـ URL
//   const [teams, setTeams] = useState([]);
//   const [filteredTeams, setFilteredTeams] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [responseMessage, setResponseMessage] = useState(null);
//   const [alertType, setAlertType] = useState("");
//   const [userRole, setUserRole] = useState(""); 
//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     if (!token) {
//       setResponseMessage("You are not authorized. Please log in.");
//       setAlertType("error");
//       return;
//     }

//     const fetchUserRole = async () => {
//       if (!team_name) return; // التأكد من وجود `team_name`
//       try {
//         const response = await axios.get(
//           `http://147.93.56.71:8000/api/team/${team_name}/team-profile/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.data && response.data.role) {
//           setUserRole(response.data.role);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user role", error);
//       }
//     };

//     const fetchTeams = async () => {
//       try {
//         const response = await axios.get(
//           `http://147.93.56.71:8000/api/team/profile/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.data) {
//           setTeams(response.data);
//           setFilteredTeams(response.data);
//         }
//       } catch (err) {
//         setAlertType("error");
//         setResponseMessage("Failed to fetch teams. Please try again.");
//       }
//     };

//     fetchUserRole();
//     fetchTeams();
//   }, [token, team_name]); // إضافة `team_name` إلى قائمة الـ dependencies

//   const handleSearchChange = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchQuery(query);
//     setFilteredTeams(
//       teams.filter((team) => team.name?.toLowerCase().includes(query))
//     );
//   };

//   return (
//     <div className="container max-w-6xl">
//       <h2 className="mb-8 tracking-tight text-center text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500">
//         My Teams
//       </h2>

//       {responseMessage && (
//         <div className="mb-6">
//           <Alert severity={alertType}>
//             <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
//             {responseMessage}
//           </Alert>
//         </div>
//       )}

//       <div className="mb-6 flex justify-center">
//         <TextField
//           label="Search Teams"
//           variant="outlined"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           fullWidth
//           sx={{ maxWidth: 400 }}
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTeams.map((team, index) => (
//           <div key={team.id || index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <div className="px-6 py-4">
//               <h3 className="text-lg font-bold text-gray-800">
//                 {team.name || "Unnamed Team"}
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 Competition: <span className="font-medium">{team.competition_event || "N/A"}</span>
//               </p>
//               <p className="mt-2 text-sm text-gray-600">
//                 Organization: <span className="font-medium">{team.organization?.name || "N/A"}</span>
//               </p>

//               {userRole === "Admin" ? (
//                 <>
//                   <p className="mt-2 text-sm text-gray-600">
//                     Phone Number: <span className="font-medium">{team.team_leader_phone_number || "N/A"}</span>
//                   </p>
//                   <p className="mt-2 text-sm text-gray-600">
//                     Members: <span className="font-medium">{team.members?.map(member => member.name).join(", ") || "N/A"}</span>
//                   </p>
//                 </>
//               ) : userRole === "Judge" && (
//                 <>
//                   <p className="mt-2 text-sm text-gray-600">
//                     Members: <span className="font-medium">{team.members?.map(member => member.name).join(", ") || "N/A"}</span>
//                   </p>
//                   <p className="mt-2 text-sm text-gray-600">
//                     Robot Name: <span className="font-medium">{team.robot_name || "N/A"}</span>
//                   </p>
//                 </>
//               )}
// <Link
//   to={`/Dashboard/${userRole}/Teams/${team.name}/team-profile`}
//   className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300"
// >
//   View Details
// </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyTeams;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";

const MyTeams = () => {
    const { team_name } = useParams();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [userRole, setUserRole] = useState(""); 
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/${team_name}/team-profile/`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/profile/`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

    fetchUserRole();
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
      <div className="text-red-600 text-center ">{responseMessage}</div>
    );
  }

  return (
    <div className="container max-w-6xl">
      <h2 className="mb-8 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl font-extrabold">
        All Teams
      </h2>

      {responseMessage && (
        <div className="mb-6">
          <Alert severity={alertType}>
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </div>
      )}

      <div className="mb-6 flex justify-center">
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
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800">
                {team.name || "Unnamed Team"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Competition: <span className="font-medium">{team.competition_event || "N/A"}</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Organization: <span className="font-medium">{team.organization?.name || "N/A"}</span>
              </p>

              {userRole === "Admin" ? (
                <>
                  <p className="mt-2 text-sm text-gray-600">
                    Phone Number: <span className="font-medium">{team.team_leader_phone_number || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Members: <span className="font-medium">{team.members?.map(member => member.name).join(", ") || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Robot Name: <span className="font-medium">{team.robot_name || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Coach: <span className="font-medium">{team.coach?.name || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Team Leader: <span className="font-medium">{team.team_leader_name || "N/A"}</span>
                  </p>
                </>
              ) : userRole === "Judge" && (
                <>
                  <p className="mt-2 text-sm text-gray-600">
                    Members: <span className="font-medium">{team.members?.map(member => member.name).join(", ") || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Robot Name: <span className="font-medium">{team.robot_name || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Coach: <span className="font-medium">{team.coach?.name || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Team Leader: <span className="font-medium">{team.team_leader_name || "N/A"}</span>
                  </p>
                </>
              )}



              <Link
                to={`/Dashboard/Teams/${team.name ? team.name : ''}`}
                className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeams;