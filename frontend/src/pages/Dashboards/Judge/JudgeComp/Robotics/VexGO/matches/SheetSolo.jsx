// import { useState, useEffect } from "react";
// import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { sortBy } from 'lodash';
// import { useMatchContext } from './MatchContext';
// import Back from "../../../../../../../components/Back/Back"


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

// export default function SheetSolo() {
// const { updateMatch, currentMatch } = useMatchContext();
//   const [scores, setScores] = useState({});
//   const [turbines, setTurbines] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
//   const [matchData, setMatchData] = useState({ matchId: '', team1: ''});
//   const navigate = useNavigate();
//   const [completedOrder, setCompletedOrder] = useState([]);



//  useEffect(() => {
//     if (!currentMatch) {
//       navigate('/Dashboard/VexGO/Skills');
//     }
//  }, [currentMatch, navigate]);
  
  
//   useEffect(() => {
//     let interval;
//     if (isRunning && timer < 120) {
//       interval = setInterval(() => setTimer(prev => prev + 1), 1000);
//     } else if (timer >= 120) {
//       setIsRunning(false);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, timer]);

//   const handleCheckboxChange = (index, value) => {
//     setScores(prev => ({ ...prev, [index]: value ? tasks[index].points : 0 }));
    
//     if (value) {
//       setCompletedOrder(prev => [...prev, { index, time: timer }]);
//     } else {
//       setCompletedOrder(prev => prev.filter(item => item.index !== index));
//     }
//   };

//   const handleTurbineChange = (e) => {
//     let value = parseInt(e.target.value, 10) || 0; // غيّر const إلى let
      
//       if (value > 5) value = 5;
//       if (value < 0) value = 0;
      
//       setTurbines(value);
//       setScores((prev) => ({ ...prev, 4: value }));

//     if (value > 0) {
//       setCompletedOrder(prev => {
//         const exists = prev.some(item => item.index === 4);
//         return exists ? prev : [...prev, { index: 4, time: timer }];
//       });
//     } else {
//       setCompletedOrder(prev => prev.filter(item => item.index !== 4));
//     }
//   };

//   const getTimeDifference = (index) => {
//     const sortedCompleted = sortBy(completedOrder, 'time');
//     const task = sortedCompleted.find(t => t.index === index);
//     if (!task) return '-';

//     const taskIndex = sortedCompleted.indexOf(task);
//     return taskIndex === 0 
//       ? formatTime(task.time)
//       : formatTime(task.time - sortedCompleted[taskIndex - 1].time);
//   };

//   const totalScore = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

//    const handleSubmit = () => {
//     if (!currentMatch) return;

//     updateMatch(currentMatch.id, {
//       score: totalScore,
//       taskTimes: completedOrder.reduce((acc, { index, time }) => ({ 
//         ...acc, 
//         [index]: time 
//       })), 
//       totalTime: timer
//     });
 
//   navigate('/Dashboard/VexGO/Skills');
//    };

//   const formatTime = (seconds) => {
//     const safeSeconds = Math.max(0, seconds);
//     const mins = Math.floor(safeSeconds / 60);
//     const secs = safeSeconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18).setTextColor(79, 70, 229)
//       .text("Ocean Science Exploration", 105, 20, { align: "center" })
//       .setFontSize(14)
//       .text(`${currentMatch?.challengeType || 'Solo Challenge'}`, 105, 30, { align: "center" });

//     doc.setFontSize(14).setTextColor(0)
//       .text(`Match ID: ${currentMatch?.id || ''}`, 20, 40)
//       .text(`Teams: ${currentMatch?.team || ''}`, 20, 50)
//       .text(`Total Time: ${formatTime(timer)}`, 20, 60);

//     const tableData = tasks.map((task, index) => [
//       task.title,
//       task.points,
//       scores[index] || 0,
//       getTimeDifference(index)
//     ]);

//     doc.autoTable({
//       startY: 70,
//       head: [["Task", "Points", "Score", "Time"]],
//       body: tableData,
//       theme: "striped",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [79, 70, 229], textColor: 255 }
//     });

//     doc.text(`Total Score: ${totalScore}`, 20, doc.autoTable.previous.finalY + 10);
//     doc.save(`Match_${matchData.matchId}_Score.pdf`);
//   };

//   const handleReset = () => {
//     setIsRunning(false);
//     setTimer(0);
//     setScores({});
//     setTurbines(0);
//     setCompletedOrder([]);

//   };

//   return (
//     <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl">
//       <div className="text-center mb-8">
//         <Back />
//       <h1 className="text-3xl font-bold text-indigo-700 mb-2">
//         🌊 {currentMatch?.challengeType || 'Solo Challenge'}
//       </h1>
//       <p className="text-lg text-gray-600">Ocean Science Exploration</p>
//       <p className="text-lg font-bold text-indigo-700"> Round {currentMatch?.round}</p>
//     </div>

//      <div className="text-center grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-indigo-50 p-4 rounded-xl">
//         <div>
//           <h3 className="text-sm font-medium text-indigo-700 mb-1">Match ID</h3>
//           <p className="text-xl font-bold">{currentMatch?.id || ''}</p>
//         </div>
//         <div>
//           <h3 className="text-sm font-medium text-indigo-700 mb-1">Team</h3>
//           <p className="text-xl font-bold">{currentMatch?.team || ''}</p>
//         </div>
        
//       </div>

//       <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-6">
//         <div className="flex items-center">
//           <FaClock className="text-indigo-600 mr-2 text-xl" />
//           <span className="text-xl font-semibold">{formatTime(120 - timer)}</span>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setIsRunning(!isRunning)}
//             className={`px-4 py-2 rounded-lg flex items-center ${
//               isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
//             } text-white`}
//           >
//             {isRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
//             {isRunning ? "Pause" : "Start"}
//           </button>
//           <button
//             onClick={handleReset}
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
//           >
//             <FaRedo className="mr-2" /> Reset
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto mb-8">
//         <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
//           <thead>
//             <tr className="bg-indigo-600 text-white">
//               <th className="px-4 py-3 text-left">Task</th>
//               <th className="px-4 py-3 text-center">Points</th>
//               <th className="px-4 py-3 text-center">Score</th>
//               <th className="px-4 py-3 text-center">Time</th>
//               <th className="px-4 py-3 text-center">Completed</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task, index) => (
//               <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
//                 <td className="px-4 py-3">{task.title}</td>
//                 <td className="px-4 py-3 text-center font-medium">{task.points}</td>
//                 <td className="px-4 py-3 text-center font-bold">
//                   {task.isDynamic ? (scores[4] || 0) : (scores[index] || 0)}
//                 </td>
//                 <td className="px-4 py-3 text-center">
//                   {getTimeDifference(index)}
//                 </td>
//                 <td className="px-4 py-3 text-center">
//                   {task.isDynamic ? (
//                     <input
//                     type="number"
//                     min="0"
//                     max="5"
//                     value={turbines}
//                     onChange={handleTurbineChange}
//                     className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400"
//                     disabled={!isRunning || timer >= 120} 
//                   />
//                   ) : (
//                     <input
//                       type="checkbox"
//                       checked={!!scores[index]}
//                       onChange={(e) => handleCheckboxChange(index, e.target.checked)}
//                       className="w-5 h-5 accent-green-500 cursor-pointer"
//                       disabled={!isRunning || timer >= 120}
//                     />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex justify-between items-center">
//         <div>
//           <h3 className="text-sm font-medium text-indigo-700">Total Score</h3>
//           <p className="text-3xl font-bold text-indigo-600">{totalScore}</p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={handleSubmit}
//             className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center 
//                      shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
//             disabled={!isRunning}
//           >
//             <FaCheckCircle className="mr-2 text-lg" /> 
//             Submit Score
//           </button>
//           <button
//             onClick={handleDownloadPDF}
//             className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center 
//                      shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50"
//             disabled={!isRunning}
//           >
//             <FaDownload className="mr-2 text-lg" /> 
//             Download PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { sortBy } from 'lodash';
import { useMatchContext } from './MatchContext';
import Back from "../../../../../../../components/Back/Back";

const tasks = [
  { title: "Move purple sensor to the fish habitat", points: 1 },
  { title: "Move blue sensor to the pipeline", points: 1 },
  { title: "Move the orange sensor to the volcano tile", points: 1 },
  { title: "Orange sensor placed on top of the volcano", points: 2 },
  { title: "Align the turbines", points: "1 per turbine", isDynamic: true },
  { title: "Open the clam", points: 1 },
  { title: "Remove the pearl from the clam", points: 1 },
  { title: "Deliver the pearl to the green starting tile", points: 1 },
  { title: "End with the robot on the green tile", points: 1 },
];

export default function SheetSolo() {
  const { updateMatch, currentMatch } = useMatchContext();
  const [scores, setScores] = useState({});
  const [turbines, setTurbines] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const [completedOrder, setCompletedOrder] = useState([]);

  useEffect(() => {
    if (!currentMatch) {
      navigate('/Dashboard/VexGO/Skills');
    }
  }, [currentMatch, navigate]);
  
  useEffect(() => {
    let interval;
    if (isRunning && timer < 120) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else if (timer >= 120) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleCheckboxChange = (index, value) => {
    setScores(prev => ({ ...prev, [index]: value ? tasks[index].points : 0 }));
    
    if (value) {
      setCompletedOrder(prev => [...prev, { index, time: timer }]);
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== index));
    }
  };

  const handleTurbineChange = (e) => {
    let value = parseInt(e.target.value, 10) || 0;
    if (value > 5) value = 5;
    if (value < 0) value = 0;
    
    setTurbines(value);
    setScores((prev) => ({ ...prev, 4: value }));

    if (value > 0) {
      setCompletedOrder(prev => {
        const exists = prev.some(item => item.index === 4);
        return exists ? prev : [...prev, { index: 4, time: timer }];
      });
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== 4));
    }
  };

  const getTimeDifference = (index) => {
    const sortedCompleted = sortBy(completedOrder, 'time');
    const task = sortedCompleted.find(t => t.index === index);
    if (!task) return '-';

    const taskIndex = sortedCompleted.indexOf(task);
    return taskIndex === 0 
      ? formatTime(task.time)
      : formatTime(task.time - sortedCompleted[taskIndex - 1].time);
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  const handleSubmit = () => {
    if (!currentMatch) return;

    updateMatch(currentMatch.id, {
      score: totalScore,
      taskTimes: completedOrder.reduce((acc, { index, time }) => ({ 
        ...acc, 
        [index]: time 
      })), 
      totalTime: timer
    });
 
    navigate('/Dashboard/VexGO/Skills');
  };

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18).setTextColor(79, 70, 229)
      .text("Ocean Science Exploration", 105, 20, { align: "center" })
      .setFontSize(14)
      .text(`${currentMatch?.challengeType || 'Solo Challenge'}`, 105, 30, { align: "center" });

    doc.setFontSize(14).setTextColor(0)
      .text(`Match ID: ${currentMatch?.id || ''}`, 20, 40)
      .text(`Teams: ${currentMatch?.team || ''}`, 20, 50)
      .text(`Total Time: ${formatTime(timer)}`, 20, 60);

    const tableData = tasks.map((task, index) => [
      task.title,
      task.points,
      scores[index] || 0,
      getTimeDifference(index)
    ]);

    doc.autoTable({
      startY: 70,
      head: [["Task", "Points", "Score", "Time"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }
    });

    doc.text(`Total Score: ${totalScore}`, 20, doc.autoTable.previous.finalY + 10);
    doc.save(`Match_${currentMatch?.id || ''}_Score.pdf`);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimer(0);
    setScores({});
    setTurbines(0);
    setCompletedOrder([]);
  };

  return (
    <div className="max-w-5xl mx-auto mt-4 sm:mt-8 p-3 sm:p-6 bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-xl">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <Back />
        <h1 className="text-xl sm:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">
          🌊 {currentMatch?.challengeType || 'Solo Challenge'}
        </h1>
        <p className="text-sm sm:text-lg text-gray-600">Ocean Science Exploration</p>
        <p className="text-sm sm:text-lg font-bold text-indigo-700">Round {currentMatch?.round}</p>
      </div>

      {/* Match Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700 mb-1">Match ID</h3>
          <p className="text-base sm:text-xl font-bold">{currentMatch?.id || ''}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700 mb-1">Team</h3>
          <p className="text-base sm:text-xl font-bold">{currentMatch?.team || ''}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-2 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-center mb-2 sm:mb-0">
          <FaClock className="text-indigo-600 mr-2 text-lg sm:text-xl" />
          <span className="text-lg sm:text-xl font-semibold">{formatTime(120 - timer)}</span>
        </div>
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center text-sm sm:text-base ${
              isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isRunning ? <FaPause className="mr-1 sm:mr-2" /> : <FaPlay className="mr-1 sm:mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"
          >
            <FaRedo className="mr-1 sm:mr-2" /> Reset
          </button>
        </div>
      </div>

      {/* Score Table */}
      <div className="overflow-x-auto mb-4 sm:mb-8">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm sm:shadow-md">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Task</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Points</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm hidden sm:table-cell">Score</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm hidden sm:table-cell">Time</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{task.title}</td>
                <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium">{task.points}</td>
                <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm font-bold hidden sm:table-cell">
                  {task.isDynamic ? (scores[4] || 0) : (scores[index] || 0)}
                </td>
                <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm hidden sm:table-cell">
                  {getTimeDifference(index)}
                </td>
                <td className="px-2 sm:px-4 py-2 text-center">
                  {task.isDynamic ? (
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={turbines}
                      onChange={handleTurbineChange}
                      className="w-12 sm:w-16 px-1 sm:px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400 text-xs sm:text-sm"
                      disabled={!isRunning || timer >= 120} 
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={!!scores[index]}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer"
                      disabled={!isRunning || timer >= 120}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Score */}
      <div className="bg-indigo-50 p-2 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="text-center sm:text-left">
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700">Total Score</h3>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{totalScore}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleSubmit}
            className="px-3 py-2 sm:px-5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center 
                     shadow-md hover:shadow-lg transition-all text-xs sm:text-base"
            disabled={!isRunning}
          >
            <FaCheckCircle className="mr-1 sm:mr-2" /> 
            Submit Score
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-2 sm:px-5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center 
                     shadow-md hover:shadow-lg transition-all text-xs sm:text-base"
            disabled={!isRunning}
          >
            <FaDownload className="mr-1 sm:mr-2" /> 
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}