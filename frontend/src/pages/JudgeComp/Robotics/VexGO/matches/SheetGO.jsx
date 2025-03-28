import { useState, useEffect } from "react";
import { FaTrophy, FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

export default function SheetGO() {
  const [scores, setScores] = useState({});
  const [taskTimes, setTaskTimes] = useState({}); // New state for task times
  const [turbines, setTurbines] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [matchData, setMatchData] = useState({ matchId: '', team1: '', team2: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const savedMatch = JSON.parse(localStorage.getItem('currentMatch'));
    if (savedMatch) {
      setMatchData(savedMatch);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCheckboxChange = (index, value) => {
    setScores((prev) => ({ ...prev, [index]: value ? tasks[index].points : 0 }));
    // Record time when task is completed
    if (value) {
      setTaskTimes((prev) => ({ ...prev, [index]: timer }));
    } else {
      setTaskTimes((prev) => {
        const newTimes = { ...prev };
        delete newTimes[index];
        return newTimes;
      });
    }
  };

  const handleTurbineChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setTurbines(value);
    setScores((prev) => ({ ...prev, 4: value }));
    // Record time for turbine task
    if (value > 0) {
      setTaskTimes((prev) => ({ ...prev, 4: timer }));
    } else {
      setTaskTimes((prev) => {
        const newTimes = { ...prev };
        delete newTimes[4];
        return newTimes;
      });
    }
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  const handleSubmit = () => {
    const savedMatches = JSON.parse(localStorage.getItem('matches')) || {};
    savedMatches[matchData.matchId] = {
      score: totalScore,
      taskTimes: taskTimes,
      totalTime: timer
    };
    localStorage.setItem('matches', JSON.stringify(savedMatches));
    navigate('/coop');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text("Ocean Science Exploration", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Match ID: ${matchData.matchId}`, 20, 30);
    doc.text(`Teams: ${matchData.team1} & ${matchData.team2}`, 20, 40);
    doc.text(`Total Time: ${formatTime(timer)}`, 20, 50);

    const tableData = tasks.map((task, index) => [
      task.title,
      task.points,
      scores[index] || 0,
      taskTimes[index] ? formatTime(taskTimes[index]) : "N/A" // Add time column
    ]);

    doc.autoTable({
      startY: 60,
      head: [["Task", "Points", "Score", "Time"]], // Updated header
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 255] }
    });

    doc.text(`Total Score: ${totalScore}`, 20, doc.autoTable.previous.finalY + 10);
    doc.save(`Match_${matchData.matchId}_Score.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">🌊 Ocean Science Exploration</h1>
        <p className="text-lg text-gray-600">Match Score Sheet</p>
      </div>

      {/* Match Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-indigo-50 p-4 rounded-xl">
        <div>
          <h3 className="text-sm font-medium text-indigo-700 mb-1">Match ID</h3>
          <p className="text-xl font-bold">{matchData.matchId}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-indigo-700 mb-1">Team 1</h3>
          <p className="text-xl font-bold">{matchData.team1}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-indigo-700 mb-1">Team 2</h3>
          <p className="text-xl font-bold">{matchData.team2}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <FaClock className="text-indigo-600 mr-2 text-xl" />
          <span className="text-xl font-semibold">{formatTime(timer)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg flex items-center ${
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center"
          >
            <FaRedo className="mr-2" /> Reset
          </button>
        </div>
      </div>

      {/* Score Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-3 text-left">Task</th>
              <th className="px-4 py-3 text-center">Points</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Time</th> {/* New column */}
              <th className="px-4 py-3 text-center">Completed</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
                <td className="px-4 py-3">{task.title}</td>
                <td className="px-4 py-3 text-center font-medium">{task.points}</td>
                <td className="px-4 py-3 text-center font-bold">
                  {task.isDynamic ? (scores[4] || 0) : (scores[index] || 0)}
                </td>
                <td className="px-4 py-3 text-center">
                  {taskTimes[index] ? formatTime(taskTimes[index]) : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {task.isDynamic ? (
                    <input
                      type="number"
                      min="0"
                      value={turbines}
                      onChange={handleTurbineChange}
                      className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                      className="w-5 h-5 accent-green-500 cursor-pointer"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Score */}
      <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-indigo-700">Total Score</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalScore}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center"
          >
            <FaCheckCircle className="mr-2" /> Submit Score
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}