// import React, { useState, useEffect } from "react";
// import { FaTrophy, FaMedal } from "react-icons/fa";

// const LiveSkills = () => {
//   const [rankings, setRankings] = useState([]);
//   const [scores, setScores] = useState({});
//   const [expandedRounds, setExpandedRounds] = useState({});
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Function to load data from localStorage
//   const loadData = () => {
//     const savedRankings = JSON.parse(localStorage.getItem("skillsRankingTable")) || [];
//     const savedScores = JSON.parse(localStorage.getItem("skillsScores")) || {};
//     const savedExpanded = JSON.parse(localStorage.getItem("skillsExpandedRounds")) || {};

//     setRankings(savedRankings);
//     setScores(savedScores);
//     setExpandedRounds(savedExpanded);
//     setLastUpdate(new Date());
//   };

//   // Load data initially and set up auto-refresh
//   useEffect(() => {
//     loadData();
//     const interval = setInterval(loadData, 5000); // Refresh every 5 seconds

//     return () => clearInterval(interval);
//   }, []);

//   // Get medal icon based on rank
//   const getMedalIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <FaMedal className="text-yellow-400 text-xl" />;
//       case 2:
//         return <FaMedal className="text-gray-400 text-xl" />;
//       case 3:
//         return <FaMedal className="text-yellow-700 text-xl" />;
//       default:
//         return null;
//     }
//   };

//   // Add this new function to get team scores for a specific round
//   const getTeamScoresForRound = (round, teamId) => {
//     const roundScores = scores[round]?.[teamId] || { auto: 0, driver: 0 };
//     return {
//       auto: roundScores.auto || 0,
//       driver: roundScores.driver || 0,
//       total: (roundScores.auto || 0) + (roundScores.driver || 0)
//     };
//   };

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       {/* Header with last update time */}
//       <div className="text-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Skills Matches</h1>
//         <p className="text-sm text-gray-600">
//           Last updated: {lastUpdate.toLocaleTimeString()}
//         </p>
//       </div>

//       {/* Rankings Table */}
//       <div className="mb-8">
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
//             <FaTrophy className="text-yellow-500" />
//             Current Rankings
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-800 text-white">
//                   <th className="py-3 px-4 text-left rounded-tl-lg">Rank</th>
//                   <th className="py-3 px-4 text-left">Team</th>
//                   <th className="py-3 px-4 text-center">Matches</th>
//                   <th className="py-3 px-4 text-center">Avg Auto</th>
//                   <th className="py-3 px-4 text-center">Avg Driver</th>
//                   <th className="py-3 px-4 text-center rounded-tr-lg">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rankings.map((team) => (
//                   <tr
//                     key={team.id}
//                     className={`border-b ${
//                       team.style === "gold"
//                         ? "bg-yellow-100"
//                         : team.style === "silver"
//                         ? "bg-gray-100"
//                         : team.style === "bronze"
//                         ? "bg-yellow-50"
//                         : "bg-white"
//                     } hover:bg-gray-50 transition-colors`}
//                   >
//                     <td className="py-3 px-4 flex items-center gap-2">
//                       {getMedalIcon(team.rank)}
//                       {team.rank}
//                     </td>
//                     <td className="py-3 px-4 font-medium">{team.name}</td>
//                     <td className="py-3 px-4 text-center">{team.matchesPlayed}</td>
//                     <td className="py-3 px-4 text-center">{team.autoAvg}</td>
//                     <td className="py-3 px-4 text-center">{team.driverAvg}</td>
//                     <td className="py-3 px-4 text-center font-bold">{team.total}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* All Rounds Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[1, 2, 3].map((round) => (
//           <div key={round} className="bg-white rounded-lg shadow-lg p-6">
//             <h3 className="text-xl font-bold mb-4 text-center">
//               Round {round}
//               {scores[round] && Object.keys(scores[round]).length > 0 && (
//                 <span className="ml-2 text-sm text-green-500">● Live</span>
//               )}
//             </h3>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="py-2 px-3 text-left text-sm">Team</th>
//                     <th className="py-2 px-3 text-center text-sm">Auto</th>
//                     <th className="py-2 px-3 text-center text-sm">Driver</th>
//                     <th className="py-2 px-3 text-center text-sm">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rankings.map((team) => {
//                     const roundScores = getTeamScoresForRound(round, team.id);
//                     return (
//                       <tr key={team.id} className="border-b hover:bg-gray-50">
//                         <td className="py-2 px-3 text-sm">{team.name}</td>
//                         <td className="py-2 px-3 text-center text-sm">
//                           {roundScores.auto > 0 ? (
//                             <span className="text-green-600 font-medium">{roundScores.auto}</span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="py-2 px-3 text-center text-sm">
//                           {roundScores.driver > 0 ? (
//                             <span className="text-blue-600 font-medium">{roundScores.driver}</span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="py-2 px-3 text-center text-sm font-bold">
//                           {roundScores.total > 0 ? roundScores.total : "-"}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LiveSkills;


import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

const LiveSkills = () => {
  const [rankings, setRankings] = useState([]);
  const [scores, setScores] = useState({});
  const [expandedRounds, setExpandedRounds] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const socketRef = useRef(null);
  const eventName = localStorage.getItem('selected_event_name');
 
 useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(`ws://${process.env.REACT_APP_API_HOST}/ws/competition_event/${eventName}/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Score Update:", data);

      if (data.game_id && data.score !== undefined) {
        // Update matches with new score
        setMatches(prevMatches => {
          const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
          if (matchIndex === -1) {
            // Add new match if it doesn't exist
            return [...prevMatches, {
              code: data.game_id,
              team1: data.team1_name || 'Team 1',
              team2: data.team2_name || 'Team 2',
              score: data.score
            }];
          }

          // Update existing match
          const updatedMatches = [...prevMatches];
          updatedMatches[matchIndex] = {
            ...updatedMatches[matchIndex],
            score: data.score
          };
          return updatedMatches;
        });

        // Update last update time
        setLastUpdate(new Date());
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup WebSocket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [eventName]);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaMedal className="text-yellow-400 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-yellow-700 text-xl" />;
      default:
        return null;
    }
  };
  // Add this new function to get team scores for a specific round
  const getTeamScoresForRound = (round, teamId) => {
    const roundScores = scores[round]?.[teamId] || { auto: 0, driver: 0 };
    return {
      auto: roundScores.auto || 0,
      driver: roundScores.driver || 0,
      total: (roundScores.auto || 0) + (roundScores.driver || 0)
    };
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header with last update time */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Skills Matches</h1>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>

     

      {/* All Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((round) => (
          <div key={round} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-center">
              Round {round}
              {scores[round] && Object.keys(scores[round]).length > 0 && (
                <span className="ml-2 text-sm text-green-500">● Live</span>
              )}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-left text-sm">Match Code</th>
                    <th className="py-2 px-3 text-left text-sm">Team</th>
                    <th className="py-2 px-3 text-center text-sm">Auto</th>
                    <th className="py-2 px-3 text-center text-sm">Driver</th>
                    <th className="py-2 px-3 text-center text-sm">Total</th>
                  </tr>
                </thead>
               <tbody>
                {matches.map((team) => {
                  return (
                    <tr key={team.code} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm">{team.code}</td>
                      <td className="py-2 px-3 text-sm">{team.team1}</td>
                      <td className="py-2 px-3 text-center text-sm">
                        {team.score.autonomous > 0 ? (
                          <span className="text-green-600 font-medium">{team.score.autonomous}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center text-sm">
                        {team.score.driver > 0 ? (
                          <span className="text-blue-600 font-medium">{team.score.driver}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center text-sm font-bold">
                        {team.score.autonomous + team.score.driver > 0
                          ? team.score.autonomous + team.score.driver
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

       {/* Rankings Table */}
      {/* <div className="mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Current Rankings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Rank</th>
                  <th className="py-3 px-4 text-left">Team</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-center">Avg Auto</th>
                  <th className="py-3 px-4 text-center">Avg Driver</th>
                  <th className="py-3 px-4 text-center rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((team) => (
                  <tr
                    key={team.id}
                    className={`border-b ${
                      team.style === "gold"
                        ? "bg-yellow-100"
                        : team.style === "silver"
                        ? "bg-gray-100"
                        : team.style === "bronze"
                        ? "bg-yellow-50"
                        : "bg-white"
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      {getMedalIcon(team.rank)}
                      {team.rank}
                    </td>
                    <td className="py-3 px-4 font-medium">{team.name}</td>
                    <td className="py-3 px-4 text-center">{team.matchesPlayed}</td>
                    <td className="py-3 px-4 text-center">{team.autoAvg}</td>
                    <td className="py-3 px-4 text-center">{team.driverAvg}</td>
                    <td className="py-3 px-4 text-center font-bold">{team.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default LiveSkills;