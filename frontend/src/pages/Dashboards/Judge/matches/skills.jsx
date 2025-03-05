// import { useState, useEffect } from "react";
// import { FaChevronDown, FaCheck, FaTrophy } from "react-icons/fa";
// import { AiOutlineCalculator } from "react-icons/ai";
// import CalculatorSkills from "../Scores/ScoresSkills";

// const Skills = () => {
//   const [expandedRounds, setExpandedRounds] = useState({ 1: true, 2: false, 3: false });
//   const [scores, setScores] = useState({});
//   const [confirmed, setConfirmed] = useState({});
//   const [showCalculator, setShowCalculator] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [selectedRound, setSelectedRound] = useState(null);
//   const [scoreType, setScoreType] = useState(null);
//   const [showRanking, setShowRanking] = useState(false);

//   const teams = [
//     { id: 1, name: "FutureAlex", matchCode: "FA123" },
//     { id: 2, name: "Monsters", matchCode: "M456" },
//     { id: 3, name: "Osiris", matchCode: "O789" },
//   ];

//   useEffect(() => {
//     const savedScores = JSON.parse(localStorage.getItem("skillsScores")) || {};
//     const savedConfirmed = JSON.parse(localStorage.getItem("skillsConfirmed")) || {};
//     const savedExpanded = JSON.parse(localStorage.getItem("skillsExpandedRounds")) || { 1: true, 2: false, 3: false };
    
//     setScores(savedScores);
//     setConfirmed(savedConfirmed);
//     setExpandedRounds(savedExpanded);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("skillsScores", JSON.stringify(scores));
//     updateAndStoreRankings();
//   }, [scores]);

//   useEffect(() => {
//     localStorage.setItem("skillsConfirmed", JSON.stringify(confirmed));
//   }, [confirmed]);

//   useEffect(() => {
//     localStorage.setItem("skillsExpandedRounds", JSON.stringify(expandedRounds));
//   }, [expandedRounds]);

//   useEffect(() => {
//     const savedRankings = JSON.parse(localStorage.getItem("skillsRankingTable")) || [];
//     if (savedRankings.length > 0) {
//       setShowRanking(true); // Optionally show rankings if they exist
//     }
//   }, []);

//   const isRoundCompleted = (round) => {
//     return teams.every(
//       (team) => confirmed[round]?.[team.id] === true
//     );
//   };

//   const confirmScores = (round, teamId) => {
//     setConfirmed((prev) => ({
//       ...prev,
//       [round]: { ...prev[round], [teamId]: true },
//     }));

//     if (round < 3 && isRoundCompleted(round)) {
//       setExpandedRounds((prev) => ({ ...prev, [round + 1]: true }));
//     }
//   };

//   const openCalculator = (team, round, type) => {
//     if (confirmed[round]?.[team.id]) return;

//     setSelectedTeam(team);
//     setSelectedRound(round);
//     setScoreType(type);
//     setShowCalculator(true);

//     setScores((prev) => {
//       const newScores = { ...prev };
//       if (!newScores[round]) newScores[round] = {};
//       if (!newScores[round][team.id]) {
//         newScores[round][team.id] = { auto: 0, driver: 0 };
//       }
//       return newScores;
//     });
//   };

//   const handleScoreCalculated = (calculatedScore) => {
//     if (!selectedTeam || !selectedRound || !scoreType) return;

//     setScores((prev) => {
//       const newScores = { ...prev };
//       if (!newScores[selectedRound]) newScores[selectedRound] = {};
//       if (!newScores[selectedRound][selectedTeam.id]) {
//         newScores[selectedRound][selectedTeam.id] = { auto: 0, driver: 0 };
//       }

//       newScores[selectedRound][selectedTeam.id][scoreType] = calculatedScore ?? 0;
//       return newScores;
//     });

//     setShowCalculator(false);
//   };

//   const calculateRankings = () => {
//     let teamAverages = teams.map((team) => {
//       let autoSum = 0,
//         driverSum = 0,
//         count = 0;

//       Object.values(scores).forEach((round) => {
//         if (round[team.id]) {
//           autoSum += round[team.id].auto || 0;
//           driverSum += round[team.id].driver || 0;
//           count++;
//         }
//       });

//       return {
//         id: team.id,
//         name: team.name,
//         matchCode: team.matchCode,
//         autoAvg: count > 0 ? (autoSum / count).toFixed(2) : "0.00",
//         driverAvg: count > 0 ? (driverSum / count).toFixed(2) : "0.00",
//         total: count > 0 ? ((autoSum + driverSum) / count).toFixed(2) : "0.00",
//         autoSum,
//         driverSum,
//         matchesPlayed: count
//       };
//     });

//     return teamAverages.sort((a, b) => b.total - a.total);
//   };

//   const updateAndStoreRankings = () => {
//     const rankings = calculateRankings().map((team, index) => ({
//       ...team,
//       rank: index + 1,
//       style: index === 0 
//         ? "gold" 
//         : index === 1 
//         ? "silver" 
//         : index === 2 
//         ? "bronze" 
//         : "normal"
//     }));
    
//     localStorage.setItem("skillsRankingTable", JSON.stringify(rankings));
//     return rankings;
//   };

//   return (
//     <div className="mx-4 md:mx-10 p-4">
//       <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Skills Matches</h1>

//       {[1, 2, 3].map((round) => (
//         <div key={round} className="mb-6">
//           <div
//             className={`flex justify-between items-center px-6 py-3 rounded-lg ${
//               expandedRounds[round]
//                 ? "bg-green-200"
//                 : "bg-gray-200 opacity-50 cursor-not-allowed"
//             }`}
//           >
//             <h1 className="text-xl font-bold text-gray-700">{`Round ${round}`}</h1>
//             <FaChevronDown className="text-gray-600" />
//           </div>

//           {expandedRounds[round] && (
//             <div className="overflow-x-auto shadow-lg rounded-lg mt-3">
//               <table className="w-full table-auto border border-gray-200 text-center rounded-lg">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th>Team Name</th>
//                     <th>Match Code</th>
//                     <th>Driver Score</th>
//                     <th>Auto Score</th>
//                     <th>Confirm</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {teams.map((team) => (
//                     <tr key={team.id} className="border-b border-gray-200">
//                       <td>{team.name}</td>
//                       <td>{team.matchCode}</td>
//                       <td>
//                         {scores[round]?.[team.id]?.driver ?? 0}
//                         {!confirmed[round]?.[team.id] && (
//                           <button
//                             onClick={() => openCalculator(team, round, "driver")}
//                             className="bg-green-500 text-white px-2 py-1 ml-2 rounded-lg hover:bg-green-600"
//                           >
//                             <AiOutlineCalculator />
//                           </button>
//                         )}
//                       </td>
//                       <td>
//                         {scores[round]?.[team.id]?.auto ?? 0}
//                         {!confirmed[round]?.[team.id] && (
//                           <button
//                             onClick={() => openCalculator(team, round, "auto")}
//                             className="bg-blue-500 text-white px-2 py-1 ml-2 rounded-lg hover:bg-blue-600"
//                           >
//                             <AiOutlineCalculator />
//                           </button>
//                         )}
//                       </td>
//                       <td>
//                         <button
//                           onClick={() => confirmScores(round, team.id)}
//                           disabled={confirmed[round]?.[team.id]}
//                           className={`px-3 py-1 rounded-lg transition ${
//                             confirmed[round]?.[team.id] ? "bg-green-500 text-white" : "bg-gray-500 text-white hover:bg-gray-600"
//                           }`}
//                         >
//                           <FaCheck />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ))}

//       {showCalculator && selectedTeam && selectedRound && (
//         <CalculatorSkills onCalculate={handleScoreCalculated} onClose={() => setShowCalculator(false)} />
//       )}

//       <button
//         onClick={() => setShowRanking(!showRanking)}
//         className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto mb-4"
//       >
//         <FaTrophy /> View Ranking
//       </button>

//       {showRanking && (
//         <div className="overflow-x-auto shadow-xl rounded-lg mt-5 bg-white p-4 border border-gray-300">
//           <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-4">🏆 Skills Ranking</h2>
//           <table className="w-full border border-gray-300 text-center rounded-lg shadow-md">
//             <thead>
//               <tr className="bg-gray-800 text-white text-lg">
//                 <th className="py-3 px-4 rounded-tl-lg">Rank</th>
//                 <th className="py-3 px-4">Team Name</th>
//                 <th className="py-3 px-4">Avg Auto</th>
//                 <th className="py-3 px-4">Avg Driver</th>
//                 <th className="py-3 px-4 rounded-tr-lg">Total</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-900 text-lg">
//               {updateAndStoreRankings().map((team) => (
//                 <tr
//                   key={team.id}
//                   className={`border-b border-gray-300 text-lg ${
//                     team.style === "gold"
//                       ? "bg-yellow-300 text-black font-bold"
//                       : team.style === "silver"
//                       ? "bg-gray-300"
//                       : team.style === "bronze"
//                       ? "bg-yellow-100"
//                       : "bg-white"
//                   }`}
//                 >
//                   <td className="py-3 px-4">{team.rank}</td>
//                   <td className="py-3 px-4">{team.name}</td>
//                   <td className="py-3 px-4">{team.autoAvg}</td>
//                   <td className="py-3 px-4">{team.driverAvg}</td>
//                   <td className="py-3 px-4 font-bold">{team.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Skills;



import { useState, useEffect } from "react";
import { FaChevronDown, FaCheck, FaTrophy } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculatorSkills from "../Scores/ScoresSkills";
import axios from "axios";
import Swal from "sweetalert2";

const Skills = () => {
  const [expandedRounds, setExpandedRounds] = useState({ 1: true, 2: false, 3: false });
  const [scores, setScores] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [scoreType, setScoreType] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
const event_name = localStorage.getItem("selected_event_name");
  const token = localStorage.getItem("access_token");
  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/event/${event_name}/games-schedule/`,
      { stage: "skills", time: gameTime }, // Inline data ensures up-to-date values
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Schedule posted successfully:", response.data);
    
    setSchedule(response.data);
  } catch (err) {
    console.error("Error posting schedule:", err);
  }
};

  const isRoundCompleted = (round) => {
    return schedule.every(
      (team) => confirmed[round]?.[team.id] === true
    );
  };


  
  const confirmScores = async (round, teamId) => {
  const team = schedule.find(t => t.id === teamId);
  if (!team) return;

  setConfirmed(prev => ({
    ...prev,
    [round]: { ...prev[round], [teamId]: true },
  }));

  if (round < 3 && isRoundCompleted(round)) {
    setExpandedRounds(prev => ({
      ...prev,
      [round + 1]: true,
    }));
  }

  // تجهيز البيانات للإرسال
  const data = {
    event_name: event_name,
    score: {
      driver: scores[round]?.[teamId]?.driver ?? "0",
      autonomous: scores[round]?.[teamId]?.auto ?? "0",
    },
  };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/game/${teamId}/set-game-score/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log("Score submitted successfully:", response.data);
    Swal.fire({
                icon: "success",
                title: "Success",
                text: "Score submitted successfully!",
                showConfirmButton: true,
                confirmButtonColor: "#28a745" 
              });
  } catch (error) {
    console.error("Error submitting score:", error);
  }
};




    const openCalculator = (team, round, type) => {
    if (confirmed[round]?.[team.id]) return;

    setSelectedTeam(team);
    setSelectedRound(round);
    setScoreType(type);
    setShowCalculator(true);

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[round]) newScores[round] = {};
      if (!newScores[round][team.id]) {
        newScores[round][team.id] = { auto: 0, driver: 0 };
      }
      return newScores;
    });
  };

  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound || !scoreType) return;

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[selectedRound]) newScores[selectedRound] = {};
      if (!newScores[selectedRound][selectedTeam.id]) {
        newScores[selectedRound][selectedTeam.id] = { auto: 0, driver: 0 };
      }

      newScores[selectedRound][selectedTeam.id][scoreType] = calculatedScore ?? 0;
      return newScores;
    });

    setShowCalculator(false);
  };


  const calculateRankings = () => {
    return schedule
      .map((team) => {
        let autoSum = 0,
          driverSum = 0,
          count = 0;

        Object.values(scores).forEach((round) => {
          if (round[team.id]) {
            autoSum += round[team.id].auto || 0;
            driverSum += round[team.id].driver || 0;
            count++;
          }
        });

        return {
          id: team.id,
          name: team.team1,
          autoAvg: count > 0 ? (autoSum / count).toFixed(2) : "0.00",
          driverAvg: count > 0 ? (driverSum / count).toFixed(2) : "0.00",
          total: count > 0 ? ((autoSum + driverSum) / count).toFixed(2) : "0.00",
        };
      })
      .sort((a, b) => b.total - a.total)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  };

  return (
    <div className="mx-4 md:mx-10 p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Skills Matches</h1>
      <div className="flex justify-center mb-6">
        <form onSubmit={handleSubmit} className="flex gap-4 items-cente p-4 justify-center w-full max-w-2xl">
          <input
            type="time"
            value={gameTime}
            onChange={(e) => setGameTime(e.target.value)}
            className="px-4 py-2.5 rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 text-lg min-w-[150px]"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
          >
            View Schedule
          </button>
        </form>
      </div>

      {[1, 2, 3].map((round) => (
        <div key={round} className="mb-6">
          <div
            className={`flex justify-between items-center px-6 py-3 rounded-lg ${
              expandedRounds[round]
                ? "bg-green-200"
                : "bg-gray-200 opacity-50 cursor-not-allowed"
            }`}
          >
            <h1 className="text-xl font-bold text-gray-700">{`Round ${round}`}</h1>
            <FaChevronDown className="text-gray-600" />
          </div>

          {expandedRounds[round] && (
            <div className="overflow-x-auto shadow-lg rounded-lg mt-3">
              <table className="w-full table-auto border border-gray-200 text-center rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Team Name</th>
                    <th>Match Code</th>
                    <th>Driver Score</th>
                    <th>Auto Score</th>
                    <th>Confirm</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((team) => (
                    <tr key={team.id} className="border-b border-gray-200">
                      <td>{team.team1}</td>
                      <td>{team.id}</td>
                      <td>
                        {scores[round]?.[team.id]?.driver ?? 0}
                        {!confirmed[round]?.[team.id] && (
                          <button
                            onClick={() => openCalculator(team, round, "driver")}
                            className="bg-green-500 text-white px-2 py-1 ml-2 rounded-lg hover:bg-green-600"
                          >
                            <AiOutlineCalculator />
                          </button>
                        )}
                      </td>
                      <td>
                        {scores[round]?.[team.id]?.auto ?? 0}
                        {!confirmed[round]?.[team.id] && (
                          <button
                            onClick={() => openCalculator(team, round, "auto")}
                            className="bg-blue-500 text-white px-2 py-1 ml-2 rounded-lg hover:bg-blue-600"
                          >
                            <AiOutlineCalculator />
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => confirmScores(round, team.id)}
                          disabled={confirmed[round]?.[team.id]}
                          className={`px-3 py-1 rounded-lg transition ${
                            confirmed[round]?.[team.id] ? "bg-green-500 text-white" : "bg-gray-500 text-white hover:bg-gray-600"
                          }`}
                        >
                          <FaCheck />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {showCalculator && selectedTeam && selectedRound && (
        <CalculatorSkills onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          gameId={selectedTeam.id}  />
      )}
      <button onClick={() => setShowRanking(!showRanking)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto mb-4">
        <FaTrophy /> View Ranking
      </button>
      {showRanking && (
        <div className="overflow-x-auto shadow-xl rounded-lg mt-5 bg-white p-4 border border-gray-300">
          <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-4">🏆 Skills Ranking</h2>
          <table className="w-full border border-gray-300 text-center rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-800 text-white text-lg">
                <th className="py-3 px-4 rounded-tl-lg">Rank</th>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4">Avg Auto</th>
                <th className="py-3 px-4">Avg Driver</th>
                <th className="py-3 px-4 rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 text-lg">
              {calculateRankings().map((team) => (
                <tr key={team.id} className="border-b border-gray-300 text-lg">
                  <td className="py-3 px-4">{team.rank}</td>
                  <td className="py-3 px-4">{team.name}</td>
                  <td className="py-3 px-4">{team.autoAvg}</td>
                  <td className="py-3 px-4">{team.driverAvg}</td>
                  <td className="py-3 px-4 font-bold">{team.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Skills;
