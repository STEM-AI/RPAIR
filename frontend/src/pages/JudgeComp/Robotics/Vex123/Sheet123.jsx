
// import { useState, useEffect } from "react";
// import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// const missions = [
//   { step: "First Step", description: "From Point 1 to Point 2", points: 5 },
//   { step: "Second Step", description: "From Point 2 to Point 3", points: 5 },
//   { step: "Third Step", description: "From Point 3 to Point 4", points: 5 },
//   { step: "Fourth Step", description: "From Point 4 to Point 5", points: 10 },
//   { step: "Fifth Step", description: "From Point 5 to Point 6", points: 5 },
//   { step: "Sixth Step", description: "From Point 6 to the End Line", points: 10 },
// ];

// const gameModes = ["Manual", "Coder Card", "Programming"];

// export default function CompetitionSheet() {
//   const [teamName, setTeamName] = useState("");
//   const [timer, setTimer] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
//   const [scores, setScores] = useState({});
//   const [times, setTimes] = useState({});
//   const [notes, setNotes] = useState({});
//   const [done, setDone] = useState({});
//   const [gameMode, setGameMode] = useState("");

//   useEffect(() => {
//     let interval;
//     if (isRunning) {
//       interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text("Competition Score Sheet", 20, 20);
//     doc.setFontSize(14);
//     doc.text(`Team: ${teamName}`, 20, 30);
//     doc.text(`Game Mode: ${gameMode}`, 20, 40);

//     const tableData = missions.map((mission, index) => [
//       mission.step,
//       mission.description,
//       mission.points,
//       times[index] || "N/A",
//       notes[index] || "N/A",
//       done[index] ? "✔️" : "❌",
//     ]);

//     doc.autoTable({
//       startY: 50,
//       head: [["Step", "Description", "Points", "Time (s)", "Notes", "Completed"]],
//       body: tableData,
//       theme: "striped",
//       styles: { fontSize: 12, cellPadding: 4 },
//       headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//     });

//     doc.text(
//       `Total Score: ${Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0)}`,
//       20,
//       doc.autoTable.previous.finalY + 10
//     );
//     doc.save(`Team_${teamName}_Score.pdf`);
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
//       <h2 className="text-4xl font-bold text-center mb-6 text-indigo-700">🏆 VEX123 Competition Score Sheet</h2>

//       {/* Game Mode Selection */}
//       <div className="mb-6 flex justify-center gap-4">
//         {gameModes.map((mode) => (
//           <button
//             key={mode}
//             onClick={() => setGameMode(mode)}
//             className={`px-6 py-3 font-bold rounded-lg transition ${gameMode === mode ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
//           >
//             {mode}
//           </button>
//         ))}
//       </div>

//       {/* Team Info */}
//       <div className="mb-4">
//         <label className="block text-lg font-semibold mb-2">👥 Team Name:</label>
//         <input
//           type="text"
//           placeholder="Enter Team Name"
//           value={teamName}
//           onChange={(e) => setTeamName(e.target.value)}
//           className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
//         />
//       </div>

//       {/* Timer Controls */}
//       <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
//         <span className="text-xl font-semibold text-gray-700 flex items-center">
//           <FaClock className="mr-2 text-indigo-600" /> Time: {timer}
//         </span>
//         <div className="flex gap-2">
//           <button onClick={() => setIsRunning(!isRunning)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center">
//             {isRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
//             {isRunning ? "Pause" : "Start"}
//           </button>
//           <button onClick={() => { setIsRunning(false); setTimer(0); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center">
//             <FaRedo className="mr-2" /> Reset
//           </button>
//         </div>
//       </div>

//       {/* Missions Table */}
//       <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md overflow-hidden">
//         <thead>
//           <tr className="bg-indigo-600 text-white">
//             <th className="border px-4 py-2">Step</th>
//             <th className="border px-4 py-2">Description</th>
//             <th className="border px-4 py-2">Points</th>
//             <th className="border px-4 py-2">Time (s)</th>
//             <th className="border px-4 py-2">Notes</th>
//             <th className="border px-4 py-2">✅ Done?</th>
//           </tr>
//         </thead>
//         <tbody>
//           {missions.map((mission, index) => (
//             <tr key={index} className="bg-white border">
//               <td className="px-4 py-3 border">{mission.step}</td>
//               <td className="px-4 py-3 border">{mission.description}</td>
//               <td className="px-4 py-3 border text-center">{mission.points}</td>
//               <td className="px-4 py-3 border">
//                 <input
//                   type="number"
//                   min="0"
//                   value={times[index] || ""}
//                   onChange={(e) => setTimes({ ...times, [index]: e.target.value })}
//                   className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400"
//                 />
//               </td>
//               <td className="px-4 py-3 border">
//                 <input
//                   type="text"
//                   placeholder="Add notes..."
//                   value={notes[index] || ""}
//                   onChange={(e) => setNotes({ ...notes, [index]: e.target.value })}
//                   className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-400"
//                 />
//               </td>
//               <td className="px-4 py-3 border text-center">
//                 <input type="checkbox" onChange={() => setDone({ ...done, [index]: !done[index] })} checked={done[index] || false} className="w-5 h-5 accent-green-500" />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//             <div className="flex flex-col gap-4 mt-6">
//             <button onClick={handleDownloadPDF} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center">
//               <FaDownload className="mr-2" /> Download PDF
//             </button>
//             <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center">
//               <FaCheckCircle className="mr-2" /> Submit
//             </button>
//           </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const missions = [
  { step: "First Step", description: "From Point 1 to Point 2", points: 5 },
  { step: "Second Step", description: "From Point 2 to Point 3", points: 5 },
  { step: "Third Step", description: "From Point 3 to Point 4", points: 5 },
  { step: "Fourth Step", description: "From Point 4 to Point 5", points: 10 },
  { step: "Fifth Step", description: "From Point 5 to Point 6", points: 5 },
  { step: "Sixth Step", description: "From Point 6 to the End Line", points: 10 },
];

const gameModes = ["Manual", "Coder Card", "Programming"];

export default function CompetitionSheet() {
  const [teamName, setTeamName] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scores, setScores] = useState({});
  const [times, setTimes] = useState({});
  const [notes, setNotes] = useState({});
  const [done, setDone] = useState({});
  const [gameMode, setGameMode] = useState("");

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX123 Competition Score Sheet", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${teamName}`, 20, 30);
    doc.text(`Game Mode: ${gameMode}`, 20, 40);
    doc.text(`Total Time: ${formatTime(timer)}`, 20, 50);

    const tableData = missions.map((mission, index) => [
      mission.step,
      mission.description,
      mission.points,
      times[index] ? `${times[index]}s` : "N/A",
      notes[index] || "N/A",
      done[index] ? "✔️" : "❌",
    ]);

    doc.autoTable({
      startY: 60,
      head: [["Step", "Description", "Points", "Time", "Notes", "Completed"]],
      body: tableData,
      theme: "striped",
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
        overflow: "linebreak",
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [79, 70, 229], 
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [240, 240, 255]
      },
      margin: { left: 10, right: 10 }
    });

    const totalScore = missions.reduce((sum, mission, index) => {
      return sum + (done[index] ? mission.points : 0);
    }, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Score: ${totalScore}/${missions.reduce((sum, m) => sum + m.points, 0)}`, 
      20, doc.autoTable.previous.finalY + 10);
    doc.save(`Team_${teamName}_Score.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">🤖 VEX123 Robotics Competition</h1>
        <p className="text-xl text-gray-600">Performance Score Sheet</p>
      </div>

      {/* Game Mode Selection */}
      <div className="mb-8 bg-indigo-50 p-4 rounded-xl">
        <h2 className="text-lg font-semibold text-indigo-700 mb-3">Game Mode</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {gameModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode)}
              className={`px-5 py-2 font-bold rounded-lg transition-all ${gameMode === mode 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Team Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-indigo-50 p-4 rounded-xl">
          <label className="block text-lg font-semibold text-indigo-700 mb-2">👥 Team Name</label>
          <input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>

        {/* Timer Controls */}
        <div className="bg-indigo-50 p-4 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-3 sm:mb-0">
              <FaClock className="text-indigo-600 mr-2 text-xl" />
              <span className="text-xl font-semibold text-gray-700">
                Time: {formatTime(timer)}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsRunning(!isRunning)} 
                className={`px-4 py-2 font-bold rounded-lg flex items-center ${
                  isRunning 
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                {isRunning ? "Pause" : "Start"}
              </button>
              <button 
                onClick={() => { setIsRunning(false); setTimer(0); }} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center"
              >
                <FaRedo className="mr-2" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Missions Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-md">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-3 text-left">Mission</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Time (s)</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Completed</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
                <td className="px-4 py-3 font-medium text-gray-800">{mission.step}</td>
                <td className="px-4 py-3 text-gray-700">{mission.description}</td>
                <td className="px-4 py-3 text-center font-semibold">{mission.points}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    value={times[index] || ""}
                    onChange={(e) => setTimes({ ...times, [index]: e.target.value })}
                    className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400 bg-white"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="Observations..."
                    value={notes[index] || ""}
                    onChange={(e) => setNotes({ ...notes, [index]: e.target.value })}
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-400 bg-white"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input 
                    type="checkbox" 
                    onChange={() => setDone({ ...done, [index]: !done[index] })} 
                    checked={done[index] || false} 
                    className="w-5 h-5 accent-green-500 cursor-pointer" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary and Actions */}
      <div className="bg-indigo-50 p-4 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-3 sm:mb-0">
            <h3 className="text-lg font-semibold text-indigo-700">Total Score</h3>
            <p className="text-2xl font-bold">
              {missions.reduce((sum, mission, index) => sum + (done[index] ? mission.points : 0), 0)} / 
              {missions.reduce((sum, m) => sum + m.points, 0)} points
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleDownloadPDF} 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
            >
              <FaDownload className="mr-2" /> Download Score Sheet
            </button>
            <button 
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
            >
              <FaCheckCircle className="mr-2" /> Submit Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}