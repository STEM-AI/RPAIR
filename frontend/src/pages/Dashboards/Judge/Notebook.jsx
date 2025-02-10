
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import { MdLabelImportant } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import Alert from '@mui/material/Alert';
import { FaRegCheckCircle } from "react-icons/fa";

function Notebook() {
  const categories = [
  {
    title: "Identify the Problem",
    description: "(Engineering Design Process)",
    category: "identify_problem",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Identifies the game and robot design challenges in detail at the start of each design process cycle with words and pictures. States the goals for accomplishing the challenge.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Identifies the challenge at the start of each design cycle. Lacking details in words, pictures, or goals.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not identify the challenge at the start of each design cycle.",
      },
    ],
  },
  {
    title: "Brainstorm, Diagram, or Prototype Solutions",
    description: "(Engineering Design Process)",
    category: "brainstorm_solutions",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Lists three or more possible solutions to the challenge with labeled diagrams. Citations provided for ideas from outside sources such as online videos or other teams.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Lists one or two possible solutions to the challenge. Citations provided for ideas that came from outside sources.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not list any solutions to the challenge.",
      },
    ],
  },
  {
    title: "Select Best Solution and Plan",
    description: "(Engineering Design Process)",
    category: "select_solution",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Explains why the solution was selected through testing and/or a decision matrix. Fully describes the plan to implement the solution.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Explains why the solution was selected. Mentions the plan.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not explain any plan or why the solution or plan was selected.",
      },
    ],
  },
  {
    title: "Build and Program the Solution",
    description: "(Engineering Design Process)",
    category: "build_program",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Records the steps to build and program the solution. Includes enough detail for the reader to follow the logic used by the team to develop their robot design and recreate it from the documentation.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records the key steps to build and program the solution. Lacks sufficient detail for the reader to follow the design process.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not record the key steps to build and program the solution.",
      },
    ],
  },
  {
    title: "Test Solution",
    description: "(Engineering Design Process)",
    category: "test_solution",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Records all the steps to test the solution, including test results.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records the key steps to test the solution.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not record steps to test the solution.",
      },
    ],
  },
  {
    title: "Repeat Design Process",
    description: "(Engineering Design Process)",
    category: "repeat_design",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Shows that the design process is repeated multiple times to improve performance on a design goal or robot/game performance.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Design process is not often repeated for design goals or robot/game performance.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not show that the design process is repeated.",
      },
    ],
  },
  {
    title: "Independent Inquiry",
    description: "(Engineering Design Process)",
    category: "independent_inquiry",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Team shows evidence of independent inquiry from the beginning stages of their design process. Notebook documents whether the implemented ideas have their origin with students on the team or if students found inspiration elsewhere.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Team shows evidence of independent inquiry for some elements of their design process. Ideas and information from outside the team are documented.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Team shows little to no evidence of independent inquiry in their design process. Ideas from outside the team are not properly credited.",
      },
    ],
  },
  {
    title: "Usability and Completeness",
    description: "(Engineering Design Process)",
    category: "usability_completeness",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Records the entire design and development process in such clarity and detail that the reader could recreate the project’s history.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records the design and development process completely but lacks sufficient detail.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Lacks sufficient detail to understand the design process.",
      },
    ],
  },
  {
    title: "Record of Team and Project Management",
    description: "(Engineering Design Process)",
    category: "team_management",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Provides a complete record of team and project assignments, team meeting notes including goals, decisions, and accomplishments. Design cycles are easily identified. Resource constraints including time and materials are noted throughout.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records most of the information listed at the left. Level of detail is inconsistent, or some aspects are missing.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not record most of the information listed at the left. Not organized.",
      },
    ],
  },
  {
  title: "Notebook Format",
  description: "(Engineering Design Process)",
  category: "notebook_format",
  options: [
    {
      level: "expert_proficient",
      label: "Expert/Proficient (5 or Partial Points)",
      message: "Five (5) points if the notebook has evidence that documentation was done in sequence with the design process. This can take the form of dated entries with the names of contributing students included and an overall system of organization. For example, numbered pages and a table of contents with entries organized for future reference. Partial points may be awarded if this is inconsistent or incomplete.",
    },
    {
      level: "emerging",
      label: "Emerging (0 Points)",
      message: "Does not meet the criteria for organization and documentation.",
    },
  ],
}
];


  
  const [activeAlerts, setActiveAlerts] = useState({});
  const [scores, setScores] = useState({});
  const [teamName, setTeamName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const handleScoreChange = (category, value) => {
    setScores((prev) => ({ ...prev, [category]: value }));
  };
  const handleToggle = (category, level) => {
    setActiveAlerts((prev) => ({
      ...prev,
      [category]: prev[category] === level ? null : level,
    }));
  };

  let totalScore=Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
 const generatePDF = () => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Set Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Team Interview Rubric", 14, 15);

  // Team Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Team Name: ${teamName || "N/A"}`, 14, 25);
  doc.text(`Grade Level: ${gradeLevel || "N/A"}`, 100, 25);
  doc.text(`Judge Name: ${judgeName || "N/A"}`, 14, 32);

  // Table Headers and Rows
  const tableColumn = [
    "Criteria",
    "Expert (4-5)",
    "Proficient (2-3)",
    "Emerging (0-1)",
    "Score"
  ];
  const tableRows = categories.map(({ title, options, category }) => {
    const score = scores[category] || "N/A";
    return [
      title,
      options[0]?.message || "",
      options[1]?.message || "",
      options[2]?.message || "",
      score
    ];
  });

  // Generate Table
  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14, right: 14 },
    theme: "grid",
  });

  // Get last Y position from the table
  let finalY = doc.lastAutoTable.finalY;

  // Special Features and Notes Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Special Features and General Impressions", 14, finalY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    "Does the team have any special attributes, accomplishments, or exemplary effort in overcoming challenges?\n" +
    "Did anything stand out about this team in their interview? Please describe:",
    14, finalY + 15
  );


  // Notes and Total Score
  doc.setFont("helvetica");
  doc.setFontSize(11);
  doc.text(`Notes: ${specialNotes || "None"}`, 14, finalY + 25);
  doc.text(`Total Score: ${totalScore || "N/A"}`, 150, finalY + 40);

  // Save PDF
  doc.save(`${teamName || "Unknown"}_Team_Interview_Rubric.pdf`);
};




  return (
   <div className="p-6 flex flex-col ">
      {/* Title Section */}
      <div className="text-center">
        <h2 className="mb-4 py-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-4xl md:text-5xl font-black">
          Engineering Notebook Rubric
        </h2>
      </div>

      {/* Input Fields Grid */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 max-w-6xl">
        {/* Team Name */}
        <div className="flex items-center gap-2">
          <label htmlFor="teamName" className="text-cyan-600 text-lg md:text-xl font-black">
            Team Name:
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName} onChange={(e) => setTeamName(e.target.value)}
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40"
          />
        </div>

        {/* Grade Level */}
        <div className="flex items-center gap-2">
          <label htmlFor="gradeLevel" className="text-cyan-600 text-lg md:text-xl font-black">
            Grade Level:
          </label>
          <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}
            id="gradeLevel"
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40"
          >
            <option value="ES">ES</option>
            <option value="MS">MS</option>
            <option value="HS">HS</option>
            <option value="University">University</option>
          </select>
        </div>

        {/* Judge Name */}
        <div className="flex items-center gap-2">
          <label htmlFor="judgeName" className="text-cyan-600 text-lg md:text-xl font-black">
            Judge Name:
          </label>
          <input
            type="text"
            value={judgeName} onChange={(e) => setJudgeName(e.target.value)}
            id="judgeName"
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40"
          />
        </div>
      </div>
      {/* Directions Note */}
      <div className="text-red-900 text-sm md:text-base">
        <p className='flex ' ><MdLabelImportant className=' mt-1 mr-1' />
          <strong>Directions: </strong> Determine the point value that best characterizes the content of the Engineering Notebook for that criterion.
              Write that value in the column to the right. This rubric is to be used for all Engineering Notebooks regardless of format
              (physical or digital).

        </p>
      </div>

        <h2 className=" mb-4 py-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-cyan-500 text-4xl md:text-5xl font-black">
         <GoDotFill className='text-2xl mb-1 text-cyan-700 inline' /> Criteria :
        </h2>
     
   <div>
       {categories.map(({ title, description, category, options }) => (
         <div key={category} className="max-w-full mb-10 bg-white rounded-xl shadow-md overflow-hidden lg:max-w-full md:max-w-5xl">
           <div className="md:flex flex-col">
             <div className="py-4 px-8">
               <div className="pb-5 text-2xl text-cyan-600 capitalize">
                 {title} <p className="text-gray-500 text-base inline">{description}</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {options.map(({ level, label, message }) => (
                   <div key={level} className="option">
                     <label className="flex items-center gap-2 cursor-pointer">
                       {label}
                       <i onClick={() => handleToggle(category, level)} className="cursor-pointer">
                         <IoMdArrowDropdownCircle />
                       </i>
                     </label>
                     {activeAlerts[category] === level && (
                       <Alert severity="info" className="mt-2 w-full md:w-4/5">
                         {message}
                       </Alert>
                     )}
                   </div>
                 ))}
               </div>
             </div>
             <div className="scoreInput flex justify-end items-center p-4">
               <div className=" flex items-center">
               <input type="number" max={5} min={0} value={scores[category] || ""}
              onChange={(e) => handleScoreChange(category, e.target.value)}
                   className="w-14 border-b-2 border-green-400 bg-transparent p-1 outline-none text-center " />
                 <span className="  text-gray-500">/ 5</span>
               </div>
             </div>
           </div>
         </div>
       ))}
     </div>
   <div className="max-w-full mb-10 bg-white rounded-xl shadow-md overflow-hidden lg:max-w-full md:max-w-5xl">
      <div className="md:flex flex-col">
        
<div className="scoreInput flex flex-col sm:flex-row justify-between items-center p-4 gap-3 sm:gap-0">
      <div className="flex ">
          <h3 className="text-xl font-bold">Total Score: {totalScore}/45</h3>
          <button className="ml-3 rounded-2xl w-32  sm:w-auto  bg-green-700 p-2 text-white flex items-center justify-center">
            <FaRegCheckCircle className="mr-1" /> Done
              </button>
            </div>
        <button onClick={generatePDF} className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center w-full sm:w-auto justify-center">
          <FaRegCheckCircle className="mr-1" /> Download PDF
        </button>
    </div>
      </div>
    </div>
      </div>
  );
}
export default Notebook;

