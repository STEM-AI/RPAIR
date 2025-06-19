// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // export default function ButtonLive({ team_id }) {
// //   const [isLive, setIsLive] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const token = localStorage.getItem('access_token');
// //     if (!token) return;

// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_API_URL}/team/user/${team_id}/live-competition-event/`,
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );
        
// //         setIsLive(Array.isArray(response.data) && response.data.length > 0);
// //       } catch (error) {
// //         console.error('Error fetching live status:', error);
// //         if (error.response?.status === 401) {
// //           localStorage.removeItem('access_token');
// //         }
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [team_id]);

// //   if (isLoading) {
// //     return (
// //       <div className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-500 inline-flex items-center">
// //         <span className="mr-2">Loading...</span>
// //         <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="inline-flex">
// //       {isLive ? (
// //         <div className="px-3 py-1.5 text-xs rounded-full bg-red-50 border border-red-100 text-red-700 inline-flex items-center">
// //           <span className="relative flex h-2 w-2 mr-2">
// //             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
// //             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
// //           </span>
// //           Live
// //         </div>
// //       ) : (
// //         <div className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-600 inline-flex items-center">
// //           <span className="h-2 w-2 mr-2 bg-gray-400 rounded-full"></span>
// //           Not Live
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function ButtonLive({ team_id }) {
//   const [isLive, setIsLive] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [event, setEvent] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     const fetchLiveStatus = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/team/user/${team_id}/live-competition-event/`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         setIsLive(Array.isArray(response.data) && response.data.length > 0);
//       } catch (error) {
//         console.error('Error fetching live status:', error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem('access_token');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
    

//     fetchLiveStatus();
//   }, [team_id]);

//   const handleClick = (team_id) => {
//     navigate(`/Dashboard/User/LiveEvent/${team_id}/?eventID=${encodeURIComponent(isLive.competition_event)}`);
//   };

//   if (isLoading) {
//     return (
//       <button
//         disabled
//         className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-500 inline-flex items-center cursor-not-allowed"
//       >
//         <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse mr-2"></div>
//         Loading status...
//       </button>
//     );
//   }

//   return (
//     <button
//       onClick={handleClick}
//       disabled={isUpdating}
//       className={`px-4 py-2 text-sm rounded-lg inline-flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//         isLive
//           ? 'bg-red-100 hover:bg-red-200 text-red-700 focus:ring-red-500'
//           : 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500'
//       } ${isUpdating ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
//     >
//       {isUpdating ? (
//         <>
//           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           {isLive ? 'Stopping...' : 'Starting...'}
//         </>
//       ) : (
//         <>
//           {isLive ? (
//             <span className="relative flex h-3 w-3 mr-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
//             </span>
//           ) : (
//             <span className="h-3 w-3 mr-2 bg-gray-500 rounded-full"></span>
//           )}
//           {isLive ? ' Live' : 'NO Live'}
//         </>
//       )}
//     </button>
//   );
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ButtonLive({ team_id }) {
  const [liveEvent, setLiveEvent] = useState(null); // Store event data instead of boolean
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchLiveStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/${team_id}/live-competition-event/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Store the first live event if available
        if (Array.isArray(response.data) && response.data.length > 0) {
          setLiveEvent(response.data[0]);
        } else {
          setLiveEvent(null);
        }
      } catch (error) {
        console.error('Error fetching live status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStatus();
  }, [team_id]);

  const handleClick = () => {
    // Only navigate if we have a live event
    if (liveEvent) {
      navigate(`/Dashboard/User/LiveEvent/${team_id}`);
    }
  };

  if (isLoading) {
    return (
      <button 
        disabled
        className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-500 inline-flex items-center cursor-not-allowed"
      >
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse mr-2"></div>
        Loading status...
      </button>
    );
  }

  const isLive = !!liveEvent; // Convert to boolean for UI state

  return (
    <button
      onClick={handleClick}
      disabled={!isLive} // Disable button if no live event
      className={`px-4 py-2 text-sm rounded-lg inline-flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isLive 
          ? 'bg-red-100 hover:bg-red-200 text-red-700 focus:ring-red-500 cursor-pointer' 
          : 'bg-gray-100 text-gray-700 focus:ring-gray-500 cursor-not-allowed opacity-75'
      }`}
    >
      {isLive ? (
        <>
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          Live
        </>
      ) : (
        <>
          <span className="h-3 w-3 mr-2 bg-gray-500 rounded-full"></span>
          Not Live
        </>
      )}
    </button>
  );
}