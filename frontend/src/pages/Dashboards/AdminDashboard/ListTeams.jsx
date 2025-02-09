
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import TextField from "@mui/material/TextField";

// const ListTeams = () => {
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
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/user/profile/`, 
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUserRole(response.data.role);
//         console.log(response.data)
//       } catch (error) {
//         console.error("Failed to fetch user role", error);
//       }
//     };

//     const fetchTeams = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/team/teams-list/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("Teams data:", response.data);
//         setTeams(response.data);
//         setFilteredTeams(response.data);
//       } catch (err) {
//         if (err.response && err.response.status === 401) {
//           setAlertType("error");
//           setResponseMessage("Unauthorized access. Please check your token.");
//         } else {
//           setAlertType("error");
//           setResponseMessage("Failed to fetch teams. Please try again.");
//         }
//       }
//     };

//     fetchUserRole();
//     fetchTeams();
//   }, [token]);

//   const handleSearchChange = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);
//     const filtered = teams.filter((team) =>
//       team.name?.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredTeams(filtered);
//   };

//   if (!token) {
//     return (
//       <div className="text-red-600 text-center mt-8">{responseMessage}</div>
//     );
//   }

//   return (
//     <div className="container mx-auto mt-32 p-6 max-w-6xl">
//       <h2 className="mb-8 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-400 text-5xl font-extrabold">
//         All Teams
//       </h2>

//       {responseMessage && (
//         <div className="mb-6">
//           <Alert severity={alertType}>
//             <AlertTitle>
//               {alertType === "success" ? "Success" : "Error"}
//             </AlertTitle>
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
//         {filteredTeams.map((team) => (
//           <div
//             key={team.id}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//           >
//             <div className="px-6 py-4">
//               <h3 className="text-lg font-bold text-gray-800">
//                 {team.name || "Unnamed Team"}
//               </h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 Competition: <span className="font-medium">{team.competition || "N/A"}</span>
//               </p>
//               <p className="mt-2 text-sm text-gray-600">
//                 Organization: <span className="font-medium">{team.organization_name || "N/A"}</span>
//               </p>
              

//               {userRole === "Admin" && (
//                 <Link
//                   to={`/Dashboard/Admin/Teams/${team.name}`}
//                   className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300"
//                 >
//                   View Details
//                 </Link>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ListTeams;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";

const ListTeams = () => {
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
          `${process.env.REACT_APP_API_URL}/user/profile/`, 
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
          `${process.env.REACT_APP_API_URL}/team/teams-list/`,
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
      <div className="text-red-600 text-center mt-8">{responseMessage}</div>
    );
  }

  return (
    <div className="container mx-auto mt-32 p-6 max-w-6xl">
      <h2 className="mb-8 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-400 text-5xl font-extrabold">
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
                Competition: <span className="font-medium">{team.competition || "N/A"}</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Organization: <span className="font-medium">{team.organization_name || "N/A"}</span>
              </p>

              {userRole === "Admin" ? (
                <>
                  <p className="mt-2 text-sm text-gray-600">
                    Phone Number: <span className="font-medium">{team.phone_number || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Members: <span className="font-medium">{team.members?.map(member => member.name).join(", ") || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Robot Name: <span className="font-medium">{team.robot_name || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Coach: <span className="font-medium">{team.coach || "N/A"}</span>
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
                    Coach: <span className="font-medium">{team.coach || "N/A"}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Team Leader: <span className="font-medium">{team.team_leader_name || "N/A"}</span>
                  </p>
                </>
              )}

              {/* <Link
                to={`/Dashboard/${userRole}/Teams/${team.name}`}
                className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300"
              >
                View Details
              </Link> */}

<Link
  to={`/Dashboard/${userRole}/Teams/${team.name ? team.name : ''}`}
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

export default ListTeams;
