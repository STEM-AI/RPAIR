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
import axios from "axios";
import { Helmet } from "react-helmet-async";

const LiveVex123 = () => {
  const [rankings, setRankings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

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

  // Helper to get medal icon
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

  // Initialize matches from localStorage
  useEffect(() => {
    const storedMatches = localStorage.getItem('vex123_matches');
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  // Save matches to localStorage whenever matches change
  useEffect(() => {
    localStorage.setItem('vex123_matches', JSON.stringify(matches));
  }, [matches]);

  // Setup WebSocket connection
  useEffect(() => {
    const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/vex_123/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus('connected');
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        setMatches(prevMatches => {
          const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);

          const newMatch = {
            code: data.game_id,
            team1: data.team1_name || 'Team 1',
            driverScore: data.score?.driver || 0,
          };

          if (matchIndex === -1) {
            return [...prevMatches, newMatch];
          }

          const updatedMatches = [...prevMatches];
          updatedMatches[matchIndex] = {
            ...updatedMatches[matchIndex],
            ...newMatch
          };
          return updatedMatches;
        });

      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus('error');
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
      setConnectionStatus('disconnected');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventName]);

  // Periodic rankings refresh
  useEffect(() => {
    fetchRankings();
    intervalRef.current = setInterval(fetchRankings, 10000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const connectionStatusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500',
    disconnected: 'bg-red-500',
    error: 'bg-red-700'
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Live-Robotics</title>
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          VEX 123 Challenge
        </h1>

        {/* Connection Status */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${connectionStatusColors[connectionStatus]}`}></div>
          <span className="text-sm text-gray-600">
            {connectionStatus === 'connected' && 'Live updates connected'}
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'disconnected' && 'Connection lost'}
            {connectionStatus === 'error' && 'Connection error'}
          </span>
        </div>

        {/* Live Matches Table */}
        {matches.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No active matches available
          </div>
        ) : (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.map((match) => (
                  <tr key={match.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{match.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{match.team1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold bg-blue-50 text-blue-700 rounded-lg mx-2">
                      <div className="flex flex-col">
                        <span>Score: {match.driverScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rankings Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((team, index) => (
                <tr
                  key={team.team}
                  className={`${
                    index === 0 ? "bg-amber-50" : 
                    index === 1 ? "bg-gray-50" : 
                    index === 2 ? "bg-amber-100" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getMedalIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{team.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.team_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      {team.total_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {team.total_time_taken}s
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LiveVex123;
