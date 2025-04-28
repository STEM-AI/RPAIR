// import React, { useEffect, useState, useRef } from "react";
// import { FaTrophy, FaMedal, FaSyncAlt, FaRobot, FaCar, FaListOl } from "react-icons/fa";
// import axios from "axios";
// import { Helmet } from "react-helmet-async";

// const LiveVex123 = () => {
//   const [rankings, setRankings] = useState([]);
//   const [lastUpdate, setLastUpdate] = useState(new Date());
//   const [isLoading, setIsLoading] = useState(false);
//   const eventName = 'vex_123';
//   const URL = `${process.env.REACT_APP_API_URL}/vex-123/${eventName}/rank/`;
//   const intervalRef = useRef();
//   const socketRef = useRef(null);
//   const [matches, setMatches] = useState([]);
//   const [connectionStatus, setConnectionStatus] = useState('connecting');
   

//   const fetchRankings = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(URL);
//       setRankings(response.data);
//       setLastUpdate(new Date());
//     } catch (error) {
//       console.error("Error fetching rankings:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRankings();
//     intervalRef.current = setInterval(fetchRankings, 10000);
//     return () => clearInterval(intervalRef.current);
//   }, []);
  
// const getMedalIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <FaTrophy className="w-6 h-6 text-amber-400" />;
//       case 2:
//         return <FaMedal className="w-6 h-6 text-gray-400" />;
//       case 3:
//         return <FaMedal className="w-6 h-6 text-amber-600" />;
//       default:
//         return <span className="text-gray-600 font-medium">{rank}</span>;
//     }
//   };

//   const handleRefresh = () => {
//     if (!isLoading) {
//       fetchRankings();
//     }
//   };

 

 
//  useEffect(() => {
//   const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/vex_123/`;
//   socketRef.current = new WebSocket(wsUrl);

//   socketRef.current.onopen = () => {
//     console.log("WebSocket connection established");
//     setConnectionStatus('connected');
//   };

//   socketRef.current.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("Score Update:", data);

//       setMatches(prevMatches => {
//         const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
        
//         // Create new match object with proper structure
//        // In the WebSocket onmessage handler
// const newMatch = {
//   code: data.game_id,
//   team1: data.team1_name || 'Team 1',
//   // Extract scores from the score object
//   driverScore: data.score?.driver || 0,
// };

//         if (matchIndex === -1) {
//           return [...prevMatches, newMatch];
//         }

//         const updatedMatches = [...prevMatches];
//         updatedMatches[matchIndex] = {
//           ...updatedMatches[matchIndex],
//           ...newMatch
//         };
//         return updatedMatches;
//       });

//     } catch (error) {
//       console.error("Error processing WebSocket message:", error);
//     }
//   };

//   socketRef.current.onerror = (error) => {
//     console.error("WebSocket error:", error);
//     setConnectionStatus('error');
//   };

//   socketRef.current.onclose = () => {
//     console.log("WebSocket connection closed");
//     setConnectionStatus('disconnected');
//   };

//   return () => {
//     if (socketRef.current) {
//       socketRef.current.close();
//     }
//   };
// }, [eventName]);


// // Add connection status indicator
// const connectionStatusColors = {
//   connected: 'bg-green-500',
//   connecting: 'bg-yellow-500',
//   disconnected: 'bg-red-500',
//   error: 'bg-red-700'
// };


//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <Helmet>
//         <title>Live-Robotics</title>
//       </Helmet>
      
//       {/* Header Section */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
//           VEX 123 Challenge
//         </h1>

//             {/* Desktop Table */}
//       <div className="mb-4 flex items-center justify-center gap-2">
//   <div className={`w-3 h-3 rounded-full ${connectionStatusColors[connectionStatus]}`}></div>
//   <span className="text-sm text-gray-600">
//     {connectionStatus === 'connected' && 'Live updates connected'}
//     {connectionStatus === 'connecting' && 'Connecting...'}
//     {connectionStatus === 'disconnected' && 'Connection lost'}
//     {connectionStatus === 'error' && 'Connection error'}
//   </span>
// </div>

// {matches.length === 0 ? (
//   <div className="text-center py-4 text-gray-500">
//     No active matches available
//   </div>
// ) : (
//   <table className="w-full">
//     <thead className="bg-gray-50">
//       <tr>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
//         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
//         <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//       </tr>
//     </thead>
//     <tbody className="bg-white divide-y divide-gray-200">
//       {matches.map((match) => (
//         <tr key={match.code} className="hover:bg-gray-50 transition-colors">
//           <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{match.code}</td>
//           <td className="px-6 py-4 whitespace-nowrap">{match.team1}</td>
//           <td className="px-6 py-4 whitespace-nowrap text-center font-bold bg-blue-50 text-blue-700 rounded-lg mx-2">
//   <div className="flex flex-col">
//     <span>score: {match.driverScore}</span>
//   </div>
// </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// )}

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {rankings.map((team, index) => (
//                 <tr
//                   key={team.team}
//                   className={`${
//                     index === 0 ? "bg-amber-50" : 
//                     index === 1 ? "bg-gray-50" : 
//                     index === 2 ? "bg-amber-100" : "hover:bg-gray-50"
//                   } transition-colors`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center gap-3">
//                       {getMedalIcon(index + 1)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{team.team}</td>
//                   <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.team_name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
//                     <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
//                       {team.total_score}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
//                     <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
//                       {team.total_time_taken}s
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveVex123;



import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { FaRobot, FaSyncAlt, FaListOl } from 'react-icons/fa';

import axios from "axios";
import { Helmet } from "react-helmet-async";
import { TiStopwatch } from "react-icons/ti";


const LiveVex123 = () => {
  const [rankings, setRankings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);


   

  const eventName = 'vex_123';
  const URL = `${process.env.REACT_APP_API_URL}/vex-123/${eventName}/rank/`;
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch rankings periodically
  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URL);
      setRankings(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    
  }, []);
  
const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="w-6 h-6 text-amber-400" />;
      case 2:
        return <FaMedal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <FaMedal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-600 font-medium">{rank}</span>;
    }
  };

  const handleRefresh = () => {
    if (!isLoading) {
      fetchRankings();
    }
  };

 

 


  // return (
  //   <div className="p-4 max-w-7xl mx-auto">
  //     <Helmet>
  //       <title>Live-Robotics</title>
  //     </Helmet>
      
  //     {/* Header Section */}
  //     <div className="text-center mb-8">
  //       <h1 className="text-3xl pb-2 md:text-4xl font-bold text-gray-800 mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
  //         VEX 123 Challenge
  //       </h1>


  //       <div className="overflow-x-auto">
  //         <table className="min-w-full divide-y divide-gray-200">
  //           <thead className="bg-gray-50">
  //             <tr>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team ID</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
  //               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
  //               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
  //             </tr>
  //           </thead>
  //           <tbody className="bg-white divide-y divide-gray-200">
  //             {rankings.map((team, index) => (
  //               <tr
  //                 key={team.team}
  //                 className={`${
  //                   index === 0 ? "bg-amber-50" : 
  //                   index === 1 ? "bg-gray-50" : 
  //                   index === 2 ? "bg-amber-100" : "hover:bg-gray-50"
  //                 } transition-colors`}
  //               >
  //                 <td className="px-6 py-4 whitespace-nowrap">
  //                   <div className="flex items-center gap-3">
  //                     {getMedalIcon(index + 1)}
  //                   </div>
  //                 </td>
  //                 <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{team.team}</td>
  //                 <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.team_name}</td>
  //                 <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
  //                   <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
  //                     {team.total_score}
  //                   </span>
  //                 </td>
  //                 <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
  //                   <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
  //                     {team.total_time_taken}s
  //                   </span>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // );
return (
    <div className="p-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Live VEX 123 Robotics Competition</title>
      </Helmet>

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaRobot className="w-12 h-12 text-blue-600" />
          <h1 className="text-3xl md:text-4xl  py-4 font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            VEX 123 Live Challenge
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <FaSyncAlt 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''} cursor-pointer`}
              onClick={handleRefresh}
            />
            <span>
              Last updated: {lastUpdate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <FaListOl className="text-blue-600" />
            <span className="text-sm text-blue-800">
              {rankings.length} Teams Competing
            </span>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">Team</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase">Score</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((team, index) => (
                <tr
                  key={team.team}
                  className={`${
                    index === 0 ? 'bg-amber-50/50 hover:bg-amber-50' :
                    index === 1 ? 'bg-gray-50/50 hover:bg-gray-50' :
                    index === 2 ? 'bg-amber-100/50 hover:bg-amber-100' : 
                    'hover:bg-gray-50'
                  } transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getMedalIcon(index + 1)}
                      {index < 3 && (
                        <span className={`text-xs font-semibold ${
                          index === 0 ? 'text-amber-600' :
                          index === 1 ? 'text-gray-600' :
                          'text-amber-700'
                        }`}>
                          {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : '2nd Runner-up'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">#{team.team}</span>
                      <span className="text-sm text-gray-500">{team.team_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 font-bold">
                      <FaTrophy className="w-4 h-4 mr-2" />
                      {team.total_score || 0} 
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100/80 text-green-800 font-medium">
                      <TiStopwatch className="text-2xl mr-2" />
                      {team.total_time_taken || 0}s 
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rankings.length === 0 && !isLoading && (
          <div className="text-center py-8 bg-gray-50">
            <p className="text-gray-500">No rankings available yet</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center">
          <FaSyncAlt className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default LiveVex123;
