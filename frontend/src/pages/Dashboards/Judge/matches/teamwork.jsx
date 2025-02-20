import { useState } from "react";
import ScoreTeams from "../Scores/scoreTeams"; // تأكدي من أن ملف الحاسبة موجود
import { FaTrophy } from "react-icons/fa";

const Teamwork = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scores, setScores] = useState({});
  const [showRanking, setShowRanking] = useState(false);

  const matches = [
    { code: "M001", team1: "Team A", team2: "Team B" },
    { code: "M002", team1: "Team C", team2: "Team D" },
  ];

  const handleOpenCalculator = (matchCode) => {
    setSelectedMatch(matchCode);
  };

  const handleCalculate = (score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [selectedMatch]: score,
    }));
    setSelectedMatch(null);
  };

  const calculateRankings = () => {
    const teamScores = {};

    matches.forEach(({ code, team1, team2 }) => {
      const matchScore = scores[code] ?? 0;
      teamScores[team1] = (teamScores[team1] || 0) + matchScore;
      teamScores[team2] = (teamScores[team2] || 0) + matchScore;
    });

    return Object.entries(teamScores)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  };

  return (
    <div className="mx-4 md:mx-10 p-4">
      {/* العنوان الرئيسي */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
      Teamwork Matches
      </h1>

      {/* جدول المباريات */}
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Match Code</th>
              <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Team 1</th>
              <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Team 2</th>
              <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Score</th>
              <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Calculator</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {matches.map((match) => (
              <tr key={match.code}>
                <td className="py-4 px-6 border-b border-gray-200">{match.code}</td>
                <td className="py-4 px-6 border-b border-gray-200">{match.team1}</td>
                <td className="py-4 px-6 border-b border-gray-200">{match.team2}</td>
                <td className="py-4 px-6 border-b border-gray-200 text-center font-bold text-blue-600">
                  {scores[match.code] ?? 0}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-center">
                  <button
                    onClick={() => handleOpenCalculator(match.code)}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
                  >
                    Calculator
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

      {/* زر عرض الترتيب */}
      <div className="flex justify-center my-4">
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
        >
          <FaTrophy /> View Ranking
        </button>
      </div>

      {/* جدول الترتيب */}
      {showRanking && (
        <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
          <table className="w-full table-auto border border-gray-200 text-center rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Rank</th>
                <th className="py-2 px-4">Team Name</th>
                <th className="py-2 px-4">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {calculateRankings().map((team, index) => (
                <tr key={team.name} className="border-t">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{team.name}</td>
                  <td className="py-2 px-4">{team.total}</td>
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

// import { useState } from "react";
// import ScoreTeams from "../Scores/scoreTeams"; // تأكدي من أن ملف الحاسبة موجود

// const Teamwork = () => {
//   const [selectedMatch, setSelectedMatch] = useState(null);
//   const [scores, setScores] = useState({});

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

//   return (
//     <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
//       <table className="w-full table-fixed">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Match Code</th>
//             <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Team 1</th>
//             <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Team 2</th>
//             <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Score</th>
//             <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Calculator</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white">
//           {matches.map((match) => (
//             <tr key={match.code}>
//               <td className="py-4 px-6 border-b border-gray-200">{match.code}</td>
//               <td className="py-4 px-6 border-b border-gray-200">{match.team1}</td>
//               <td className="py-4 px-6 border-b border-gray-200">{match.team2}</td>
//               <td className="py-4 px-6 border-b border-gray-200 text-center font-bold text-blue-600">
//                 {scores[match.code] ?? 0 }
//               </td>
//               <td className="py-4 px-6 border-b border-gray-200 text-center">
//                 <button
//                   onClick={() => handleOpenCalculator(match.code)}
//                   className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
//                 >
//                  Calculator
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selectedMatch && (
//         <ScoreTeams
//           onCalculate={handleCalculate}
//           onClose={() => setSelectedMatch(null)}
//           mode="manual"
//         />
//       )}
//     </div>
//   );
// };

// export default Teamwork;