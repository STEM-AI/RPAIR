

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import vexGoLogo from '../../assets/imgs/dashboards/vex-go-logo.webp';
// import vexGo from '../../assets/imgs/dashboards/vex-go.webp';
// import vexIqLogo from '../../assets/imgs/dashboards/vex-iq-logo.webp';
// import vexIq from '../../assets/imgs/dashboards/vexiq.webp';

// const roboticsKits = [
//   {
//     id: 1,
//     name: 'VEX GO',
//     image: vexGo,
//     logo: vexGoLogo,
//     bgColor: 'bg-vexGo',
//     textColor: 'text-teal-900',
//     path: '/VexGoEvents',

//   },
//   {
//     id: 2,
//     name: 'VEX IQ',
//     image: vexIq,
//     logo: vexIqLogo,
//     bgColor: 'bg-vexIq',
//     textColor: 'text-blue-900',
//     path: '/VexIqEvents',

//   },
// ];

// function UADashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="p-6 flex flex-col items-center">
//       <h2 className="mb-6 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-4xl font-extrabold">
//         Live & Upcoming Competitions
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
//         {roboticsKits.map((kit) => (
//           <div 
//             key={kit.id} 
//             className={`p-4 w-96 rounded-xl shadow-lg flex flex-col items-center ${kit.bgColor} cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl`}>
            
//             <img src={kit.logo} alt={`${kit.name} Logo`} className="mb-3 w-60 h-32 object-contain" />
//             <img src={kit.image} alt={kit.name} className="w-full h-40 object-cover rounded-md mb-4" />
            



//             <button 
//               onClick={() => navigate(kit.path)}
//               className="mt-auto bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-200">
//               View Events
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default UADashboard;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import vexGoLogo from '../../assets/imgs/dashboards/vex-go-logo.webp';
// import vexGo from '../../assets/imgs/dashboards/vex-go.webp';
// import vexIqLogo from '../../assets/imgs/dashboards/vex-iq-logo.webp';
// import vexIq from '../../assets/imgs/dashboards/vexiq.webp';

// const roboticsKits = [
//   {
//     id: 1,
//     name: 'VEX GO',
//     image: vexGo,
//     logo: vexGoLogo,
//     bgColor: 'bg-vexGo',
//     textColor: 'text-teal-900',
//     path: 'VexGoEvents',
//   },
//   {
//     id: 2,
//     name: 'VEX IQ',
//     image: vexIq,
//     logo: vexIqLogo,
//     bgColor: 'bg-vexIq',
//     textColor: 'text-blue-900',
//     path: 'VexIqEvents',
//   },
// ];

// function UADashboard() {
//   const navigate = useNavigate();

//   const handleNavigation = (kit) => {
//     const userRole = localStorage.getItem('user_role'); // جلب دور المستخدم
//     navigate(`Dashboard/Event/${kit.path}`, { state: { competition_name: kit.name, userRole } });
//   };

//   return (
//     <div className="p-6 flex flex-col items-center">
//       <h2 className="mb-6 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-4xl font-extrabold">
//         Live & Upcoming Competitions
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
//         {roboticsKits.map((kit) => (
//           <div 
//             key={kit.id} 
//             className={`p-4 w-96 rounded-xl shadow-lg flex flex-col items-center ${kit.bgColor} cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl`}
//             onClick={() => handleNavigation(kit)}
//           >
//             <img src={kit.logo} alt={`${kit.name} Logo`} className="mb-3 w-60 h-32 object-contain" />
//             <img src={kit.image} alt={kit.name} className="w-full h-40 object-cover rounded-md mb-4" />
//             <button 
//               className="mt-auto bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-200">
//               View Events
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default UADashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import vexGoLogo from '../../assets/imgs/dashboards/vex-go-logo.webp';
import vexGo from '../../assets/imgs/dashboards/vex-go.webp';
import vexIqLogo from '../../assets/imgs/dashboards/vex-iq-logo.webp';
import vexIq from '../../assets/imgs/dashboards/vexiq.webp';

const roboticsKits = [
  {
    id: 1,
    name: 'VEX GO',
    image: vexGo,
    logo: vexGoLogo,
    bgColor: 'bg-vexGo',
    textColor: 'text-teal-900',
  },
  {
    id: 2,
    name: 'VEX IQ',
    image: vexIq,
    logo: vexIqLogo,
    bgColor: 'bg-vexIq',
    textColor: 'text-blue-900',
  },
];

function UADashboard() {
  const navigate = useNavigate();

  const handleNavigation = (kit) => {
    const userRole = localStorage.getItem('user_role'); 
    const snakeCaseName = kit.name.toLowerCase().replace(/\s+/g, '_'); // تحويل الاسم إلى snake case
    navigate(`/Dashboard/Event/${snakeCaseName}`, { state: { competition_name: kit.name, userRole } });
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="mb-6 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-4xl font-extrabold">
        Live & Upcoming Competitions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
        {roboticsKits.map((kit) => (
          <div 
            key={kit.id} 
            className={`p-4 w-96 rounded-xl shadow-lg flex flex-col items-center ${kit.bgColor} cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl`}
            onClick={() => handleNavigation(kit)}
          >
            <img src={kit.logo} alt={`${kit.name} Logo`} className="mb-3 w-60 h-32 object-contain" />
            <img src={kit.image} alt={kit.name} className="w-full h-40 object-cover rounded-md mb-4" />
            <button 
              className="mt-auto bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-200">
              View Events
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UADashboard;
