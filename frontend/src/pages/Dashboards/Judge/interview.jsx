
import React ,{useState}from 'react';
import { MdLabelImportant } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import Alert from '@mui/material/Alert';
import { FaRegCheckCircle } from "react-icons/fa";



function Interview() {
  const categories = [
    {
      title: "Engineering Design Process",
      description: "(All Awards)",
      category: "engineering",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team shows evidence of independent inquiry from the beginning stages of their design process. This includes brainstorming, testing, and exploring alternative solutions.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team shows evidence of independent inquiry for some elements of their design process.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team shows little to no evidence of independent inquiry in their design process.",
        },
      ],
    },
    {
      title: "Game Strategies",
      description: "(Design, Innovate, Create, Amaze)",
      category: "game",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team can fully explain their entire game strategy including game analysis.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team can explain their current strategy with limited evidence of game analysis.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team did not explain game strategy/strategy is not student-directed.",
        },
      ],
    },
    {
      title: "Robot Design",
      description: "(Design, Innovate, Build, Create, Amaze)",
      category: "robot_design",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team can fully explain the evolution of their robot design to the current design.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team can provide a limited description of why the current robot design was chosen, but shows limited evolution.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team did not explain robot design, or design is not student-directed.",
        },
      ],
    },
    {
      title: "Robot Build",
      description: "(Innovate, Build, Create, Amaze)",
      category: "robot_build",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team can fully explain their robot construction. Ownership of the robot build is evident.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team can describe why the current robot design was chosen, but with limited explanation.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team did not explain robot build, or build is not student-directed.",
        },
      ],
    },
    {
      title: "Robot Programming",
      description: "(Design, Innovate, Think, Amaze)",
      category: "robot_programming",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team can fully explain the evolution of their programming.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team can describe how the current programs work, but with limited evolution.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team did not explain programming, or programming is not student-directed.",
        },
      ],
    },
    {
      title: "Creativity / Originality",
      description: "(Innovate, Create)",
      category: "creativity",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team can describe creative aspect(s) of their robot with clarity and detail.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team can describe a creative solution but the answer lacks detail.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team has difficulty describing a creative solution or gives minimal response.",
        },
      ],
    },
    {
      title: "Team and Project Management",
      description: "(All Awards)",
      category: "team_management",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team can explain how team progress was tracked against an overall project timeline. Team can explain management of material and personnel resources.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team can explain how team progress was monitored, and some degree of management of material and personnel resources.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team cannot explain how team progress was monitored or how resources were managed.",
        },
      ],
    },
    {
      title: "Teamwork, Communication, Professionalism",
      description: "(All Awards)",
      category: "teamwork",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Most or all team members contribute to explanations of the design process, game strategy, and other work done by the team.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Some team members contribute to explanations of the design process, game strategy, and other work done by the team.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Few team members contribute to explanations of the design process, game strategy, and other work done by the team.",
        },
      ],
    },
    {
      title: "Respect, Courtesy, Positivity",
      description: "(All Awards)",
      category: "respect",
      options: [
        {
          level: "expert",
          label: "Expert (4,5)",
          message: "Team consistently interacts respectfully, courteously, and positively in their interview.",
        },
        {
          level: "proficient",
          label: "Proficient (2,3)",
          message: "Team interactions show signs of respect and courtesy, but there is room for improvement.",
        },
        {
          level: "emerging",
          label: "Emerging (0,1)",
          message: "Team interactions lack respectful and courteous behavior.",
        },
      ],
    },
  ];
  
  
  
  const [activeAlerts, setActiveAlerts] = useState({});
  
  const handleToggle = (category, level) => {
    setActiveAlerts((prev) => ({
      ...prev,
      [category]: prev[category] === level ? null : level,
    }));
  };
  return (
   <div className="p-6 flex flex-col ">
      {/* Title Section */}
      <div className="text-center">
        <h2 className="mb-4 py-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-4xl md:text-5xl font-black">
          Team Interview Rubric
        </h2>
      </div>

      {/* Input Fields Grid */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Team Name */}
        <div className="flex items-center gap-2">
          <label htmlFor="teamName" className="text-cyan-600 text-lg md:text-xl font-black">
            Team Name:
          </label>
          <input
            type="text"
            id="teamName"
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40"
          />
        </div>

        {/* Grade Level */}
        <div className="flex items-center gap-2">
          <label htmlFor="gradeLevel" className="text-cyan-600 text-lg md:text-xl font-black">
            Grade Level:
          </label>
          <select
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
            id="judgeName"
            className="border-b-2 border-cyan-400 bg-transparent outline-none w-3/4 md:w-40"
          />
        </div>
      </div>
      {/* Directions Note */}
      <div className="text-red-900 text-sm md:text-base">
        <p className='flex ' ><MdLabelImportant className=' mt-1 mr-1' />
          <strong>Directions: </strong> Determine a point value that best characterizes the content of the
          Team Interview for that criterion. Write that value in the column to the right.
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
               <div className="relative flex items-center">
                 <input type="number" max={5} min={0} className="w-14 border-b-2 border-green-400 bg-transparent p-1 outline-none text-center pr-6" />
                 <span className="absolute right-2 text-gray-500">/ 5</span>
               </div>
               <button className="ml-3 rounded-2xl bg-green-700 p-2 text-white flex items-center">
                 <FaRegCheckCircle className="mr-1" /> Save
               </button>
             </div>
           </div>
         </div>
       ))}
     </div>
   <div className="max-w-full mb-10 bg-white rounded-xl shadow-md overflow-hidden lg:max-w-full md:max-w-5xl">
      <div className="md:flex flex-col">
        <div className="py-4 px-8">
          <div className="pb-5 text-2xl text-cyan-600 capitalize">
          Special Features and General Impressions Rulers, Inspirers{" "}
            <p className="text-gray-500 text-base inline">(Rulers, Inspirers)</p>
          </div>
          <div className="grid grid-cols-1  gap-4">
            <p>Does the team have any special attributes, accomplishments, or exemplary effort in overcoming challenges at
                this event? Did anything stand out about this team in their interview? Please describe:</p> 
              <textarea className='border-2 border-gray row-span-6 px-3 py-1' placeholder='Notes...'></textarea>
              </div>
            </div>
      <div className="scoreInput flex justify-end items-center p-4">
      Total Score : /45
      <button className="ml-3 rounded-2xl bg-green-700 p-2 text-white flex items-center">
        <FaRegCheckCircle className="mr-1" /> Done
      </button>
    </div>
      </div>
    </div>
      </div>
  );
}
export default Interview;