

import React from 'react';
import { BiJoystick } from "react-icons/bi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


const JudgeGo = () => {
  const navigate = useNavigate();




  

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className=" w-full flex  p-8">
      <div className="grid gap-12 md:grid-cols-2 md:gap-8">

        {[ 
          { 
            title: "Teamwork Matches", 
            color: "bg-teal-400", 
            shadow: "shadow-teal-500/40", 
            icon: <FontAwesomeIcon icon={faPeopleGroup} className="text-white text-4xl" />, 
            path: "/Dashboard/LiveTeam",
            description: "Work together, win together! In this round, two teams collaborate to score as many points as possible within the time limit. Communication and strategy are key to achieving the highest combined score!"
          },
          { 
            title: "Skills Matches", 
            color: "bg-rose-500", 
            shadow: "shadow-rose-500/40", 
            icon: <BiJoystick className="text-white text-4xl" />, 
            path: "/Dashboard/LiveSkills",
            description: "Test your robot's capabilities in both autonomous and driver-controlled modes! Score as many points as possible through precise programming and skilled driving. Master both to dominate the competition!"
          }
        ].map((service, index) => (
          <div 
            key={index} 
            onClick={() => handleClick(service.path)}
            className="relative rounded-xl mt-12 bg-white p-6 text-center shadow-xl h-96 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full ${service.color} ${service.shadow}`}>
              {service.icon}
            </div>

            <h1 className="text-darken mb-4 text-xl font-semibold px-6">{service.title}</h1>
            <p className="px-6 text-gray-500 text-base leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgeGo;

