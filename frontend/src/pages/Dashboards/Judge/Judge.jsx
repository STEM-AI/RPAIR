


// import { useNavigate } from 'react-router-dom';
// import interviewPic from '../../../assets/imgs/dashboards/interview.jpg';
// import inspectionPic from '../../../assets/imgs/dashboards/inspection.jpg';
// import matchesPic from '../../../assets/imgs/dashboards/matches.png';
// import engNotePic from '../../../assets/imgs/dashboards/engNotebook.jpg';

// const cards = [
//   { title: 'Inspection', image: inspectionPic, route: '/inspection' },
//   { title: 'Matches', image: matchesPic, route: '/matches' },
//   { title: 'Engineering Notebook', image: engNotePic, route: '/notebook' },
//   { title: 'Interview', image: interviewPic, route: '/interview' },
// ];

// export default function JudgeDashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="mx-auto mt-16 text-center p-6">
//       <h2 className="mb-6 py-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 
//         text-3xl sm:text-4xl lg:text-5xl font-black">
//         Welcome to VEX IQ Event 27/Feb
//       </h2>
//       <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(card.route)}
//             className="relative w-80 h-96 cursor-pointer group rounded-xl shadow-lg transition-all duration-500 hover:shadow-gray-300 bg-white overflow-hidden"
//             style={{ backgroundImage: `url(${card.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//           >
//             <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-white">
//               <h4 className="text-3xl font-bold text-center leading-snug">{card.title}</h4>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useNavigate } from 'react-router-dom';
import interviewPic from '../../../assets/imgs/dashboards/interview.jpg';
import inspectionPic from '../../../assets/imgs/dashboards/inspection.jpg';
import matchesPic from '../../../assets/imgs/dashboards/matches.png';
import engNotePic from '../../../assets/imgs/dashboards/engNotebook.jpg';


const cards = [
  { title: 'Inspection', image: inspectionPic, route: '/Dashboard/Judge/inspection' },
  { title: 'Matches', image: matchesPic, route: '/Dashboard/Judge/matches' },
  { title: 'Engineering Notebook', image: engNotePic, route: '/Dashboard/Judge/notebook' },
  { title: 'Interview', image: interviewPic, route: '/Dashboard/Judge/interview' },
];

export default function JudgeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto mt-16 text-center p-6  min-h-screen  bg-gradient-to-r from-cyan-800 to-cyan-700 ">
      <h2 className="mb-10 py-4 tracking-tight bg-clip-text text-white 
        text-3xl sm:text-4xl lg:text-5xl font-black">
        Welcome to VEX IQ Event 27/Feb
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className="relative cursor-pointer group rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105 backdrop-blur-md bg-white/10 border border-white/30 overflow-hidden flex flex-col items-center p-4"
          >
            <div className="w-64 h-64 overflow-hidden rounded-xl">
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div className="mt-4 text-white text-center">
              <h4 className="text-2xl font-bold drop-shadow-lg">{card.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import interviewPic from '../../../assets/imgs/dashboards/interview.jpg';
// import inspectionPic from '../../../assets/imgs/dashboards/inspection.jpg';
// import matchesPic from '../../../assets/imgs/dashboards/matches.png';
// import engNotePic from '../../../assets/imgs/dashboards/engNotebook.jpg';


// const cards = [
//   { title: 'Inspection', image: inspectionPic, route: '/inspection' },
//   { title: 'Matches', image: matchesPic, route: '/matches' },
//   { title: 'Engineering Notebook', image: engNotePic, route: '/notebook' },
//   { title: 'Interview', image: interviewPic, route: '/interview' },
// ];

// export default function JudgeDashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="mx-auto mt-16 text-center p-6 min-h-screen flex flex-col items-center justify-center">
//       <h2 className="mb-10 py-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 
//         text-3xl sm:text-4xl lg:text-5xl font-black">
//         Welcome to VEX IQ Event 27/Feb
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(card.route)}
//             className="relative w-64 h-80 cursor-pointer rounded-2xl shadow-lg transition-all duration-500 hover:shadow-gray-300 bg-gray-800 overflow-hidden"
//           >
//             <img src={card.image} alt={card.title} className="w-full h-56 object-cover rounded-t-2xl" onError={(e) => e.target.style.display = 'none'} />
//             <div className="w-full py-4 bg-black bg-opacity-70 text-white text-xl font-semibold text-center rounded-b-2xl">{card.title}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




// import { useNavigate } from 'react-router-dom';
// import { FaSearch, FaUsers, FaBook, FaMicrophone } from 'react-icons/fa';

// const cards = [
//   { title: 'Inspection', icon: <FaSearch size={50} />, route: '/inspection', bg: 'bg-blue-500' },
//   { title: 'Matches', icon: <FaUsers size={50} />, route: '/matches', bg: 'bg-green-500' },
//   { title: 'Engineering Notebook', icon: <FaBook size={50} />, route: '/notebook', bg: 'bg-yellow-500' },
//   { title: 'Interview', icon: <FaMicrophone size={50} />, route: '/interview', bg: 'bg-red-500' },
// ];

// export default function JudgeDashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="mx-auto mt-6 text-center p-6 min-h-screen flex flex-col items-center justify-center">
//       <h2 className="mb-10 py-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-700 
//         text-3xl sm:text-4xl lg:text-5xl font-black">
//         Welcome to VEX IQ Event 27/Feb
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(card.route)}
//             className={`relative w-56 h-96 cursor-pointer rounded-2xl shadow-lg transition-all duration-500 hover:shadow-gray-300 overflow-hidden flex flex-col items-center justify-center ${card.bg} text-white`}
//           >
//             <div className="mb-4">{card.icon}</div>
//             <div className="text-xl font-semibold">{card.title}</div>
//             <button className="mt-4 px-6 py-2 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-300 transition-all">
//               View More
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
