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
    <div className="p-6 flex flex-col">
      <div className="text-center">
        <h2 className="mb-4 py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-4xl md:text-5xl font-black">
          Robot Inspection Checklist
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        <div className="flex items-center gap-2">
          <label htmlFor="teamNumber" className="text-cyan-600 text-lg md:text-xl font-black">Team Number:</label>
          <input type="text" id="teamNumber" value={teamNumber} onChange={(e) => setTeamNumber(e.target.value)}
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="division" className="text-cyan-600 text-lg md:text-xl font-black">Division:</label>
          <input type="text" id="division" value={division} onChange={(e) => setDivision(e.target.value)}
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40" />
        </div>
      </div>

      <div className="p-4 mt-4">
        <div className="overflow-x-auto rounded-3xl border border-gray-300">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-3xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Check</th>
                <th className="p-3 border text-left">Inspection Item</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-left">Rule</th>
              </tr>
            </thead>
            <tbody>
              {inspectionChecklist.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedItems[index]}
                        onChange={() => handleCheckboxChange(index)}
                        className="w-5 h-5 rounded-full accent-green-600"
                      />
                    </label>
                  </td>
                  <td className="p-3 border">{item.title}</td>
                  <td className="p-3 border">{item.description}</td>
                  <td className="p-3 border">{item.rule}</td>
                </tr>
              ))}

              <tr className="bg-gray-100 font-bold text-lg">
                <td className="p-3 border " colSpan={3}>Final Inspection (Circle when passed):</td>
                <td className="p-3 border text-center">
                  <div className="relative flex items-center">
                    <input type="number" max={10} min={0} value={score} onChange={(e) => setScore(e.target.value)}
                      className="w-full border-b-2 bg-transparent p-1 outline-none text-center pr-6" />
                    <span className="absolute right-2 text-gray-500">/10</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-14 gap-2 sm:gap-3">
            <button
              onClick={generatePDF}
              className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center w-full sm:w-auto justify-center"
            >
              <FaRegCheckCircle className="mr-1" /> Download PDF
            </button>
            
            <button
              className="rounded-2xl w-full sm:w-auto bg-green-700 p-2 text-white flex items-center justify-center"
            >
              <FaRegCheckCircle className="mr-1" /> Done
            </button>
      </div>
    </div>
  );
}
