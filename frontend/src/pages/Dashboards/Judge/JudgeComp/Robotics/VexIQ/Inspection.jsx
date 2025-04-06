import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaRegCheckCircle } from "react-icons/fa";

export default function Inspection() {
  const inspectionChecklist = [
    { title: "Team Robot Compliance", description: "Team is only competing with ONE robot. They have no spare or replacement robots.", rule: "<R1>" },
    { title: "Student Work Verification", description: "Team testifies that the designing, building, and programming of the robot was done only by the students on the team.", rule: "<R2>" },
    { title: "License Plate Requirement", description: "Robot displays at least one (1) easily visible VEX IQ Competition license plate.", rule: "<R4>" },
    { title: "Size Compliance", description: "The Robot fits within the starting size of 11” x 19” x 15”.", rule: "<R5>, <R6>" },
    { title: "Official Components Usage", description: "Robot is constructed ONLY from official robot components from the VEX IQ product line.", rule: "<R7>, <R8>" },
    { title: "Nonfunctional Decorations", description: "Any robot decorations are nonfunctional and do not affect performance.", rule: "<R8>" },
    { title: "Controller Connectivity", description: "Robot installed VEX IQ Brain can communicate with the VEX IQ Controller.", rule: "<R9>" },
    { title: "Motor Limit", description: "Robot uses no more than (6) VEX IQ Smart Motors.", rule: "<R10>" },
    { title: "Battery Compliance", description: "Robot uses no more than (1) single VEX IQ battery pack or (6) AA batteries.", rule: "<R11>" },
    { title: "Firmware Up-to-Date", description: "VEX IQ firmware (VEXos) is up to date.", rule: "<R12>" },
    { title: "Parts Modification", description: "No Robot parts have been modified except for cutting metal shafts.", rule: "<R13>" },
    { title: "Safety and Attachment Compliance", description: "Robot does not have detachable components posing safety risks.", rule: "<R14>, <G10>, <G11>" },
  ];

  const [checkedItems, setCheckedItems] = useState(new Array(inspectionChecklist.length).fill(false));
  const [teamNumber, setTeamNumber] = useState("");
  const [division, setDivision] = useState("");
  const [score, setScore] = useState("");

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Robot Inspection Checklist", 14, 10);
    doc.text(`Team Number: ${teamNumber}`, 14, 20);
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

  return (
    <div className="p-4 flex flex-col max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-3xl md:text-4xl lg:text-5xl font-black">
          Robot Inspection Checklist
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label htmlFor="teamNumber" className="text-cyan-600 text-base sm:text-lg font-bold whitespace-nowrap">Team Number:</label>
          <input 
            type="text" 
            id="teamNumber" 
            value={teamNumber} 
            onChange={(e) => setTeamNumber(e.target.value)}
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-full sm:w-40 px-2" 
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label htmlFor="division" className="text-cyan-600 text-base sm:text-lg font-bold whitespace-nowrap">Division:</label>
          <input 
            type="text" 
            id="division" 
            value={division} 
            onChange={(e) => setDivision(e.target.value)}
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-full sm:w-40 px-2" 
          />
        </div>
      </div>

      {/* Mobile View */}
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

      {/* Desktop View */}
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

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-6">
        <button
          onClick={generatePDF}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FaRegCheckCircle /> Download PDF
        </button>
        
        <button
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FaRegCheckCircle /> Done
        </button>
      </div>
    </div>
  );
}
