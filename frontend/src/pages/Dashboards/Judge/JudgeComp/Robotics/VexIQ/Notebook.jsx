

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

// function Notebook() {
//   return (
//    <div className="p-6 flex flex-col ">
//       {/* Title Section */}
//       <div className="text-center">
//         <h2 className="mb-4 py-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-4xl md:text-5xl font-black">
//           Engineering Notebook Rubric
//         </h2>
//       </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-6 max-w-full">
//   {/* Team Name */}
//   <div className="flex items-center gap-2 w-full">
//     <label htmlFor="team-select" className="text-cyan-600 text-lg md:text-xl font-black min-w-[110px]">
//       Team Name:
//     </label>
//     <select
//       id="team-select"
//       value={selectedTeam}
//       onChange={(e) => {
//         setSelectedTeam(e.target.value);
//         fetchTeamData(e.target.value);
//       }}
//       className="flex-1 border-b-2 border-cyan-400 p-3 focus:ring-2 focus:ring-transparent transition-colors bg-transparent text-gray-900"
//     >
//       <option value="">Select Team</option>
//       {teams.map((team) => (
//         <option key={team.id} value={team.id}>
//           {team.name}
//         </option>
//       ))}
//     </select>
//   </div>

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
//           <strong>Directions: </strong> Determine the point value that best characterizes the content of the Engineering Notebook for that criterion.
//               Write that value in the column to the right. This rubric is to be used for all Engineering Notebooks regardless of format
//               (physical or digital).

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
        
// <div className="scoreInput flex flex-col sm:flex-row justify-between items-center p-4 gap-3 sm:gap-0">
//       <div className="flex ">
//           <h3 className="text-xl font-bold">Total Score: {totalScore}/45</h3>
//               <button className="ml-3 rounded-2xl w-32  sm:w-auto  bg-green-700 p-2 text-white flex items-center justify-center"
//               onClick={postScore}>
//             <FaRegCheckCircle className="mr-1" /> Done
//               </button>
//             </div>
//             <button onClick={generatePDF}
//               className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center w-full sm:w-auto justify-center">
//           <FaRegCheckCircle className="mr-1" /> Download PDF
//         </button>
//     </div>
//       </div>
//     </div>
//       </div>
//   );
// }
// export default Notebook;


import GenericRubric from "../../../../../../components/IntervIQNotbookIQInspection/IntervIQNotbook";
import {notebookCategories} from "../../../../../../components/IntervIQNotbookIQInspection/notebookCategories";

const Notebook = () => (
  <GenericRubric
    categories={notebookCategories}
    rubricTitle="Engineering Notebook Rubric"
    pdfFileName="Notebook_Rubric"
    maxTotalScore={45}
    apiScoreField="eng_notebook_score"
  />
);

export default Notebook;