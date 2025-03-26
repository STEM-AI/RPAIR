

import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaCheckCircle } from "react-icons/fa";

const questions = [
  "What is something that is interesting or exciting to you about STEM? What are you curious about?",
  "What are some things you've worked on or learned where you had to think creatively to solve a problem?",
  "What is something you've learned more about by building, creating, coding, or experimenting?",
  "How do you feel when you are thinking creatively to solve a problem? Why?",
  "STEM stands for Science, Technology, Engineering, and Math - what are some STEM ideas that you can learn about through hands-on activities?",
  "What could we do with this car to learn about how it works?",
  "Look closely at competition's robot that Jo is holding. What working pieces can you see?",
  "When we build, we will need to be patient even though we'll be really excited. What are some things that help you be patient?",
  "In your robot, find the Blue Wheel. Then, find the gears. What do you think wheels and gears could be used for?",
  "Why might you want to add a motor to a build? What could that help you learn or do differently?",
  "What components are used to construct the arm?",
  "Can you explain the function of the arm in this robot design?",
  "What would happen if we replaced the gears with a different size or type?",
  "How can you help your group be successful when we're building together?",
];

const gradeLevels = [

  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade"
];

export default function InterviewSheet() {
  const [team, setTeam] = useState("");
  const [grade, setGrade] = useState("");
  const [judge, setJudge] = useState("");
  const [scores, setScores] = useState(Array(questions.length).fill(""));
  const [notes, setNotes] = useState("");

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX GO Interview", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${team}`, 20, 30);
    doc.text(`Grade Level: ${grade}`, 20, 40);
    doc.text(`Judge: ${judge}`, 20, 50);

    const tableData = questions.map((question, index) => [
      question,
      scores[index] || "N/A",
    ]);

    doc.autoTable({
      startY: 60,
      head: [["Question", "Points (out of 5)"]],
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

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Score: ${scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0)}/75`, 20, doc.autoTable.previous.finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Notes: ${notes}`, 20, doc.autoTable.previous.finalY + 20);
    doc.save(`Team_${team}_Interview_Score.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">🧩 VEX GO Interview</h2>
        <p className="text-lg text-gray-600">Score Sheet for Young Innovators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-indigo-50 p-4 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">Team Number</label>
          <input
            type="text"
            placeholder="Team #"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">Grade Level</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="">Select Grade</option>
            {gradeLevels.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-1">Judge Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={judge}
            onChange={(e) => setJudge(e.target.value)}
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-md">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="border px-4 py-3 text-left">Question</th>
              <th className="border px-4 py-3 w-24">Score (0-5)</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={index} className={`border ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
                <td className="px-4 py-3 border text-gray-700">{question}</td>
                <td className="px-4 py-3 border text-center">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={scores[index] || ""}
                    onChange={(e) => {
                      const newScores = [...scores];
                      newScores[index] = e.target.value;
                      setScores(newScores);
                    }}
                    className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400 bg-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-indigo-50 p-4 rounded-xl">
        <label className="block text-lg font-semibold mb-2 text-indigo-700">Notes & Observations:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white"
          rows="4"
          placeholder="Write your observations about the team's creativity, teamwork, and problem-solving skills..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <button 
          onClick={handleDownloadPDF} 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
        >
          <FaDownload className="mr-2" /> Download Score Sheet
        </button>
        <button 
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
        >
          <FaCheckCircle className="mr-2" /> Submit Evaluation
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Total Possible Score: {questions.length * 5} points</p>
        <p className="mt-2">Current Total: {scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0)} points</p>
      </div>
    </div>
  );
}