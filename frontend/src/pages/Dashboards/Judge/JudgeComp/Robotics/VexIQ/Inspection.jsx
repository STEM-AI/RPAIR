import React, { useState, useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";
import { FiAlertCircle } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaRegCheckCircle } from "react-icons/fa";
import { fetchJudgeData, fetchTeams, submitScore } from "../../../../../../components/IntervIQNotbookIQInspection/ApiService";
import { inspectionChecklist } from "../../../../../../components/IntervIQNotbookIQInspection/InspectionCategories"
import axios from "axios";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";
export default function Inspection() {
     const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const [checkedItems, setCheckedItems] = useState(new Array(inspectionChecklist.length).fill(false));
  const [division, setDivision] = useState("");
  const [score, setScore] = useState("");
   const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("access_token");
  const [activeAlerts, setActiveAlerts] = useState({});
  const [teams, setTeams] = useState([]);
    const [judge, setJudge] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
  const [teamData, setTeamData] = useState({ id: null });  // Initialize with id property

 
  useEffect(() => {
    const loadData = async () => {
      if (token) {
        const judgeName = await fetchJudgeData(token);
        setJudge(judgeName);
        
        const teamsData = await fetchTeams(token, event_name);
        setTeams(teamsData);
      }
    };
    loadData();
  }, [token, event_name]);
  


  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Robot Inspection Checklist", 14, 10);
    doc.text(`Team name: ${teamData?.name || ""}`, 14, 20);
    doc.text(`Division: ${division}`, 14, 30);
    doc.text(`Final Inspection Score: ${score}/10`, 14, 40);

    const tableData = inspectionChecklist.map((item, index) => [
      checkedItems[index] ? "Yes" : "No",
      item.title,
      item.description,
      item.rule,
    ]);

    tableData.push(["Final Inspection (Circle when passed)", "", "", `${score}/10`]);

    doc.autoTable({
      head: [["Check", "Inspection Item", "Description", "Rule"]],
      body: tableData,
      startY: 50,
    });

    const finalY = doc.autoTable.previous.finalY + 20;
    doc.text("Inspector Signature: _________________________", 14, finalY);
    doc.text("Student Signature: _________________________", 14, finalY + 10);

    doc.save("Robot_Inspection_Checklist.pdf");
  };
  const totalScore = score
  const apiScoreField = "inspection_score";
  const postScore = async () => {
      if (!teamData?.id) {
     Swal.fire({
       icon: "error",
       title: "Error",
       text: "Please select a team first!",
     });
     return;
   }
     await submitScore(token, event_name, teamData.id, apiScoreField, totalScore);
  };
  
  return (
    <div className="p-4 flex flex-col max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-3xl md:text-4xl lg:text-5xl font-black">
          Robot Inspection Checklist
        </h2>
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 bg-white/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
  {/* Team Select Field */}
  <div className="space-y-3">
    <label 
      htmlFor="teamName" 
      className="text-cyan-700 text-base font-semibold whitespace-nowrap"
    >
      Team Name:
    </label>
    <select
      id="teamName"
      value={selectedTeam}
      onChange={(e) => {
        const selectedId = e.target.value;
        setSelectedTeam(selectedId);
        const selectedTeamData = teams.find(team => team.id.toString() === selectedId);
        setTeamData(selectedTeamData || null);
      }}
      className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
    >
      <option value="">Select Team</option>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  </div>

  {/* Judge Display Field */}
  <div className="space-y-3">
    <span className="text-cyan-700 text-base font-semibold whitespace-nowrap">
      Judge:
    </span>
    <div className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-gray-50">
      <p className="text-gray-700">{judge || "Not assigned"}</p>
    </div>
  </div>

  {/* Division Input Field */}
  <div className="space-y-3">
    <label 
      htmlFor="division" 
      className="text-cyan-700 text-base font-semibold whitespace-nowrap"
    >
      Division:
    </label>
    <input 
      type="text" 
      id="division" 
      value={division} 
      onChange={(e) => setDivision(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 placeholder-gray-400 transition-all"
      placeholder="Enter division"
    />
  </div>
</div>
      

      <div className="block md:hidden">
        <div className="space-y-4">
          {inspectionChecklist.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                    className="w-5 h-5 rounded-full accent-green-600"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                    {item.rule}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-900">Final Inspection Score:</label>
              <div className="relative flex items-center max-w-[120px]">
                <input 
                  type="number" 
                  max={10} 
                  min={0} 
                  value={score} 
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-md bg-white p-2 pr-8 outline-none text-center" 
                />
                <span className="absolute right-2 text-gray-500">/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="min-w-full bg-white shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b text-left font-semibold text-gray-600">Check</th>
                <th className="p-3 border-b text-left font-semibold text-gray-600">Inspection Item</th>
                <th className="p-3 border-b text-left font-semibold text-gray-600">Description</th>
                <th className="p-3 border-b text-left font-semibold text-gray-600">Rule</th>
              </tr>
            </thead>
            <tbody>
              {inspectionChecklist.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b text-center">
                    <input
                      type="checkbox"
                      checked={checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                      className="w-5 h-5 rounded-full accent-green-600"
                    />
                  </td>
                  <td className="p-3 border-b">{item.title}</td>
                  <td className="p-3 border-b">{item.description}</td>
                  <td className="p-3 border-b">{item.rule}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="p-3 border-b" colSpan={3}>Final Inspection Score:</td>
                <td className="p-3 border-b">
                  <div className="relative flex items-center max-w-[120px]">
                    <input 
                      type="number" 
                      max={10} 
                      min={0} 
                      value={score} 
                      onChange={(e) => setScore(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-md bg-white p-2 pr-8 outline-none text-center" 
                    />
                    <span className="absolute right-2 text-gray-500">/10</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:flex flex-col">              
            <div className="scoreInput flex flex-col sm:flex-row justify-between items-center p-4 gap-3 sm:gap-0">
                  <div className="flex ">
                                 <h3 className="text-xl font-bold">Total Score: {totalScore}/10</h3>
                          <button className="ml-3 rounded-2xl w-32  sm:w-auto  bg-green-700 p-2 text-white flex items-center justify-center"
                          onClick={postScore}>
                          <FaRegCheckCircle /> Done
                        </button> 
                        </div>
                     <button
                          className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center w-full sm:w-auto justify-center"
                           onClick={generatePDF}>
                    <FaRegCheckCircle /> Download PDF
                  </button>
            </div>
      </div>
    </div>
  );
 

}
