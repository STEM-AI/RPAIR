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

  const event_name = localStorage.getItem("selected_event_name");
  const token = localStorage.getItem("access_token");

  const formData = {
    stage: "teamwork",
    time: "5:30",
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
    <div className="mx-4 md:mx-10 p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
        Teamwork Matches
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          View Schedule
        </button>
      </div>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 text-left">Match Code</th>
              <th className="py-4 px-6 text-left">Team 1</th>
              <th className="py-4 px-6 text-left">Team 2</th>
              <th className="py-4 px-6 text-center">Score</th>
              <th className="py-4 px-6 text-center">Calculator</th>
              <th className="py-4 px-6 text-center">Save</th>
            </tr>
          </thead>
      
          <tbody className="bg-white">
            {schedule.map((match) => (
              <tr key={match.id} className="border-b">
                <td className="py-4 px-6">{match.id}</td>
                <td className="py-4 px-6">{match.team1}</td>
                <td className="py-4 px-6">{match.team2}</td>
                <td className="py-4 px-6 text-center">
                   {tempScores[match.id] !== undefined
                    ? tempScores[match.id]
                    : scores[match.id] ?? 0}
                </td>
                <td className="py-4 px-6 border-b text-center">
                  <button
                    onClick={() => handleOpenCalculator(match.id)}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
                  >
                    Calculator
                  </button>
                </td>
                <td className="py-4 px-6 border-b text-center">
                  <button
                    onClick={() => handleSaveScore(match.id)}
                    className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition"
                  >
                    <FaCheck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {selectedMatch && (
        <ScoreTeams
          onCalculate={handleCalculate}
          onClose={() => setSelectedMatch(null)}
          mode="manual"
        />
      )}

      <div className="flex justify-center my-4">
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
        >
          <FaTrophy /> View Ranking
        </button>
      </div>

      {showRanking && (
        <div className="overflow-x-auto shadow-xl rounded-lg mt-5 bg-white p-4 border border-gray-300">
          <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-4">🏆 Ranking Table</h2>
          <table className="w-full border border-gray-300 text-center rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-800 text-white text-lg">
                <th className="py-3 px-4 rounded-tl-lg">Rank</th>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4">Total Score</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 text-lg">
              {rankings.map((team, index) => (
                <tr key={index} className="border-b border-gray-300 text-lg">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{team.name}</td>
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

export default Teamwork;
