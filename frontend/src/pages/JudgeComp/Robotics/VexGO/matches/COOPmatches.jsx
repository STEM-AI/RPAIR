

import { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa";


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

export default function VexGoScoreboard() {
  const [scores, setScores] = useState({});
  const [turbines, setTurbines] = useState(0);
  const [teamData, setTeamData] = useState({ teamName: "", teamNumber: "" });
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [rankings] = useState([]);


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
  };

  const handleTurbineChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setTurbines(value);
    setScores((prev) => ({ ...prev, 4: value }));
  };

  const handleInputChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);


const handleDownloadPDF = () => {
  const doc = new jsPDF();
  
  // إعداد العنوان الرئيسي
  doc.setFontSize(18);
  doc.text("Ocean Science Exploration Competition", 20, 20);

  // إضافة بيانات الفريق
  doc.setFontSize(14);
  doc.text(`Team Name: ${teamData.teamName}`, 20, 30);
  doc.text(`Team Number: ${teamData.teamNumber}`, 20, 40);

  // تحضير بيانات الجدول
  const tableData = tasks.map((task, index) => [
    task.title,                      // اسم المهمة
    task.points,                     // النقاط المتاحة
    scores[index] ? scores[index] : 0 // النقاط المكتسبة
  ]);

  // إضافة الجدول إلى الـ PDF
  doc.autoTable({
    startY: 50, // بداية الجدول بعد العنوان
    head: [["Task", "Points", "Score"]], // رأس الجدول
    body: tableData, // بيانات الجدول
    theme: "striped", // تنسيق مخطط
    styles: { fontSize: 12, cellPadding: 4 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // لون الرأس
    alternateRowStyles: { fillColor: [240, 240, 240] }, // تلوين الصفوف
  });

  // إضافة المجموع الكلي في النهاية
  doc.setFontSize(14);
  doc.text(`Total Score: ${totalScore}`, 20, doc.autoTable.previous.finalY + 10);

  // تحميل ملف الـ PDF
  doc.save(`Team_${teamData.teamNumber}_Score.pdf`);
};


  return (
    <>
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 shadow-xl rounded-2xl">
      <h2 className="text-4xl font-bold text-center mb-6 text-indigo-700">Ocean Science Exploration</h2>

      {/* Timer */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        <span className="text-xl font-semibold text-gray-700">Time: {timer}s</span>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setIsRunning(false); setTimer(0); }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
        >
          Reset
        </button>
      </div>

      {/* Team Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
  <input
    type="text"
    name="teamName1"
    placeholder="Team Name 1"
    value={teamData.teamName1}
    onChange={handleInputChange}
    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    type="text"
    name="teamCode1"
    placeholder="Team Code 1"
    value={teamData.teamCode1}
    onChange={handleInputChange}
    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    type="text"
    name="teamName2"
    placeholder="Team Name 2"
    value={teamData.teamName2}
    onChange={handleInputChange}
    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    type="text"
    name="teamCode2"
    placeholder="Team Code 2"
    value={teamData.teamCode2}
    onChange={handleInputChange}
    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    type="text"
    name="matchId"
    placeholder="Match ID"
    value={teamData.matchId}
    onChange={handleInputChange}
    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 col-span-2"
  />
</div>


      {/* Score Table */}
      <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="border px-4 py-2">Task</th>
            <th className="border px-4 py-2">Points</th>
            <th className="border px-4 py-2">Completed?</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className="bg-white border">
              <td className="px-4 py-3 border">{task.title}</td>
              <td className="px-4 py-3 border">{task.points}</td>
              <td className="px-4 py-3 border text-center">
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
                    className="w-5 h-5 accent-green-500"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Score */}
      <div className="text-center mt-6 mb-6 text-2xl font-semibold text-indigo-700">
        Total Score: <span className="font-bold">{totalScore}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition">
          Submit
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
        >
          Download PDF
        </button>
      </div>

      
    </div>
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

</>
  );
}
