// import { useState } from "react";
// import ScoreTeams from "../Scores/scoreTeams"; // تأكدي من أن ملف الحاسبة موجود
// import { FaTrophy } from "react-icons/fa";

// const Teamwork = () => {
//   const [selectedMatch, setSelectedMatch] = useState(null);
//   const [scores, setScores] = useState({});
//   const [showRanking, setShowRanking] = useState(false);

//   const matches = [
//     { code: "M001", team1: "Team A", team2: "Team B" },
//     { code: "M002", team1: "Team C", team2: "Team D" },
//   ];

//   const handleOpenCalculator = (matchCode) => {
//     setSelectedMatch(matchCode);
//   };

//   const handleCalculate = (score) => {
//     setScores((prevScores) => ({
//       ...prevScores,
//       [selectedMatch]: score,
//     }));
//     setSelectedMatch(null);
//   };

//   const calculateRankings = () => {
//     const teamScores = {};

//     matches.forEach(({ code, team1, team2 }) => {
//       const matchScore = scores[code] ?? 0;
//       teamScores[team1] = (teamScores[team1] || 0) + matchScore;
//       teamScores[team2] = (teamScores[team2] || 0) + matchScore;
//     });

//     return Object.entries(teamScores)
//       .map(([name, total]) => ({ name, total }))
//       .sort((a, b) => b.total - a.total);
//   };

//   return (
//     <div className="mx-4 md:mx-10 p-4">
//       {/* العنوان الرئيسي */}
//       <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
//       Teamwork Matches
//       </h1>

//       {/* جدول المباريات */}
//       <div className="shadow-lg rounded-lg overflow-hidden">
//         <table className="w-full table-fixed">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Match Code</th>
//               <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Team 1</th>
//               <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Team 2</th>
//               <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Score</th>
//               <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Calculator</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {matches.map((match) => (
//               <tr key={match.code}>
//                 <td className="py-4 px-6 border-b border-gray-200">{match.code}</td>
//                 <td className="py-4 px-6 border-b border-gray-200">{match.team1}</td>
//                 <td className="py-4 px-6 border-b border-gray-200">{match.team2}</td>
//                 <td className="py-4 px-6 border-b border-gray-200 text-center font-bold text-blue-600">
//                   {scores[match.code] ?? 0}
//                 </td>
//                 <td className="py-4 px-6 border-b border-gray-200 text-center">
//                   <button
//                     onClick={() => handleOpenCalculator(match.code)}
//                     className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
//                   >
//                     Calculator
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedMatch && (
//         <ScoreTeams
//           onCalculate={handleCalculate}
//           onClose={() => setSelectedMatch(null)}
//           mode="manual"
//         />
//       )}

//       {/* زر عرض الترتيب */}
//       <div className="flex justify-center my-4">
//         <button
//           onClick={() => setShowRanking(!showRanking)}
//           className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
//         >
//           <FaTrophy /> View Ranking
//         </button>
//       </div>

//       {/* جدول الترتيب */}
//       {showRanking && (
//         <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
//           <table className="w-full table-auto border border-gray-200 text-center rounded-lg">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4">Rank</th>
//                 <th className="py-2 px-4">Team Name</th>
//                 <th className="py-2 px-4">Total Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {calculateRankings().map((team, index) => (
//                 <tr key={team.name} className="border-t">
//                   <td className="py-2 px-4">{index + 1}</td>
//                   <td className="py-2 px-4">{team.name}</td>
//                   <td className="py-2 px-4">{team.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Teamwork;

// import { useState, useEffect } from "react";
// import ScoreTeams from "../Scores/scoreTeams";
// import { FaTrophy, FaCheck } from "react-icons/fa";

// const Teamwork = () => {
//   const [selectedMatch, setSelectedMatch] = useState(null);
//   const [scores, setScores] = useState(() => {
//     const storedScores = localStorage.getItem("matchScores");
//     return storedScores ? JSON.parse(storedScores) : {};
//   });
//   const [tempScores, setTempScores] = useState({});
//   const [showRanking, setShowRanking] = useState(false);

//   const matches = [
//     { code: "M001", team1: "FutureAlex", team2: "Osiris" },
//     { code: "M002", team1: "FutureAlex", team2: "Monsters" },
//     { code: "M003", team1: "Osiris", team2: "Monsters" },
//   ];

//   useEffect(() => {
//     localStorage.setItem("matchScores", JSON.stringify(scores));
//   }, [scores]);

//   const handleOpenCalculator = (matchCode) => {
//     setSelectedMatch(matchCode);
//   };

//   const handleCalculate = (score) => {
//     setTempScores((prev) => ({
//       ...prev,
//       [selectedMatch]: score, // حفظ النتيجة مؤقتًا فقط
//     }));
//     setSelectedMatch(null);
//   };

//   const handleSaveScore = (matchCode) => {
//     if (tempScores[matchCode] !== undefined) {
//       setScores((prevScores) => ({
//         ...prevScores,
//         [matchCode]: tempScores[matchCode], // حفظ النتيجة في localStorage
//       }));
//     }
//   };

//   const calculateRankings = () => {
//     const teamScores = { FutureAlex: 0, Osiris: 0, Monsters: 0 };

//     matches.forEach(({ code, team1, team2 }) => {
//       const matchScore = scores[code] ?? 0;
//       teamScores[team1] += matchScore;
//       teamScores[team2] += matchScore;
//     });

//     return Object.entries(teamScores)
//       .map(([name, total]) => ({ name, total }))
//       .sort((a, b) => b.total - a.total);
//   };

//   return (
//     <div className="mx-4 md:mx-10 p-4">
//       <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
//         Teamwork Matches
//       </h1>

//       <div className="shadow-lg rounded-lg overflow-hidden">
//         <table className="w-full table-fixed">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-4 px-6 text-left">Match Code</th>
//               <th className="py-4 px-6 text-left">Team 1</th>
//               <th className="py-4 px-6 text-left">Team 2</th>
//               <th className="py-4 px-6 text-center">Score</th>
//               <th className="py-4 px-6 text-center">Calculator</th>
//               <th className="py-4 px-6 text-center">Save</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {matches.map((match) => (
//               <tr key={match.code}>
//                 <td className="py-4 px-6 border-b">{match.code}</td>
//                 <td className="py-4 px-6 border-b">{match.team1}</td>
//                 <td className="py-4 px-6 border-b">{match.team2}</td>
//                 <td className="py-4 px-6 border-b text-center font-bold text-blue-600">
//                   {tempScores[match.code] !== undefined
//                     ? tempScores[match.code]
//                     : scores[match.code] ?? 0}
//                 </td>
//                 <td className="py-4 px-6 border-b text-center">
//                   <button
//                     onClick={() => handleOpenCalculator(match.code)}
//                     className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
//                   >
//                     Calculator
//                   </button>
//                 </td>
//                 <td className="py-4 px-6 border-b text-center">
//                   <button
//                     onClick={() => handleSaveScore(match.code)}
//                     className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition"
//                   >
//                     <FaCheck />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedMatch && (
//         <ScoreTeams
//           onCalculate={handleCalculate}
//           onClose={() => setSelectedMatch(null)}
//           mode="manual"
//         />
//       )}

//       <div className="flex justify-center my-4">
//         <button
//           onClick={() => setShowRanking(!showRanking)}
//           className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
//         >
//           <FaTrophy /> View Ranking
//         </button>
//       </div>

//       {showRanking && (

//         <div className="overflow-x-auto shadow-xl rounded-lg mt-5 bg-white p-4 border border-gray-300">
//   <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-4">🏆 Ranking Table</h2>
//   <table className="w-full border border-gray-300 text-center rounded-lg shadow-md">
//     <thead>
//       <tr className="bg-gray-800 text-white text-lg">
//         <th className="py-3 px-4 rounded-tl-lg">Rank</th>
//         <th className="py-3 px-4">Team Name</th>
//         <th className="py-3 px-4">Total Score</th>
//       </tr>
//     </thead>
//     <tbody className="text-gray-900 text-lg">
//       {calculateRankings().map((team, index) => (
//         <tr
//           key={index}
//           className={`border-b border-gray-300 text-lg ${
//             index === 0
//               ? "bg-yellow-300 text-black font-bold"
//               : index === 1
//               ? "bg-gray-300"
//               : index === 2
//               ? "bg-yellow-100"
//               : "bg-white"
//           }`}
//         >
//           <td className="py-3 px-4">{index + 1}</td>
//           <td className="py-3 px-4">{team.name}</td>
//           <td className="py-3 px-4 font-bold">{team.total}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

//       )}
//     </div>
//   );
// };

// export default Teamwork;

import { useState, useEffect } from "react";
import ScoreTeams from "../Scores/scoreTeams";
import { FaTrophy, FaCheck } from "react-icons/fa";
import axios from "axios";

const Teamwork = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scores, setScores] = useState({});
  const [rankings, setRankings] = useState([]);
  const [tempScores, setTempScores] = useState({});
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");

  const event_name = localStorage.getItem("selected_event_name");
  const token = localStorage.getItem("access_token");

  const formData = {
    stage: "teamwork",
    time: gameTime,
  };

 

  // Handle posting game schedule and then fetch updated schedule
  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/event/${event_name}/games-schedule/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("Schedule posted successfully");
    console.log("Response Data:", response.data); 

    // 🟢 تحديث حالة الجدول بالبيانات المسترجعة من API
    setSchedule(response.data); 

  } catch (err) {
    console.error("Error posting schedule:", err);
  }
};


  useEffect(() => {
    updateRankings();
  }, [scores]);

  useEffect(() => {
  if (schedule.length > 0) {
    updateRankings();
  }
}, [schedule]);

  const handleOpenCalculator = (matchCode) => {
    console.log("matchCode" , matchCode);
    
    setSelectedMatch(matchCode);
  };

  const handleCalculate = (score) => {
    setTempScores((prev) => ({
      ...prev,
      [selectedMatch]: score,
    }));
    setSelectedMatch(null);
  };

  const handleSaveScore = (matchCode) => {
    if (tempScores[matchCode] !== undefined) {
      setScores((prevScores) => ({
        ...prevScores,
        [matchCode]: tempScores[matchCode],
      }));
    }
  };

  const updateRankings = () => {
  if (!schedule || schedule.length === 0) return; // تأكد أن هناك بيانات

  const teamScores = {};

  schedule.forEach(({ id, team1, team2 }) => {
    const matchScore = scores[id] ?? 0;
    teamScores[team1] = (teamScores[team1] || 0) + matchScore;
    teamScores[team2] = (teamScores[team2] || 0) + matchScore;
  });

  const sortedRankings = Object.entries(teamScores)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  setRankings(sortedRankings);
  console.log("Updated Rankings:", sortedRankings);
};

  
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Teamwork Matches
      </h1>
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

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-3 sm:px-6 text-xs sm:text-sm text-left text-gray-500 uppercase tracking-wider">Match</th>
                <th className="px-3 py-3 sm:px-6 text-xs sm:text-sm text-left text-gray-500 uppercase tracking-wider">Team 1</th>
                <th className="px-3 py-3 sm:px-6 text-xs sm:text-sm text-left text-gray-500 uppercase tracking-wider">Team 2</th>
                <th className="px-3 py-3 sm:px-6 text-xs sm:text-sm text-center text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-3 py-3 sm:px-6 text-xs sm:text-sm text-center text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{match.id}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{match.team1}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{match.team2}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-blue-600">
                        {tempScores[match.id] !== undefined ? tempScores[match.id] : scores[match.id] ?? 0}
                      </span>
                      {tempScores[match.id] !== undefined && (
                        <button
                          onClick={() => handleSaveScore(match.id)}
                          className="inline-flex items-center p-1 text-xs text-green-600 hover:text-green-800"
                          title="Save Score"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleOpenCalculator(match.id)}
                      className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Calculator
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMatch && (
        <ScoreTeams
          onCalculate={handleCalculate}
          onClose={() => setSelectedMatch(null)}
          gameId={selectedMatch}
          mode="manual"
        />
      )}

      <div className="flex justify-center mt-6 mb-4">
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="inline-flex items-center px-4 py-2 text-sm sm:text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors gap-2"
        >
          <FaTrophy className="text-lg" /> 
          <span>View Ranking</span>
        </button>
      </div>

      {showRanking && (
        <div className="overflow-x-auto shadow-xl rounded-lg mt-5 bg-white p-4 border border-gray-300">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-center text-gray-800 mb-4">
            🏆 Ranking Table
          </h2>
          <div className="min-w-full">
            <table className="min-w-full border border-gray-300 text-center rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.map((team, index) => (
                  <tr key={team.name} className="hover:bg-gray-50">
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900">{index + 1}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900">{team.name}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-blue-600">{team.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teamwork;
