

// import React from 'react';
// import { BiJoystick } from "react-icons/bi";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

// import { FaLaptopCode } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";


// const MatchRounds = () => {
//   const navigate = useNavigate();

//   const handleClick = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="h-full min-h-screen w-full  p-4 flex items-center justify-center">
//       <div className="grid gap-14 md:grid-cols-3 md:gap-5">
//         {[ 
//           { 
//             title: "Teamwork Challenge", 
//             color: "bg-teal-400", 
//             shadow: "shadow-teal-500/40", 
//             icon: <FontAwesomeIcon icon={faPeopleGroup} className="text-white text-4xl" />,
//             path: "/teamwork",
//             description: "Work together, win together! In this round, two teams collaborate to score as many points as possible within the time limit. Communication and strategy are key to achieving the highest combined score!"

//           },
//           { 
//             title: "Driver Skills Challenge", 
//             color: "bg-rose-500", 
//             shadow: "shadow-rose-500/40", 
//             icon: <BiJoystick className="text-white text-4xl" />, 
//             path: "/driver-skills",
//             description: "One team controls their robot and tries to score as many points as possible within the time limit. Precision, speed, and strategy will make the difference!"

//           },
//           { 
//             title: "Autonomous Challenge", 
//             color: "bg-sky-500", 
//             shadow: "shadow-sky-500/40", 
//             icon: <FaLaptopCode className="text-white text-4xl" />,
//             path: "/autonomous",
//             description: "Robots must complete tasks and score points without any driver control. This round tests your programming skills and how well your robot can execute pre-planned commands!"

//           }
//         ].map((service, index) => (
//           <div 
//             key={index} 
//             onClick={() => handleClick(service.path)}
//             className="rounded-xl bg-white p-6 text-center shadow-xl h-96 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer">
//             <div className={`mx-auto flex h-20 w-20 -translate-y-12 transform items-center justify-center rounded-full ${service.color} ${service.shadow}` }>
//               {service.icon}
//             </div>
//             <h1 className="text-darken mb-3 text-xl font-medium lg:px-14">{service.title}</h1>

//             <p className="px-4 text-gray-500">{service.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MatchRounds;


import React from 'react';
import { BiJoystick } from "react-icons/bi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const MatchRounds = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="h-full min-h-screen w-full flex items-center justify-center p-8">
      <div className="grid gap-12 md:grid-cols-2 md:gap-8">
        {[ 
          { 
            title: "Teamwork Challenge", 
            color: "bg-teal-400", 
            shadow: "shadow-teal-500/40", 
            icon: <FontAwesomeIcon icon={faPeopleGroup} className="text-white text-4xl" />, 
            path: "/Dashboard/Judge/matches/teamwork",
            description: "Work together, win together! In this round, two teams collaborate to score as many points as possible within the time limit. Communication and strategy are key to achieving the highest combined score!"
          },
          { 
            title: "Skills Challenge", 
            color: "bg-rose-500", 
            shadow: "shadow-rose-500/40", 
            icon: <BiJoystick className="text-white text-4xl" />, 
            path: "/Dashboard/Judge/matches/skills",
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

export default MatchRounds;
