// import React, { useState ,useEffect } from "react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import axios from "axios";
// import { FaDownload } from "react-icons/fa";
// import { MdLabelImportant } from "react-icons/md";
// import { GoDotFill } from "react-icons/go";
// import { IoMdArrowDropdownCircle } from "react-icons/io";
// import Alert from '@mui/material/Alert';
// import { FaRegCheckCircle } from "react-icons/fa";
// import { useEventNameContext } from "../../../../../../context/EventName";
// import Swal from "sweetalert2";

// function Interview() {
//   const categories = [
//     {
//       title: "Engineering Design Process",
//       description: "(All Awards)",
//       category: "engineering",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team shows evidence of independent inquiry from the beginning stages of their design process. This includes brainstorming, testing, and exploring alternative solutions.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team shows evidence of independent inquiry for some elements of their design process.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team shows little to no evidence of independent inquiry in their design process.",
//         },
//       ],
//     },
//     {
//       title: "Game Strategies",
//       description: "(Design, Innovate, Create, Amaze)",
//       category: "game",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team can fully explain their entire game strategy including game analysis.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team can explain their current strategy with limited evidence of game analysis.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team did not explain game strategy/strategy is not student-directed.",
//         },
//       ],
//     },
//     {
//       title: "Robot Design",
//       description: "(Design, Innovate, Build, Create, Amaze)",
//       category: "robot_design",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team can fully explain the evolution of their robot design to the current design.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team can provide a limited description of why the current robot design was chosen, but shows limited evolution.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team did not explain robot design, or design is not student-directed.",
//         },
//       ],
//     },
//     {
//       title: "Robot Build",
//       description: "(Innovate, Build, Create, Amaze)",
//       category: "robot_build",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team can fully explain their robot construction. Ownership of the robot build is evident.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team can describe why the current robot design was chosen, but with limited explanation.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team did not explain robot build, or build is not student-directed.",
//         },
//       ],
//     },
//     {
//       title: "Robot Programming",
//       description: "(Design, Innovate, Think, Amaze)",
//       category: "robot_programming",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team can fully explain the evolution of their programming.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team can describe how the current programs work, but with limited evolution.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team did not explain programming, or programming is not student-directed.",
//         },
//       ],
//     },
//     {
//       title: "Creativity / Originality",
//       description: "(Innovate, Create)",
//       category: "creativity",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team can describe creative aspect(s) of their robot with clarity and detail.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team can describe a creative solution but the answer lacks detail.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team has difficulty describing a creative solution or gives minimal response.",
//         },
//       ],
//     },
//     {
//       title: "Team and Project Management",
//       description: "(All Awards)",
//       category: "team_management",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team can explain how team progress was tracked against an overall project timeline. Team can explain management of material and personnel resources.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team can explain how team progress was monitored, and some degree of management of material and personnel resources.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team cannot explain how team progress was monitored or how resources were managed.",
//         },
//       ],
//     },
//     {
//       title: "Teamwork, Communication, Professionalism",
//       description: "(All Awards)",
//       category: "teamwork",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Most or all team members contribute to explanations of the design process, game strategy, and other work done by the team.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Some team members contribute to explanations of the design process, game strategy, and other work done by the team.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Few team members contribute to explanations of the design process, game strategy, and other work done by the team.",
//         },
//       ],
//     },
//     {
//       title: "Respect, Courtesy, Positivity",
//       description: "(All Awards)",
//       category: "respect",
//       options: [
//         {
//           level: "expert",
//           label: "Expert (4,5)",
//           message: "Team consistently interacts respectfully, courteously, and positively in their interview.",
//         },
//         {
//           level: "proficient",
//           label: "Proficient (2,3)",
//           message: "Team interactions show signs of respect and courtesy, but there is room for improvement.",
//         },
//         {
//           level: "emerging",
//           label: "Emerging (0,1)",
//           message: "Team interactions lack respectful and courteous behavior.",
//         },
//       ],
//     },
//   ];
  
  
//     const [notes, setNotes] = useState("");
//     const [teams, setTeams] = useState([]);

 
//   const { currentCompetition } = useEventNameContext();
//   const [activeAlerts, setActiveAlerts] = useState({});
//   const [scores, setScores] = useState({});
//   const [teamName, setTeamName] = useState("");
//   const [gradeLevel, setGradeLevel] = useState("");
//   const [judge, setJudge] = useState("");
//   const [specialNotes, setSpecialNotes] = useState("");
//   const [error, setError] = useState("");
//     const [selectedTeam, setSelectedTeam] = useState('');
//   const [teamData, setTeamData] = useState(null);
//     const [loading, setLoading] = useState(false);



//     const token = localStorage.getItem("access_token");

//   const handleScoreChange = (category, value) => {
//     setScores((prev) => ({ ...prev, [category]: value }));
//   };
//   const handleToggle = (category, level) => {
//     setActiveAlerts((prev) => ({
//       ...prev,
//       [category]: prev[category] === level ? null : level,
//     }));
//   };

  
//   useEffect(() => {
//   const fetchData = async () => {
//     if (!token) {
//       setError("Authentication Error");
//       return;
//     }

//     try {
//       const userResponse = await axios.get(
//         `${process.env.REACT_APP_API_URL}/user/data/profile/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setJudge(`${userResponse.data.first_name} ${userResponse.data.last_name}`);
//     } catch (error) {
//       setError("Failed to load data");
//     }
//   };

//   fetchData();
//   }, [token]);
  
  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     if (!token) {
  //       setError("Authentication Error");
  //       return;
  //     }
  
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/team/list/`,
  //         {
  //           params: { competition_event__name: currentCompetition },
  //           headers: { Authorization: `Bearer ${token}` }
  //         }
  //       );
  //       setTeams(response.data);
  //       console.log("Teams:", response.data);
        
  //     } catch (error) {
  //       console.error('Error fetching teams:', error);
  //       setError(error.response?.data?.message || 'Failed to fetch teams');
  //     }
  //   };
  
  //   fetchTeams();
  // }, [token]); // Added token as dependency
  
  // // Fetch specific team data
  // const fetchTeamData = async (teamName) => {
  //   if (!teamName) return;
  
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/team/list/`, {
  //       params: {
  //         competition_event_name: currentCompetition, // Changed to single underscore
  //         search: teamName
  //       },
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  
  //     if (response.data.length === 0) {
  //       throw new Error('Team not found');
  //     }
  
  //     const [team] = response.data;
  //     setTeamData(team);
  //     console.log("Team Data:", team);
      
  //   } catch (error) {
  //     console.error('Error fetching team data:', error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  //   };
  

//   let totalScore=Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
//  const generatePDF = () => {
//   const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

//   // Set Title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(16);
//   doc.text("Team Interview Rubric", 14, 15);

//   // Team Details
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Team Name: ${teamName || "N/A"}`, 14, 25);
//   doc.text(`Grade Level: ${gradeLevel || "N/A"}`, 100, 25);
//    doc.text(`Judge Name: ${judge || "N/A"}`, 14, 32);
   

//   // Table Headers and Rows
//   const tableColumn = [
//     "Criteria",
//     "Expert (4-5)",
//     "Proficient (2-3)",
//     "Emerging (0-1)",
//     "Score"
//   ];
//   const tableRows = categories.map(({ title, options, category }) => {
//     const score = scores[category] || "N/A";
//     return [
//       title,
//       options[0]?.message || "",
//       options[1]?.message || "",
//       options[2]?.message || "",
//       score
//     ];
//   });

//   // Generate Table with Red Headers
//   doc.autoTable({
//     startY: 40,
//     head: [tableColumn],
//     body: tableRows,
//     styles: { fontSize: 9 },
//     headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] }, // Red header with white text
//     margin: { left: 14, right: 14 },
//     theme: "grid",
//   });

//   // Get last Y position from the table
//   let finalY = doc.lastAutoTable.finalY;

//   // Special Features and Notes Section
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(14);
//   doc.text("Special Features and General Impressions", 14, finalY + 8);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);
//   doc.text(
//     "Does the team have any special attributes, accomplishments, or exemplary effort in overcoming challenges?\n" +
//     "Did anything stand out about this team in their interview? Please describe:",
//     14, finalY + 15
//   );

//   // Notes and Total Score
//   doc.setFont("helvetica");
//   doc.setFontSize(11);
//   doc.text(`Notes: ${specialNotes || "None"}`, 14, finalY + 25);
//   doc.text(`Total Score: ${totalScore || "N/A"}`, 150, finalY + 40);

//   // Save PDF
//   doc.save(`${teamName || "Unknown"}_Team_Interview_Rubric.pdf`);
// };

// const postScore = async () => {
  // if (!teamData?.id) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Error",
  //     text: "Please select a team first!",
  //   });
  //   return;
  // }

//   const totalScore = scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
//   const scoreData = {
//     interview_score: totalScore,
    
//   };

//   try {
//     setLoading(true);
//     const response = await axios.patch(
//       `${process.env.REACT_APP_API_URL}/api/team_event/{event_name}/non-tech-score/${teamData.id}/`,
//       scoreData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     Swal.fire({
//       icon: "success",
//       title: "Success!",
//       text: "Scores submitted successfully!",
//       showConfirmButton: true,
//       confirmButtonColor: "#28a745"
//     });
//   } catch (error) {
//     console.error("Error submitting score:", error);
//     Swal.fire({
//       icon: "error",
//       title: "Submission Failed",
//       text: error.response?.data?.message || 'Error submitting scores',
//     });
//   } finally {
//     setLoading(false);
//   }
// };




//   return (
//    <div className="p-6 flex flex-col ">
//       {/* Title Section */}
//       <div className="text-center">
//         <h2 className="mb-4 py-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-4xl md:text-5xl font-black">
//           Team Interview Rubric
//         </h2>
//       </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-6 max-w-full">
//   {/* Team Name */}
  // <div className="flex items-center gap-2 w-full">
  //   <label htmlFor="team-select" className="text-cyan-600 text-lg md:text-xl font-black min-w-[110px]">
  //     Team Name:
  //   </label>
  //   <select
  //     id="team-select"
  //     value={selectedTeam}
  //     onChange={(e) => {
  //       setSelectedTeam(e.target.value);
  //       fetchTeamData(e.target.value);
  //     }}
  //     className="flex-1 border-b-2 border-cyan-400 p-3  transition-colors bg-transparent text-gray-900"
  //   >
  //     <option value="">Select Team</option>
  //     {teams.map((team) => (
  //       <option key={team.id} value={team.id}>
  //         {team.name}
  //       </option>
  //     ))}
  //   </select>
  // </div>

//   {/* Judge Name */}
//   <div className="flex items-center gap-2 w-full">
//     <label htmlFor="Judge" className="text-cyan-600 text-lg md:text-xl font-black min-w-[110px]">
//       Judge Name:
//     </label>
//     <div className="flex-1 border-b-2 border-cyan-400">
//       <p className="p-3 text-gray-900">
//         {judge || <span className="text-indigo-300">Not assigned</span>}
//       </p>
//     </div>
//   </div>
// </div>

//       {/* Directions Note */}
//       <div className="text-red-900 text-sm md:text-base">
//         <p className='flex ' ><MdLabelImportant className=' mt-1 mr-1' />
//           <strong>Directions: </strong> Determine a point value that best characterizes the content of the
//           Team Interview for that criterion. Write that value in the column to the right.
//         </p>
//       </div>
      

//         <h2 className=" mb-4 py-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-cyan-500 text-4xl md:text-5xl font-black">
//          <GoDotFill className='text-2xl mb-1 text-cyan-700 inline' /> Criteria :
//         </h2>
     
//    <div>
//        {categories.map(({ title, description, category, options }) => (
//          <div key={category} className="max-w-full mb-10 bg-white rounded-xl shadow-md overflow-hidden lg:max-w-full md:max-w-5xl">
//            <div className="md:flex flex-col">
//              <div className="py-4 px-8">
//                <div className="pb-5 text-2xl text-cyan-600 capitalize">
//                  {title} <p className="text-gray-500 text-base inline">{description}</p>
//                </div>
//                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                  {options.map(({ level, label, message }) => (
//                    <div key={level} className="option">
//                      <label className="flex items-center gap-2 cursor-pointer">
//                        {label}
//                        <i onClick={() => handleToggle(category, level)} className="cursor-pointer">
//                          <IoMdArrowDropdownCircle />
//                        </i>
//                      </label>
//                      {activeAlerts[category] === level && (
//                        <Alert severity="info" className="mt-2 w-full md:w-4/5">
//                          {message}
//                        </Alert>
//                      )}
//                    </div>
//                  ))}
//                </div>
//              </div>
//              <div className="scoreInput flex justify-end items-center p-4">
//                <div className=" flex items-center">
//                <input type="number" max={5} min={0} value={scores[category] || ""}
//               onChange={(e) => handleScoreChange(category, e.target.value)}
//                    className="w-14 border-b-2 border-green-400 bg-transparent p-1 outline-none text-center " />
//                  <span className="  text-gray-500">/ 5</span>
//                </div>
//              </div>
//            </div>
//          </div>
//        ))}
//      </div>
//    <div className="max-w-full mb-10 bg-white rounded-xl shadow-md overflow-hidden lg:max-w-full md:max-w-5xl">
//       <div className="md:flex flex-col">
//         <div className="py-4 px-8">
//           <div className="pb-5 text-2xl text-cyan-600 capitalize">
//           Special features and general impressions{" "}
//             <p className="text-gray-500 text-base inline">(Judges, Inspire)</p>
//           </div>
//           <div className="grid grid-cols-1  gap-4">
//             <p>Does the team have any special attributes, accomplishments, or exemplary effort in overcoming challenges at
//                 this event? Did anything stand out about this team in their interview? Please describe:</p>
//               <textarea className='border-2 border-gray row-span-6 px-3 py-1'
//                 value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)}
//                 placeholder='Notes...'></textarea>
//               </div>
//             </div>
// <div className="scoreInput flex flex-col sm:flex-row justify-between items-center p-4 gap-3 sm:gap-0">
//       <div className="flex ">
//           <h3 className="text-xl font-bold">Total Score: {totalScore}/45</h3>
//               <button
//                  onClick={postScore}
//                 className="ml-3 rounded-2xl w-32  sm:w-auto  bg-green-700 p-2 text-white flex items-center justify-center">
//             <FaRegCheckCircle className="mr-1" /> Done
//               </button>
//             </div>
//         <button onClick={generatePDF} className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center w-full sm:w-auto justify-center">
//           <FaRegCheckCircle className="mr-1" /> Download PDF
//         </button>
//     </div>
//       </div>
//     </div>
//       </div>
//   );
// }
// export default Interview;


// Interview.jsx
import GenericRubric from "../../../../../../components/IntervIQNotbookIQInspection/IntervIQNotbook";
import {interviewCategories} from "../../../../../../components/IntervIQNotbookIQInspection/interviewCategories";
const Interview = () => (
  <GenericRubric
    categories={interviewCategories}
    rubricTitle="Team Interview Rubric"
    pdfFileName="Interview_Rubric"
    maxTotalScore={45}
    apiScoreField="interview_score"
  />
);

export default Interview;