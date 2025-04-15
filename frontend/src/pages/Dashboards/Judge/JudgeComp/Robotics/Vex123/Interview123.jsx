

import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaCheckCircle } from "react-icons/fa";
import Back from "../../../../../../components/Back/Back";


const questions = [
  "1 - Presentation Skills",
  "2 - Poster",
  "3 - Creativity",
  "4 - Team Work"
];

const scoreOptions = [1, 2, 3, 4, 5];

export default function InterviewSheet() {
  const [team, setTeam] = useState("");
  const [judge, setJudge] = useState("");
  const [scores, setScores] = useState(Array(questions.length).fill(""));
  const [notes, setNotes] = useState("");

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX123 Interview", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${team}`, 20, 30);
    doc.text(`Judge: ${judge}`, 20, 40);

    const tableData = questions.map((question, index) => [
      question,
      scores[index] || "N/A",
    ]);

    doc.autoTable({
      startY: 50,
      head: [["Category", "Score (out of 5)"]],
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
    doc.text(`Total Score: ${scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0)}/20`, 20, doc.autoTable.previous.finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Notes: ${notes}`, 20, doc.autoTable.previous.finalY + 20);
    doc.save(`Team_${team}_Interview_Score.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">🧩 VEX123 Interview</h2>
        <p className="text-lg text-gray-600">Score Sheet for Young Innovators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-indigo-50 p-4 rounded-xl">
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
              <th className="border px-4 py-3 text-left">Category</th>
              <th className="border px-4 py-3 w-32">Score (1-5)</th> {/* Changed from w-24 to w-32 */}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={index} className={`border ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
                <td className="px-4 py-3 border text-gray-700">{question}</td>
                <td className="px-4 py-3 border text-center">
                  <select
                    value={scores[index] || ""}
                    onChange={(e) => {
                      const newScores = [...scores];
                      newScores[index] = e.target.value;
                      setScores(newScores);
                    }}
                    className="w-full px-3 py-2 border rounded text-center focus:ring-2 focus:ring-indigo-400 bg-white" 
                  >
                    <option value="">Select</option> {/* Added "Score" to label */}
                    {scoreOptions.map((score) => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </select>
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
          placeholder="Write your observations about the team's performance..."
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
          type="submit"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
        >
          <FaCheckCircle className="mr-2" /> Submit Evaluation
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Total Possible Score: 20 points</p>
        <p className="mt-2">Current Total: {scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0)} points</p>
      </div>
    </div>
  );
}