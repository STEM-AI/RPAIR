
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";

// const CompetitionEvents = () => {

//   const { competition_name } = useParams();


//   const [events, setEvents] = useState([]);


//   const [responseMessage, setResponseMessage] = useState(null);
//   const [alertType, setAlertType] = useState("");

//   const token = localStorage.getItem("access_token");

// // my edit starts here to solve the issue on navigation ...
//   useEffect(() => {
//     console.log("Competition Name from URL:", competition_name);
//   }, [competition_name]);
//   const fetchEvents = async () => {
//     const apiUrl = `http://147.93.56.71:8000/api/admin/competition-event-list/${competition_name}/`;
//     console.log("Fetching events from:", apiUrl);
  
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEvents(response.data);
//       setResponseMessage("Events fetched successfully!");
//       setAlertType("success");
//     } catch (err) {
//       console.error("Error fetching events:", err);
//       setAlertType("error");
//       setResponseMessage("Failed to fetch events. Please try again.");
//     }
//   };
// ////////////////////////////////////////////////////////////////////  


//   if (!token) {
//     return (
//       <div className="text-red-600 text-center mt-8">{responseMessage}</div>
//     );
//   }

//   if (!competition_name) {
//     return (
//       <div className="text-red-600 text-center mt-8">
//         Competition name is missing. Please go back and select a competition.
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       {/* عنوان الصفحة */}
//       <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 text-5xl font-black">
//         {competition_name.toUpperCase()} EVENTS
//       </h2>

//       {/* رسالة التنبيه */}
//       {responseMessage && (
//         <div className="mb-4">
//           <Alert severity={alertType}>
//             <AlertTitle>
//               {alertType === "success" ? "Success" : "Error"}
//             </AlertTitle>
//             {responseMessage}
//           </Alert>
//         </div>
//       )}

//       {/* عرض الأحداث */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map((event, index) => (
//           <div
//             key={index}
//             className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg"
//           >
//             <div className="px-4 py-5 sm:px-6">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Location: {event.location}
//               </h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Start Date: {event.start_date}
//               </p>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 End Date: {event.end_date}
//               </p>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Category: {event.category}
//               </p>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                 Fees: ${event.fees}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CompetitionEvents;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const CompetitionEvents = () => {
//   const { competition_name } = useParams();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const apiUrl = `http://147.93.56.71:8000/api/admin/competition-event-list/${competition_name}/`;

//       try {
//         const response = await axios.get(apiUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEvents(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch events. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [competition_name, token]);

//   if (loading) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600 text-center mt-8">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 text-5xl font-black">
//         {competition_name.replace(/_/g, " ").toUpperCase()} EVENTS
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.length > 0 ? (
//           events.map((event, index) => (
//             <div
//               key={index}
//               className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg"
//             >
//               <div className="px-4 py-5 sm:px-6">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Location: {event.location || "N/A"}
//                 </h3>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                   Start Date: {event.start_date || "N/A"}
//                 </p>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                   End Date: {event.end_date || "N/A"}
//                 </p>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                   Category: {event.category || "N/A"}
//                 </p>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                   Fees: ${event.fees || "0"}
//                 </p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full">No events found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompetitionEvents;


// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const CompetitionEvents = () => {
//   const { competition_name } = useParams();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const apiUrl = `http://147.93.56.71:8000/api/admin/competition-event-list/${competition_name}/`;

//       try {
//         const response = await axios.get(apiUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEvents(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch events. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [competition_name, token]);

//   if (loading) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600 text-center mt-8">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-600 text-5xl font-black">
//         {competition_name.replace(/_/g, " ").toUpperCase()} EVENTS
//       </h2>

//       <div className="grid grid-cols-1 gap-6">
//         {events.length > 0 ? (
//           events.map((event, index) => (
//             <div
//               key={index}
//               className="bg-white shadow overflow-hidden sm:rounded-lg p-4"
//             >
//               <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
//                 Event {index + 1}
//               </h3>
//               <p className="text-sm text-gray-500 mb-2">
//                 Start Date: {event[1] || "N/A"}
//               </p>
//               <p className="text-sm text-gray-500 mb-2">
//                 End Date: {event[2] || "N/A"}
//               </p>

//               {event[3]?.length > 0 ? (
//                 <div className="mt-4">
//                   <h4 className="text-md font-medium text-gray-700">Teams:</h4>
//                   <ul className="list-disc list-inside">
//                     {event[3].map((team, teamIndex) => (
//                       <li key={teamIndex} className="text-sm text-gray-600">
//                         {team.team_name} - Total Score:{" "}
//                         {team.total_score !== null
//                           ? team.total_score
//                           : "No score available"}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500 mt-4">
//                   No teams participated in this event.
//                 </p>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-center col-span-full">No events found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompetitionEvents;


import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";



const CompetitionEvents = () => {
  const { competition_name } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchEvents = async () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/admin/competition-event-list/${competition_name}/`;

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      setLoading(false);
    }
  };


    fetchEvents();
  }, [competition_name, token]);

  if (loading) {
    return <div className="text-center ">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 ">
      <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-600 text-5xl font-black">
        {competition_name.replace(/_/g, " ").toUpperCase()} EVENTS
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={index}
              className="bg-white shadow overflow-hidden sm:rounded-lg p-4"
            >
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Event {index + 1}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Start Date: {event[1] || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                End Date: {event[2] || "N/A"}
              </p>

              {event[3]?.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700">Teams:</h4>
                  <ul className="list-disc list-inside">
                    {event[3].map((team, teamIndex) => (
                      <li key={teamIndex} className="text-sm text-gray-600">
                        {team.team_name} - Total Score:{" "}
                        {team.total_score !== null
                          ? team.total_score
                          : "No score available"}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">
                  No teams participated in this event.
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default CompetitionEvents;
