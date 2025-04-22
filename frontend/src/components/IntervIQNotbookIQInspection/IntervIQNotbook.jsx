


import React, { useState ,useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { MdLabelImportant } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import Alert from '@mui/material/Alert';
import { FaRegCheckCircle } from "react-icons/fa";
import { useEventNameContext } from "../../context/EventName";
import Swal from "sweetalert2";
import { fetchJudgeData, fetchTeams, submitScore } from "./ApiService";
import { generateRubricPDF } from "./pdfService";

const GenericRubric = ({ 
  categories, 
  rubricTitle, 
  pdfFileName, 
  maxTotalScore,
  apiScoreField 
}) => {
    const { currentCompetition } = useEventNameContext();
    const [totalScore, setTotalScore] = useState(0);

  const [scores, setScores] = useState({});
  const [activeAlerts, setActiveAlerts] = useState({});
  const [teams, setTeams] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [judge, setJudge] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const handleToggle = (category, level) => {
  setActiveAlerts(prev => ({
    ...prev,
    [category]: prev[category] === level ? null : level
  }));
};

const handleScoreChange = (category, value) => {
  setScores(prev => ({ ...prev, [category]: value }));
};


  useEffect(() => {
    const loadData = async () => {
      if (token) {
        const judgeName = await fetchJudgeData(token);
        setJudge(judgeName);
        
        const teamsData = await fetchTeams(token, currentCompetition);
        setTeams(teamsData);
      }
    };
    loadData();
  }, [token, currentCompetition]);

  const postScore = async () => {
     if (!teamData?.id) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select a team first!",
    });
    return;
  }
    await submitScore(token, currentCompetition, teamData.id, apiScoreField, totalScore);
  };

 const generatePDF = () => {
  generateRubricPDF(categories,teamData,judge,specialNotes,totalScore,pdfFileName,scores );
};


  return (
    <div className="p-6 flex flex-col">
     
        <h2 className="text-center mb-4 py-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-4xl md:text-5xl font-black">
           {rubricTitle}
        </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 max-w-full bg-white/70 p-6 rounded-xl shadow-md backdrop-blur-sm">
  {/* Team Select Field */}
  <div className="flex items-center gap-3 w-full">
    <label 
      htmlFor="teamSelect"
      className="text-cyan-700 text-lg md:text-xl font-bold min-w-[120px]"
    >
      Team Name:
    </label>
    <select
      id="teamSelect"
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
        <option key={team.id} value={team.id} className="p-2">
          {team.name}
        </option>
      ))}
    </select>
  </div>

  {/* Judge Display Field */}
  <div className="flex items-center gap-3 w-full">
    <span className="text-cyan-700 text-base font-semibold whitespace-nowrap">
      Judge:
    </span>
    <div className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-gray-50">
      <p className="text-gray-700">{judge || "Not assigned"}</p>
    </div>
  </div>
</div>
          
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
                          <h3 className="text-xl font-bold">Total Score: {totalScore}/{maxTotalScore}</h3>
                    <button className="ml-3 rounded-2xl w-32  sm:w-auto  bg-green-700 p-2 text-white flex items-center justify-center"
                    onClick={postScore}>
                  <FaRegCheckCircle className="mr-1" /> Done
                    </button>
                  </div>
                  <button onClick={generatePDF}
                    className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center w-full sm:w-auto justify-center">
                <FaRegCheckCircle className="mr-1" /> Download PDF
              </button>
          </div>
            </div>
          </div>
    </div>
  );
};

export default GenericRubric; 