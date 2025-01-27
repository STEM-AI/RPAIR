// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const TeamDetails = () => {
//   const { name } = useParams();
//   const [teamDetails, setTeamDetails] = useState(null);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const fetchTeamDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://147.93.56.71:8000/api/team/${name}/team-profile/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setTeamDetails(response.data);
//       } catch (err) {
//         setError("Failed to fetch team details.");
//       }
//     };

//     fetchTeamDetails();
//   }, [name, token]);

//   if (error) {
//     return (
//       <div className="text-red-600 text-center mt-8 text-lg font-medium">
//         {error}
//       </div>
//     );
//   }

//   if (!teamDetails) {
//     return (
//       <div className="text-center mt-8 text-lg font-medium">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-xl">
//       <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
//         {teamDetails.name}
//       </h2>

//       <div className="space-y-4">
//         <p className="text-lg font-semibold text-gray-700">
//           Competition: <span className="font-normal">{teamDetails.competition || "N/A"}</span>
//         </p>
//         <p className="text-lg text-gray-700">
//           Organization: <span className="font-medium">{teamDetails.organization_info?.name || "N/A"}</span>
//         </p>
//       </div>

//       <section className="mt-8">
//         <h3 className="text-xl font-semibold text-gray-800">Team Information</h3>
//         <div className="mt-4 space-y-2 text-gray-700">
//           <p>Robot Name: <span className="font-medium">{teamDetails.robot_name || "N/A"}</span></p>
//           <p>Type: <span className="font-medium">{teamDetails.type || "N/A"}</span></p>
//           <p>Team Leader Name: <span className="font-medium">{teamDetails.team_leader_name || "N/A"}</span></p>
//           <p>Team Leader Email: <span className="font-medium">{teamDetails.team_leader_email || "N/A"}</span></p>
//           <p>Team Leader Phone: <span className="font-medium">{teamDetails.team_leader_phone_number || "N/A"}</span></p>
//         </div>
//       </section>

//       <section className="mt-8">
//         <h3 className="text-xl font-semibold text-gray-800">Members</h3>
//         <ul className="mt-4 space-y-2 text-gray-700">
//           {teamDetails.members?.length > 0 ? (
//             teamDetails.members.map((member, index) => (
//               <li
//                 key={index}
//                 className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md"
//               >
//                 <span className="font-semibold">{member.name}</span> - {member.email} - {member.phone_number}
//               </li>
//             ))
//           ) : (
//             <p>No members available.</p>
//           )}
//         </ul>
//       </section>

//       <section className="mt-8">
//         <h3 className="text-xl font-semibold text-gray-800">Sponsors</h3>
//         <ul className="mt-4 space-y-2 text-gray-700">
//           {teamDetails.sponsors?.length > 0 ? (
//             teamDetails.sponsors.map((sponsor, index) => (
//               <li
//                 key={index}
//                 className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md"
//               >
//                 <span className="font-semibold">{sponsor.name}</span> - {sponsor.email}
//               </li>
//             ))
//           ) : (
//             <p>No sponsors available.</p>
//           )}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default TeamDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import axios from "axios";

const TeamDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [teamDetails, setTeamDetails] = useState(null);
  const [error, setError] = useState(null);
  const [deletionError, setDeletionError] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/${name}/team-profile/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeamDetails(response.data);
      } catch (err) {
        setError("Failed to fetch team details.");
      }
    };

    fetchTeamDetails();
  }, [name, token]);



  const handleDeleteTeam = async () => {
    console.log("Deleting team:", name);
    try {
      await axios.delete(
        `http://147.93.56.71:8000/api/admin/delete-team/${name}/`
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/Dashboard/Admin/Teams");
    } catch (err) {
      setDeletionError("Failed to delete the team.");
    }
  };

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!teamDetails) {
    return (
      <div className="text-center mt-8 text-lg font-medium">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-xl">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        {teamDetails.name}
      </h2>

      <div className="space-y-4">
        <p className="text-lg font-semibold text-gray-700">
          Competition:{" "}
          <span className="font-normal">
            {teamDetails.competition || "N/A"}
          </span>
        </p>
        <p className="text-lg text-gray-700">
          Organization:{" "}
          <span className="font-medium">
            {teamDetails.organization_info?.name || "N/A"}
          </span>
        </p>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">
          Team Information
        </h3>
        <div className="mt-4 space-y-2 text-gray-700">
          <p>
            Robot Name:{" "}
            <span className="font-medium">
              {teamDetails.robot_name || "N/A"}
            </span>
          </p>
          <p>
            Type:{" "}
            <span className="font-medium">{teamDetails.type || "N/A"}</span>
          </p>
          <p>
            Team Leader Name:{" "}
            <span className="font-medium">
              {teamDetails.team_leader_name || "N/A"}
            </span>
          </p>
          <p>
            Team Leader Email:{" "}
            <span className="font-medium">
              {teamDetails.team_leader_email || "N/A"}
            </span>
          </p>
          <p>
            Team Leader Phone:{" "}
            <span className="font-medium">
              {teamDetails.team_leader_phone_number || "N/A"}
            </span>
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Members</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {teamDetails.members?.length > 0 ? (
            teamDetails.members.map((member, index) => (
              <li
                key={index}
                className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md"
              >
                <span className="font-semibold">{member.name}</span> -{" "}
                {member.email} - {member.phone_number}
              </li>
            ))
          ) : (
            <p>No members available.</p>
          )}
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">Sponsors</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          {teamDetails.sponsors?.length > 0 ? (
            teamDetails.sponsors.map((sponsor, index) => (
              <li
                key={index}
                className="p-2 rounded-lg bg-gray-100 shadow-sm hover:shadow-md"
              >
                <span className="font-semibold">{sponsor.name}</span> -{" "}
                {sponsor.email}
              </li>
            ))
          ) : (
            <p>No sponsors available.</p>
          )}
        </ul>
      </section>

      <section className="mt-8">
        {deletionError && (
          <div className="text-red-600 text-center mt-4">{deletionError}</div>
        )}
        <button
          onClick={handleDeleteTeam}
          className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete Team
        </button>
      </section>
    </div>
  );
};

export default TeamDetails;
