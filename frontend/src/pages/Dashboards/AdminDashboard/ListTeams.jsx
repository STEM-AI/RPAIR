
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



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import TextField from "@mui/material/TextField";

// const ListTeams = () => {
  // const [teams, setTeams] = useState([]);
  // const [filteredTeams, setFilteredTeams] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [responseMessage, setResponseMessage] = useState(null);
  // const [alertType, setAlertType] = useState("");
  // const [userRole, setUserRole] = useState("");
  // const token = localStorage.getItem("access_token");

  // useEffect(() => {
  //   if (!token) {
  //     setResponseMessage("You are not authorized. Please log in.");
  //     setAlertType("error");
  //     return;
  //   }

    

  //   const fetchTeams = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/team/list/`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setTeams(response.data);
  //       setFilteredTeams(response.data);
  //     } catch (err) {
  //       if (err.response && err.response.status === 401) {
  //         setAlertType("error");
  //         setResponseMessage("Unauthorized access. Please check your token.");
  //       } else {
  //         setAlertType("error");
  //         setResponseMessage("Failed to fetch teams. Please try again.");
  //       }
  //     }
  //   };

  //   // fetchUserRole();
  //   fetchTeams();
  // }, [token]);

  // const handleSearchChange = (event) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);
  //   const filtered = teams.filter((team) =>
  //     team.name?.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredTeams(filtered);
  // };

  // if (!token) {
  //   return (
  //     <div className="text-red-600 text-center ">{responseMessage}</div>
  //   );
  // }

//   return (
//     <div className="container max-w-6xl">
//       <h2 className="mb-8 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl font-extrabold">
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
//                 Competition: <span className="font-medium">{team.competition_event || "N/A"}</span>
//               </p>
//               <p className="mt-2 text-sm text-gray-600">
//                 Organization: <span className="font-medium">{team.organization?.name || "N/A"}</span>
//               </p>

//                 <>
                
//                   <p className="mt-2 text-sm text-gray-600">
//                     Robot Name: <span className="font-medium">{team.robot_name || "N/A"}</span>
//                   </p>
                
//                   <p className="mt-2 text-sm text-gray-600">
//                     Team Leader: <span className="font-medium">{team.team_leader_name || "N/A"}</span>
//                   </p>
//               </>
              
//               <Link
//                 to={`/Dashboard/Teams/${team.name ? team.name : ''}`}
//                 className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300"
//               >
//                 View Details
//               </Link>
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
import SearchIcon from "@mui/icons-material/Search";

const ListTeams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setAlertType("error");
      setResponseMessage("You are not authorized. Please log in.");
      return;
    }


    

    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/list/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTeams(response.data);
        setFilteredTeams(response.data);
        setResponseMessage(null);
      } catch (err) {
        const errorMessage = err.response?.status === 401 
          ? "Unauthorized access. Please check your token."
          : "Failed to fetch teams. Please try again.";
        setAlertType("error");
        setResponseMessage(errorMessage);
        setTeams([]);
        setFilteredTeams([]);
      }
    };

    fetchTeams();
  }, [token]);

 const handleSearchChange = (event) => {
    const query = event.target.value.trim().toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredTeams(teams);
      return;
    }

    const queryTerms = query.split(' ').filter(term => term.length > 0);
    
    const filtered = teams.filter(team => {
      const searchFields = [
        team.name?.toLowerCase(),
        team.competition_event?.toLowerCase(),
        team.organization?.name?.toLowerCase(),
        team.robot_name?.toLowerCase(),
        team.team_leader_name?.toLowerCase()
      ];
      
      return queryTerms.every(term =>
        searchFields.some(field => field?.includes(term))
      );
    });

    setFilteredTeams(filtered);
  };

  if (!token) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Alert severity="error" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          You are not authorized. Please log in.
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h2 className="mb-12 text-center">
        <span className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
          All Teams
        </span>
        <div className="mt-2 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 w-24 mx-auto rounded-full" />
      </h2>

      {responseMessage && (
        <div className="mb-8">
          <Alert severity={alertType} className="rounded-lg">
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </div>
      )}

      <div className="mb-10 flex justify-center">
       <TextField
            label="Search teams..."
            placeholder="Search by name or competition"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon className="text-gray-400 mr-2" />
              ),
            }}
            sx={{
              maxWidth: 500,
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover fieldset": { borderColor: "#06b6d4" },
                "&.Mui-focused fieldset": { 
                  borderColor: "#06b6d4",
                  borderWidth: "2px" 
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#06b6d4"
              }
            }}
          />
                </div>

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">
            No teams found matching your search
          </p>
          <p className="text-sm text-gray-400">
            Try adjusting your search terms or create a new team
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-cyan-500 hover:border-cyan-600"
            >
              <div className="px-6 py-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {team.name || "Unnamed Team"}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Competition</p>
                    <p className="text-gray-700 font-medium">
                      {team.competition_event || "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="text-gray-700 font-medium">
                      {team.organization?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Robot Name</p>
                    <p className="text-gray-700 font-medium">
                      {team.robot_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Team Leader</p>
                    <p className="text-gray-700 font-medium">
                      {team.team_leader_name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/Dashboard/Teams/${team.name || ''}`}
                    className="inline-block w-full py-2 px-4 text-center font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-lg hover:from-cyan-700 hover:to-cyan-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListTeams;