// import React from 'react'

// const MatchRounds = () => {
//     return (
//       <div className="h-full min-h-screen w-full mt-16 pt-12 p-4">
//         <div className="grid gap-14 md:grid-cols-3 md:gap-5">
//           {[ 
//             { 
//               title: "TREE AND SHRUB PRUNING", 
//               color: "bg-teal-400", 
//               shadow: "shadow-teal-500/40", 
//               svg: "M24.75 23H8.25V28.75H24.75V23ZM32.3984 9.43359...", 
//             },
//             { 
//               title: "IRRIGATION & DRAINAGE", 
//               color: "bg-rose-500", 
//               shadow: "shadow-rose-500/40", 
//               svg: "M12 0C11.0532 0 10.2857 0.767511 10.2857 1.71432V5.14285H13.7142...", 
//             },
//             { 
//               title: "LANDSCAPE LIGHTING", 
//               color: "bg-sky-500", 
//               shadow: "shadow-sky-500/40", 
//               svg: "M8.25 19.25C11.2836 19.25 13.75 16.7836 13.75 13.75C13.75 10.7164...", 
//             }
//           ].map((service, index) => (
//             <div key={index} className="rounded-xl bg-white p-6 text-center shadow-xl">
//               <div className={`mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full ${service.color} ${service.shadow}` }>
//                 <svg viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white">
//                   <path d={service.svg} fill="white"></path>
//                 </svg>
//               </div>
//               <h1 className="text-darken mb-3 text-xl font-medium lg:px-14">{service.title}</h1>
//               <p className="px-4 text-gray-500">
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo iure inventore amet modi accusantium vero perspiciatis, incidunt dicta sed aspernatur!
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   export default MatchRounds;


import React from 'react';
import { BiJoystick } from "react-icons/bi";
import { FaLaptopCode } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const MatchRounds = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="h-full min-h-screen w-full  p-4 flex items-center justify-center">
      <div className="grid gap-14 md:grid-cols-3 md:gap-5">
        {[ 
          { 
            title: "Teawork", 
            color: "bg-teal-400", 
            shadow: "shadow-teal-500/40", 
            icon: <i className="fa-solid fa-people-group text-white text-2xl"></i>,
            path: "/teawork"
          },
          { 
            title: "Driver Skills", 
            color: "bg-rose-500", 
            shadow: "shadow-rose-500/40", 
            icon: <BiJoystick className="text-white text-2xl" />, 
            path: "/driver-skills"
          },
          { 
            title: "Autonomous", 
            color: "bg-sky-500", 
            shadow: "shadow-sky-500/40", 
            icon: <FaLaptopCode className="text-white text-2xl" />,
            path: "/autonomous"
          }
        ].map((service, index) => (
          <div 
            key={index} 
            onClick={() => handleClick(service.path)}
            className="rounded-xl bg-white p-6 text-center shadow-xl h-72 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105 cursor-pointer">
            <div className={`mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full ${service.color} ${service.shadow}` }>
              {service.icon}
            </div>
            <h1 className="text-darken mb-3 text-xl font-medium lg:px-14">{service.title}</h1>
            <p className="px-4 text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo iure inventore amet modi accusantium vero perspiciatis, incidunt dicta sed aspernatur!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchRounds;
