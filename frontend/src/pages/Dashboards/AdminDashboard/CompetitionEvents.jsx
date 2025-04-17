import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaListAlt ,FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const CompetitionEvents = () => {
  const { competition_name } = useParams() || {};
  const formattedEventName = competition_name ? competition_name.replace(/_/g, " ").toUpperCase() : "UNKNOWN EVENT";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const token = localStorage.getItem("access_token");

 const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!startDate || !endDate) return 'TBD';
    
    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Ongoing';
    if (now > end) return 'Completed';
  };

  
  useEffect(() => {
    const fetchEvents = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/competition/${competition_name}/event/`;
      try {
        const response = await axios.get(apiUrl, {
        });
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, [competition_name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center mt-8" role="alert">
        {error}
      </div>
    );
  }

   const handleCompetitionClick = (event_name) => {
    navigate(`/Dashboard/Competitions/${competition_name}/${event_name}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-8 text-center text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
        {formattedEventName} EVENTS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event, index) => {
            const status = getEventStatus(event.start_date, event.end_date);
            const statusColors = {
              Upcoming: 'bg-cyan-100 text-cyan-800',
              Ongoing: 'bg-orange-100 text-orange-800',
              Completed: 'bg-green-100 text-green-800',
              TBD: 'bg-gray-100 text-gray-800'
            };

            return (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg">
                    <FaListAlt className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{event.name || "N/A"}</h3>
                    <span className="text-sm text-cyan-600 font-medium">Event #{index + 1}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {event.start_date || "TBD"} - {event.end_date || "TBD"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{event.location || "Location not specified"}</span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-3">{event.description}</p>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {status}
                    </span>
                    <button className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                      onClick={() => handleCompetitionClick(event.name)}> 
                    View Details
                      <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
         );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No events found</div>
            <svg
              className="w-24 h-24 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionEvents;


// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";



// const CompetitionEvents = () => {
// const { event_name } = useParams() || {};  // Ensure destructuring doesn't break
//   const formattedEventName = event_name ? event_name.replace(/_/g, " ").toUpperCase() : "UNKNOWN EVENT";
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const fetchEvents = async () => {
//   const apiUrl = `${process.env.REACT_APP_API_URL}/admin/${event_name}/event-list/`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEvents(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to fetch events. Please try again.");
//       setLoading(false);
//     }
//   };


//     fetchEvents();
//   }, [event_name, token]);

//   if (loading) {
//     return <div className="text-center ">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600 text-center mt-8">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4">
//       <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl font-black">
//         {formattedEventName} EVENTS
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
//                 Event Name: {event.name || "N/A"}
//               </p>
//               <p className="text-sm text-gray-500 mb-2">
//                 Start Date: {event.start_date || "N/A"}
//               </p>
//               <p className="text-sm text-gray-500 mb-2">
//                 End Date: {event.end_date || "N/A"}
//               </p>
//               <p className="text-sm text-gray-500 mb-2">
//                 Location: {event.location || "N/A"}
//               </p>

              
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



// {event.top3_teams?.length > 0 ? (
//                 <div className="mt-4">
//                   <h4 className="text-md font-medium text-gray-700">Top 3 Teams:</h4>
//                   <ul className="list-disc list-inside">
//                     {event.top3_teams.map((team, teamIndex) => (
//                       <li key={teamIndex} className="text-sm text-gray-600">
//                         {Object.entries(team).map(([key, value]) => (
//                           <div key={key}>{key}: {value}</div>
//                         ))}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500 mt-4">
//                   No top teams available.
//                 </p>
//               )}