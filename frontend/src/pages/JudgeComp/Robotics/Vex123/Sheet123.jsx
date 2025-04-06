

// import { useState, useEffect } from "react";
// import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// const gameModes = [
//   {
//     name: "Manual",
//     missions: [
//       { step: "Mission 1", description: "From Point 1 to Point 2", points: 5 },
//       { step: "Mission 2", description: "From Point 2 to Point 3", points: 5 },
//       { step: "Mission 3", description: "From Point 3 to Point 4", points: 5 }
//     ]
//   },
//   {
//     name: "Coder Card",
//     missions: [
//       { step: "Mission 4", description: "From Point 4 to Point 5", points: 10 },
//       { step: "Mission 5", description: "From Point 5 to Point 6", points: 5 }
//     ]
//   },
//   {
//     name: "Programming",
//     missions: [
//       { step: "Mission 6", description: "From Point 6 to the End Line", points: 10 }
//     ]
//   }
// ];

// const INITIAL_TIME = 5 * 60; // 5 minutes in seconds

// // Helper function to get mode key
// const getModeKey = (modeName) => modeName.toLowerCase().replace(' ', '');

// export default function CompetitionSheet() {
//   const [teamName, setTeamName] = useState("");
//   const [timer, setTimer] = useState(INITIAL_TIME);
//   const [isRunning, setIsRunning] = useState(false);
//   const [times, setTimes] = useState({});
//   const [notes, setNotes] = useState({});
//   const [done, setDone] = useState({});
//   const [completedModes, setCompletedModes] = useState([]);
//   const [currentMode, setCurrentMode] = useState(null);
  
//   // Initialize allData with proper structure
//   const [allData, setAllData] = useState(() => {
//     const initialData = {};
//     gameModes.forEach(mode => {
//       const modeKey = getModeKey(mode.name);
//       initialData[modeKey] = {
//         times: {},
//         notes: {},
//         done: {}
//       };
//     });
//     return initialData;
//   });

//   useEffect(() => {
//     let interval;
//     if (isRunning && timer > 0) {
//       interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     } else if (timer === 0) {
//       setIsRunning(false);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, timer]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
    
//     // Header
//     doc.setFontSize(18);
//     doc.setTextColor(79, 70, 229);
//     doc.setFont("helvetica", "bold");
//     doc.text("VEX123 Competition Score Sheet", 105, 20, { align: "center" });
//     doc.setFontSize(14);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Team: ${teamName}`, 20, 30);
//     doc.text(`Time Remaining: ${formatTime(timer)}`, 20, 40);
    
//     let finalY = 50;
    
//     // Generate tables for each game mode
//     gameModes.forEach(mode => {
//       const modeKey = getModeKey(mode.name);
//       const modeData = allData[modeKey] || { times: {}, notes: {}, done: {} };
      
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text(`${mode.name} Mode`, 20, finalY);
//       finalY += 10;
      
//       const tableData = mode.missions.map((mission, index) => [
//         mission.step,
//         mission.description,
//         mission.points,
//         modeData.times[index] ? `${modeData.times[index]}s` : "N/A",
//         modeData.notes[index] || "N/A",
//         modeData.done[index] ? "✔️" : "❌",
//       ]);

//       doc.autoTable({
//         startY: finalY,
//         head: [["Step", "Description", "Points", "Time", "Notes", "Completed"]],
//         body: tableData,
//         theme: "striped",
//         styles: { 
//           fontSize: 10, 
//           cellPadding: 3,
//           overflow: "linebreak",
//           lineWidth: 0.1
//         },
//         headStyles: { 
//           fillColor: [79, 70, 229], 
//           textColor: [255, 255, 255],
//           fontStyle: "bold"
//         },
//         alternateRowStyles: {
//           fillColor: [240, 240, 255]
//         },
//         margin: { left: 10, right: 10 }
//       });
      
//       // Calculate score for this mode
//       const modeScore = mode.missions.reduce((sum, mission, index) => {
//         return sum + (modeData.done[index] ? mission.points : 0);
//       }, 0);
      
//       const totalPossible = mode.missions.reduce((sum, m) => sum + m.points, 0);
      
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "bold");
//       doc.text(`${mode.name} Score: ${modeScore}/${totalPossible}`, 
//         20, doc.autoTable.previous.finalY + 10);
      
//       finalY = doc.autoTable.previous.finalY + 20;
//     });
    
//     // Calculate total score
//     const totalScore = gameModes.reduce((total, mode) => {
//       const modeKey = getModeKey(mode.name);
//       const modeData = allData[modeKey] || { times: {}, notes: {}, done: {} };
//       return total + mode.missions.reduce((sum, mission, index) => {
//         return sum + (modeData.done[index] ? mission.points : 0);
//       }, 0);
//     }, 0);
    
//     const totalPossible = gameModes.reduce((sum, mode) => 
//       sum + mode.missions.reduce((s, m) => s + m.points, 0), 0);
    
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text(`Final Score: ${totalScore}/${totalPossible}`, 
//       20, finalY);
    
//     doc.save(`Team_${teamName}_Full_Score_Sheet.pdf`);
//   };

//   const handleGameModeSelect = (mode) => {
//     // Save current mode data before switching
//     if (currentMode) {
//       const currentModeKey = getModeKey(currentMode.name);
//       setAllData(prev => ({
//         ...prev,
//         [currentModeKey]: {
//           times: { ...prev[currentModeKey]?.times, ...times },
//           notes: { ...prev[currentModeKey]?.notes, ...notes },
//           done: { ...prev[currentModeKey]?.done, ...done }
//         }
//       }));
//     }

//     // Set new mode
//     setCurrentMode(mode);
//     const modeKey = getModeKey(mode.name);
    
//     // Load new mode data with fallback to empty objects
//     setTimes(allData[modeKey]?.times || {});
//     setNotes(allData[modeKey]?.notes || {});
//     setDone(allData[modeKey]?.done || {});
//   };

//   const handleModeComplete = () => {
//     if (currentMode && !completedModes.includes(currentMode.name)) {
//       setCompletedModes([...completedModes, currentMode.name]);
      
//       // Save current mode data
//       const modeKey = getModeKey(currentMode.name);
//       setAllData(prev => ({
//         ...prev,
//         [modeKey]: {
//           times: { ...prev[modeKey]?.times, ...times },
//           notes: { ...prev[modeKey]?.notes, ...notes },
//           done: { ...prev[modeKey]?.done, ...done }
//         }
//       }));
//     }
//   };

//   const resetTimer = () => {
//     setTimer(INITIAL_TIME);
//     setIsRunning(false);
//   };

//   // Calculate total score with safe property access
//   const calculateTotalScore = () => {
//     return gameModes.reduce((total, mode) => {
//       const modeKey = getModeKey(mode.name);
//       const modeData = allData[modeKey] || { times: {}, notes: {}, done: {} };
//       return total + mode.missions.reduce((sum, mission, index) => {
//         return sum + (modeData.done[index] ? mission.points : 0);
//       }, 0);
//     }, 0);
//   };

//   const totalPossible = gameModes.reduce((sum, mode) => 
//     sum + mode.missions.reduce((s, m) => s + m.points, 0), 0);

//   return (
//     <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-indigo-700 mb-2">🤖 VEX123 Robotics Competition</h1>
//         <p className="text-xl text-gray-600">Performance Score Sheet</p>
//       </div>

//       {/* Team Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-indigo-50 p-4 rounded-xl">
//           <label className="block text-lg font-semibold text-indigo-700 mb-2">👥 Team Name</label>
//           <input
//             type="text"
//             placeholder="Enter Team Name"
//             value={teamName}
//             onChange={(e) => setTeamName(e.target.value)}
//             className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 bg-white"
//           />
//         </div>

//         {/* Timer Controls */}
//         <div className="bg-indigo-50 p-4 rounded-xl">
//           <div className="flex flex-col sm:flex-row justify-between items-center">
//             <div className="flex items-center mb-3 sm:mb-0">
//               <FaClock className="text-indigo-600 mr-2 text-xl" />
//               <span className={`text-xl font-semibold ${
//                 timer <= 60 ? 'text-red-600' : 'text-gray-700'
//               }`}>
//                 Time: {formatTime(timer)}
//               </span>
//             </div>
//             <div className="flex gap-2">
//               <button 
//                 onClick={() => setIsRunning(!isRunning)} 
//                 disabled={timer === 0}
//                 className={`px-4 py-2 font-bold rounded-lg flex items-center ${
//                   isRunning 
//                     ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
//                     : "bg-green-600 hover:bg-green-700 text-white"
//                 } ${timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {isRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
//                 {isRunning ? "Pause" : "Start"}
//               </button>
//               <button 
//                 onClick={resetTimer} 
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center"
//               >
//                 <FaRedo className="mr-2" /> Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Game Mode Navigation */}
//       <div className="mb-6 bg-indigo-50 p-4 rounded-xl">
//         <h2 className="text-lg font-semibold text-indigo-700 mb-3">Game Mode Progress</h2>
//         <div className="flex flex-wrap justify-center gap-3">
//           {gameModes.map((mode) => (
//             <div key={mode.name} className="flex flex-col items-center">
//               <button
//                 onClick={() => handleGameModeSelect(mode)}
//                 className={`px-5 py-2 font-bold rounded-lg transition-all ${
//                   completedModes.includes(mode.name)
//                     ? "bg-green-600 text-white shadow-md"
//                     : currentMode?.name === mode.name
//                     ? "bg-indigo-600 text-white shadow-md"
//                     : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
//                 }`}
//               >
//                 {mode.name}
//               </button>
//               {completedModes.includes(mode.name) && (
//                 <span className="text-xs mt-1 text-green-600">Completed</span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Current Mode Missions */}
//       {currentMode && (
//         <div className="mb-6 bg-white p-4 rounded-xl border border-indigo-100">
//           <h2 className="text-xl font-bold text-indigo-700 mb-4">{currentMode.name} Missions</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-indigo-100 text-indigo-700">
//                   <th className="px-4 py-2 text-left">Mission</th>
//                   <th className="px-4 py-2 text-left">Description</th>
//                   <th className="px-4 py-2">Points</th>
//                   <th className="px-4 py-2">Time (s)</th>
//                   <th className="px-4 py-2">Notes</th>
//                   <th className="px-4 py-2">Completed</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentMode.missions.map((mission, index) => (
//                   <tr key={index} className="border-b border-indigo-50">
//                     <td className="px-4 py-3 font-medium text-gray-800">{mission.step}</td>
//                     <td className="px-4 py-3 text-gray-700">{mission.description}</td>
//                     <td className="px-4 py-3 text-center font-semibold">{mission.points}</td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="number"
//                         min="0"
//                         value={times[index] || ""}
//                         onChange={(e) => setTimes({ ...times, [index]: e.target.value })}
//                         className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400 bg-white"
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <input
//                         type="text"
//                         placeholder="Observations..."
//                         value={notes[index] || ""}
//                         onChange={(e) => setNotes({ ...notes, [index]: e.target.value })}
//                         className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-400 bg-white"
//                       />
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <input 
//                         type="checkbox" 
//                         onChange={() => setDone({ ...done, [index]: !done[index] })} 
//                         checked={done[index] || false} 
//                         className="w-5 h-5 accent-green-500 cursor-pointer" 
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={handleModeComplete}
//               disabled={completedModes.includes(currentMode.name)}
//               className={`px-4 py-2 rounded-lg font-bold ${
//                 completedModes.includes(currentMode.name)
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700 text-white"
//               }`}
//             >
//               {completedModes.includes(currentMode.name) ? "Completed" : "Mark as Complete"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Summary and Actions */}
//       <div className="bg-indigo-50 p-4 rounded-xl mb-6">
//         <div className="flex flex-col sm:flex-row justify-between items-center">
//           <div className="mb-3 sm:mb-0">
//             <h3 className="text-lg font-semibold text-indigo-700">Total Score</h3>
//             <p className="text-2xl font-bold">
//               {calculateTotalScore()} / {totalPossible} points
//             </p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button 
//               onClick={handleDownloadPDF} 
//               className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
//             >
//               <FaDownload className="mr-2" /> Download Full Score Sheet
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const gameModes = [
  {
    name: "Manual",
    missions: [
      { step: "Mission 1", description: "From Point 1 to Point 2", points: 5 },
      { step: "Mission 2", description: "From Point 2 to Point 3", points: 5 },
      { step: "Mission 3", description: "From Point 3 to Point 4", points: 5 }
    ]
  },
  {
    name: "Coder Card",
    missions: [
      { step: "Mission 4", description: "From Point 4 to Point 5", points: 10 },
      { step: "Mission 5", description: "From Point 5 to Point 6", points: 5 }
    ]
  },
  {
    name: "Programming",
    missions: [
      { step: "Mission 6", description: "From Point 6 to the End Line", points: 10 }
    ]
  }
];

const INITIAL_TIME = 5 * 60; // 5 minutes in seconds

const getModeKey = (modeName) => modeName.toLowerCase().replace(' ', '');

export default function CompetitionSheet() {
  const [teamName, setTeamName] = useState("");
  const [timer, setTimer] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [times, setTimes] = useState({});
  const [notes, setNotes] = useState({});
  const [done, setDone] = useState({});
  const [completedModes, setCompletedModes] = useState([]);
  const [currentMode, setCurrentMode] = useState(null);
  
  const [allData, setAllData] = useState(() => {
    const initialData = {};
    gameModes.forEach(mode => {
      initialData[getModeKey(mode.name)] = { times: {}, notes: {}, done: {} };
    });
    return initialData;
  });

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX123 Competition Score Sheet", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${teamName}`, 20, 30);
    doc.text(`Time Remaining: ${formatTime(timer)}`, 20, 40);
    
    let finalY = 50;
    
    // Generate tables for each game mode
    gameModes.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { times: {}, notes: {}, done: {} };
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${mode.name} Mode`, 20, finalY);
      finalY += 10;
      
      const tableData = mode.missions.map((mission, index) => [
        mission.step,
        mission.description,
        mission.points,
        modeData.times[index] ? `${modeData.times[index]}s` : "N/A",
        modeData.notes[index] || "N/A",
        modeData.done[index] ? "✔️" : "❌",
      ]);

      doc.autoTable({
        startY: finalY,
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
      
      // Calculate score for this mode
      const modeScore = mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
      
      const totalPossible = mode.missions.reduce((sum, m) => sum + m.points, 0);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${mode.name} Score: ${modeScore}/${totalPossible}`, 
        20, doc.autoTable.previous.finalY + 10);
      
      finalY = doc.autoTable.previous.finalY + 20;
    });
    
    // Calculate total score
    const totalScore = gameModes.reduce((total, mode) => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { times: {}, notes: {}, done: {} };
      return total + mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
    }, 0);
    
    const totalPossible = gameModes.reduce((sum, mode) => 
      sum + mode.missions.reduce((s, m) => s + m.points, 0), 0);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Final Score: ${totalScore}/${totalPossible}`, 
      20, finalY);
    
    doc.save(`Team_${teamName}_Full_Score_Sheet.pdf`);
  };

  const handleGameModeSelect = (mode) => {
    // Save current mode data before switching
    if (currentMode) {
      const currentModeKey = getModeKey(currentMode.name);
      setAllData(prev => ({
        ...prev,
        [currentModeKey]: {
          times: { ...prev[currentModeKey]?.times, ...times },
          notes: { ...prev[currentModeKey]?.notes, ...notes },
          done: { ...prev[currentModeKey]?.done, ...done }
        }
      }));
    }

    // Set new mode
    setCurrentMode(mode);
    const modeKey = getModeKey(mode.name);
    
    // Load new mode data with fallback to empty objects
    setTimes(allData[modeKey]?.times || {});
    setNotes(allData[modeKey]?.notes || {});
    setDone(allData[modeKey]?.done || {});
  };

  const handleModeComplete = () => {
    if (currentMode && !completedModes.includes(currentMode.name)) {
      setCompletedModes([...completedModes, currentMode.name]);
      
      // Save current mode data
      const modeKey = getModeKey(currentMode.name);
      setAllData(prev => ({
        ...prev,
        [modeKey]: {
          times: { ...prev[modeKey]?.times, ...times },
          notes: { ...prev[modeKey]?.notes, ...notes },
          done: { ...prev[modeKey]?.done, ...done }
        }
      }));
    }
  };

  const resetTimer = () => {
    setTimer(INITIAL_TIME);
    setIsRunning(false);
  };

  const calculateTotalScore = () => {
    return gameModes.reduce((total, mode) => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { times: {}, notes: {}, done: {} };
      return total + mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
    }, 0);
  };

  const totalPossible = gameModes.reduce((sum, mode) => 
    sum + mode.missions.reduce((s, m) => s + m.points, 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 bg-white shadow-xl rounded-xl border border-gray-200">
      {/* Header - Stacked on mobile */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">🤖 VEX123 Robotics</h1>
        <p className="text-sm sm:text-base md:text-xl text-gray-600">Performance Score Sheet</p>
      </div>

      {/* Team Info - Stacked on mobile */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
          <label className="block text-sm sm:text-base font-semibold text-indigo-700 mb-1">👥 Team Name</label>
          <input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white text-sm sm:text-base"
          />
        </div>

        {/* Timer Controls - Adjusted for mobile */}
        <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <FaClock className="text-indigo-600 mr-2 text-lg sm:text-xl" />
              <span className={`text-base sm:text-xl font-semibold ${
                timer <= 60 ? 'text-red-600' : 'text-gray-700'
              }`}>
                {formatTime(timer)}
              </span>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button 
                onClick={() => setIsRunning(!isRunning)} 
                disabled={timer === 0}
                className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-lg flex items-center justify-center ${
                  isRunning 
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                } ${timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRunning ? <FaPause className="mr-1 sm:mr-2" /> : <FaPlay className="mr-1 sm:mr-2" />}
                <span className="text-xs sm:text-sm">{isRunning ? "Pause" : "Start"}</span>
              </button>
              <button 
                onClick={resetTimer} 
                className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center"
              >
                <FaRedo className="mr-1 sm:mr-2" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Navigation - Horizontal scroll on small screens */}
      <div className="mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-3 rounded-lg overflow-x-auto">
        <h2 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">Game Mode Progress</h2>
        <div className="flex space-x-2 min-w-max">
          {gameModes.map((mode) => (
            <div key={mode.name} className="flex flex-col items-center min-w-[100px]">
              <button
                onClick={() => handleGameModeSelect(mode)}
                className={`w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  completedModes.includes(mode.name)
                    ? "bg-green-600 text-white shadow-md"
                    : currentMode?.name === mode.name
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
                }`}
              >
                {mode.name}
              </button>
              {completedModes.includes(mode.name) && (
                <span className="text-[10px] sm:text-xs mt-1 text-green-600">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Mode Missions - Horizontal scroll on small screens */}
      {currentMode && (
        <div className="mb-4 sm:mb-6 bg-white p-2 sm:p-3 rounded-lg border border-indigo-100 overflow-x-auto">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-indigo-700 mb-2 sm:mb-3">
            {currentMode.name} Missions
          </h2>
          <div className="min-w-[600px] sm:min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Mission</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Description</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Points</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Time (s)</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Notes</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Done</th>
                </tr>
              </thead>
              <tbody>
                {currentMode.missions.map((mission, index) => (
                  <tr key={index} className="border-b border-indigo-50">
                    <td className="px-2 py-1 sm:px-3 sm:py-2 font-medium text-gray-800 text-xs sm:text-sm">
                      {mission.step}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-xs sm:text-sm">
                      {mission.description}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                      {mission.points}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2">
                      <input
                        type="number"
                        min="0"
                        value={times[index] || ""}
                        onChange={(e) => setTimes({ ...times, [index]: e.target.value })}
                        className="w-12 sm:w-16 px-1 sm:px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400 bg-white text-xs sm:text-sm"
                      />
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2">
                      <input
                        type="text"
                        placeholder="Notes..."
                        value={notes[index] || ""}
                        onChange={(e) => setNotes({ ...notes, [index]: e.target.value })}
                        className="w-full px-1 sm:px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-400 bg-white text-xs sm:text-sm"
                      />
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-center">
                      <input 
                        type="checkbox" 
                        onChange={() => setDone({ ...done, [index]: !done[index] })} 
                        checked={done[index] || false} 
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 sm:mt-3 flex justify-end">
            <button
              onClick={handleModeComplete}
              disabled={completedModes.includes(currentMode.name)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${
                completedModes.includes(currentMode.name)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {completedModes.includes(currentMode.name) ? "Completed" : "Mark Complete"}
            </button>
          </div>
        </div>
      )}

      {/* Summary and Actions - Stacked on mobile */}
      <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Score</h3>
            <p className="text-xl sm:text-2xl font-bold">
              {calculateTotalScore()} / {totalPossible} points
            </p>
          </div>
          <button 
            onClick={handleDownloadPDF} 
            className="w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
          >
            <FaDownload className="mr-1 sm:mr-2" /> 
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}