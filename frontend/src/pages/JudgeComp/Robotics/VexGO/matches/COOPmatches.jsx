

// import { useState } from "react";
// import { jsPDF } from "jspdf";

// const tasks = [
//   { title: "Move purple sensor to the fish habitat", points: 1 },
//   { title: "Move blue sensor to the pipeline", points: 1 },
//   { title: "Move the orange sensor to the volcano tile", points: 1 },
//   { title: "Orange sensor placed on top of the volcano", points: 2 },
//   { title: "Align the turbines", points: "1 per turbine", isDynamic: true },
//   { title: "Open the clam", points: 1 },
//   { title: "Remove the pearl from the clam", points: 1 },
//   { title: "Deliver the pearl to the green starting tile", points: 1 },
//   { title: "End with the robot on the green tile", points: 1 },
// ];

// export default function VexGoScoreboard() {
//   const [scores, setScores] = useState({});
//   const [turbines, setTurbines] = useState(0);
//   const [teamData, setTeamData] = useState({
//     teamName: "",
//     teamNumber: "",
//     driver: "",
//   });

//   const handleCheckboxChange = (index, value) => {
//     setScores((prev) => ({ ...prev, [index]: value ? tasks[index].points : 0 }));
//   };

//   const handleTurbineChange = (e) => {
//     const value = parseInt(e.target.value, 10) || 0;
//     setTurbines(value);
//     setScores((prev) => ({ ...prev, 4: value }));
//   };

//   const handleInputChange = (e) => {
//     setTeamData({ ...teamData, [e.target.name]: e.target.value });
//   };

//   const totalScore = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text("Ocean Science Exploration Competition", 20, 20);
//     doc.setFontSize(14);
//     doc.text(`Team Name: ${teamData.teamName}`, 20, 30);
//     doc.text(`Team Number: ${teamData.teamNumber}`, 20, 40);
//     doc.text(`Driver: ${teamData.driver}`, 20, 50);
//     doc.text(`Total Score: ${totalScore}`, 20, 60);

//     doc.setFontSize(12);
//     let y = 70;
//     tasks.forEach((task, index) => {
//       doc.text(
//         `${task.title}: ${scores[index] ? scores[index] : 0} points`,
//         20,
//         y
//       );
//       y += 10;
//     });

//     doc.save(`Team_${teamData.teamNumber}_Score.pdf`);
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//         Ocean Science Exploration Competition
//       </h2>

//       {/* Team Info Inputs */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           name="teamName"
//           placeholder="Team Name"
//           value={teamData.teamName}
//           onChange={handleInputChange}
//           className="p-3 border rounded-lg w-full"
//         />
//         <input
//           type="text"
//           name="teamNumber"
//           placeholder="Team Number"
//           value={teamData.teamNumber}
//           onChange={handleInputChange}
//           className="p-3 border rounded-lg w-full"
//         />
//         <input
//           type="text"
//           name="driver"
//           placeholder="Driver"
//           value={teamData.driver}
//           onChange={handleInputChange}
//           className="p-3 border rounded-lg w-full"
//         />
//       </div>

//       {/* Score Table */}
//       <table className="w-full border-collapse border border-gray-300 mb-6">
//         <thead>
//           <tr className="bg-blue-500 text-white">
//             <th className="border border-gray-300 px-4 py-2">Task</th>
//             <th className="border border-gray-300 px-4 py-2">Points</th>
//             <th className="border border-gray-300 px-4 py-2">Completed?</th>
//             <th className="border border-gray-300 px-4 py-2">Total Points</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((task, index) => (
//             <tr key={index} className="bg-gray-100 border border-gray-300">
//               <td className="px-4 py-2 border">{task.title}</td>
//               <td className="px-4 py-2 border">{task.points}</td>
//               <td className="px-4 py-2 border text-center">
//                 {task.isDynamic ? (
//                   <input
//                     type="number"
//                     min="0"
//                     value={turbines}
//                     onChange={handleTurbineChange}
//                     className="w-16 px-2 py-1 border rounded text-center"
//                   />
//                 ) : (
//                   <input
//                     type="checkbox"
//                     onChange={(e) => handleCheckboxChange(index, e.target.checked)}
//                     className="w-5 h-5"
//                   />
//                 )}
//               </td>
//               <td className="px-4 py-2 border text-center">
//                 {scores[index] || 0}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Total Score */}
//       <div className="text-center mb-6">
//         <h3 className="text-xl font-semibold">
//           Total Score: <span className="text-blue-600">{totalScore}</span>
//         </h3>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-center gap-4">
//         <button
//           onClick={() => alert("Score Submitted Successfully!")}
//           className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700 transition"
//         >
//           Submit (Done)
//         </button>
//         <button
//           onClick={handleDownloadPDF}
//           className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition"
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { jsPDF } from "jspdf";

// const initialTeams = [];

// export default function VexGoLeaderboard() {
//   const [teams, setTeams] = useState(initialTeams);
//   const [selectedTeam, setSelectedTeam] = useState(null);

//   const addTeam = () => {
//     const newTeam = {
//       name: "",
//       number: "",
//       driver: "",
//       score: 0,
//       tasks: Array(9).fill(false),
//       turbines: 0,
//     };
//     setTeams([...teams, newTeam]);
//   };

//   const updateTeam = (index, field, value) => {
//     const updatedTeams = [...teams];
//     updatedTeams[index][field] = value;
//     setTeams(updatedTeams);
//   };

//   const calculateScore = (team) => {
//     const taskPoints = [1, 1, 1, 2, 1, 1, 1, 1, 1];
//     return team.tasks.reduce((sum, completed, i) => sum + (completed ? taskPoints[i] : 0), 0) + team.turbines;
//   };

//   const handleSubmit = () => {
//     const updatedTeams = [...teams];
//     const index = teams.indexOf(selectedTeam);
//     updatedTeams[index].score = calculateScore(selectedTeam);
//     setTeams(updatedTeams);
//     setSelectedTeam(null);
//   };

//   const downloadPDF = (team) => {
//     const doc = new jsPDF();
//     doc.text(`Team Name: ${team.name}`, 20, 20);
//     doc.text(`Team Number: ${team.number}`, 20, 30);
//     doc.text(`Driver: ${team.driver}`, 20, 40);
//     doc.text(`Total Score: ${team.score}`, 20, 50);
//     doc.save(`Team_${team.number}_Score.pdf`);
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">VEX GO Leaderboard</h2>
      
//       <button onClick={addTeam} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Add Team</button>
      
//       <table className="w-full border-collapse border border-gray-300 mb-6">
//         <thead>
//           <tr className="bg-blue-500 text-white">
//             <th className="border border-gray-300 px-4 py-2">Team Name</th>
//             <th className="border border-gray-300 px-4 py-2">Team Number</th>
//             <th className="border border-gray-300 px-4 py-2">Driver</th>
//             <th className="border border-gray-300 px-4 py-2">Score</th>
//             <th className="border border-gray-300 px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {teams.map((team, index) => (
//             <tr key={index} className="bg-gray-100 border border-gray-300">
//               <td className="px-4 py-2 border">{team.name}</td>
//               <td className="px-4 py-2 border">{team.number}</td>
//               <td className="px-4 py-2 border">{team.driver}</td>
//               <td className="px-4 py-2 border text-center">{team.score}</td>
//               <td className="px-4 py-2 border flex gap-2">
//                 <button onClick={() => setSelectedTeam(team)} className="px-3 py-1 bg-green-500 text-white rounded-lg">Edit</button>
//                 <button onClick={() => downloadPDF(team)} className="px-3 py-1 bg-red-500 text-white rounded-lg">Download PDF</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
      
//       <button
//         onClick={() => setTeams([...teams].sort((a, b) => b.score - a.score))}
//         className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700 transition"
//       >
//         Show Ranking
//       </button>
      
//       {selectedTeam && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-96">
//             <h3 className="text-xl font-bold mb-4">Edit Team: {selectedTeam.name}</h3>
//             <label className="block mb-2">Team Name</label>
//             <input type="text" value={selectedTeam.name} onChange={(e) => setSelectedTeam({...selectedTeam, name: e.target.value})} className="w-full px-2 py-1 border rounded mb-2" />
//             <label className="block mb-2">Team Number</label>
//             <input type="text" value={selectedTeam.number} onChange={(e) => setSelectedTeam({...selectedTeam, number: e.target.value})} className="w-full px-2 py-1 border rounded mb-2" />
//             <label className="block mb-2">Driver</label>
//             <input type="text" value={selectedTeam.driver} onChange={(e) => setSelectedTeam({...selectedTeam, driver: e.target.value})} className="w-full px-2 py-1 border rounded mb-2" />
//             <label className="block mb-2">Tasks Completed</label>
//             {selectedTeam.tasks.map((completed, i) => (
//               <div key={i} className="flex items-center gap-2 mb-2">
//                 <input type="checkbox" checked={completed} onChange={() => {
//                   const updatedTasks = [...selectedTeam.tasks];
//                   updatedTasks[i] = !completed;
//                   setSelectedTeam({...selectedTeam, tasks: updatedTasks});
//                 }} />
//                 <span>Task {i + 1}</span>
//               </div>
//             ))}
//             <label className="block mb-2">Turbines Aligned</label>
//             <input type="number" value={selectedTeam.turbines} onChange={(e) => setSelectedTeam({...selectedTeam, turbines: parseInt(e.target.value)})} className="w-full px-2 py-1 border rounded mb-4" />
//             <div className="flex justify-between">
//               <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-lg">Submit</button>
//               <button onClick={() => setSelectedTeam(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { jsPDF } from "jspdf";
import { FaTrophy } from "react-icons/fa";

const initialTeams = [];

export default function VexGoLeaderboard() {
  const [teams, setTeams] = useState(initialTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const addTeam = () => {
    const newTeam = {
      name: "",
      number: "",
      driver: "",
      score: 0,
      tasks: Array(9).fill(false),
      turbines: 0,
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (index, field, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
  };

  const calculateScore = (team) => {
    const taskPoints = [1, 1, 1, 2, 1, 1, 1, 1, 1];
    return team.tasks.reduce((sum, completed, i) => sum + (completed ? taskPoints[i] : 0), 0) + team.turbines;
  };

  const handleSubmit = () => {
    const updatedTeams = [...teams];
    const index = teams.indexOf(selectedTeam);
    updatedTeams[index].score = calculateScore(selectedTeam);
    setTeams(updatedTeams);
    setSelectedTeam(null);
  };

  const downloadPDF = (team) => {
    const doc = new jsPDF();
    doc.text(`Team Name: ${team.name}`, 20, 20);
    doc.text(`Team Number: ${team.number}`, 20, 30);
    doc.text(`Driver: ${team.driver}`, 20, 40);
    doc.text(`Total Score: ${team.score}`, 20, 50);
    doc.save(`Team_${team.number}_Score.pdf`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">VEX GO Leaderboard</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Teams</h3>
          <button onClick={addTeam} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Team</button>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Team Name</th>
              <th className="border px-4 py-2">Number</th>
              <th className="border px-4 py-2">Driver</th>
              <th className="border px-4 py-2">Score</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{team.name}</td>
                <td className="border px-4 py-2">{team.number}</td>
                <td className="border px-4 py-2">{team.driver}</td>
                <td className="border px-4 py-2 font-bold text-blue-600">{team.score}</td>
                <td className="border px-4 py-2 flex justify-center gap-2">
                  <button onClick={() => setSelectedTeam(team)} className="px-3 py-1 bg-green-500 text-white rounded-lg">Start</button>
                  <button onClick={() => downloadPDF(team)} className="px-3 py-1 bg-red-500 text-white rounded-lg">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setTeams([...teams].sort((a, b) => b.score - a.score))}
          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 gap-2"
        >
          <FaTrophy className="text-lg" /> Show Ranking
        </button>
      </div>
    </div>
  );
}
