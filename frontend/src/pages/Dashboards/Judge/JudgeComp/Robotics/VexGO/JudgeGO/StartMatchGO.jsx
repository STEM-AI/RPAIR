// import { useNavigate } from 'react-router-dom';
// import { FaSearch, FaUsers, FaBook, FaMicrophone } from 'react-icons/fa';


// const cards = [
//   { title: 'Matches', icon: <FaUsers size={50} />, route: '/Dashboard/Judge/matchesGO', bg: 'bg-green-500' },
//   { title: 'Interview', icon: <FaMicrophone size={50} />, route: '/Dashboard/Judge/interviewGO', bg: 'bg-pink-500' },
// ];


// export default function StartMatchGO() {
//   const navigate = useNavigate();

//   return (
//     <div className="mx-auto text-center flex flex-col justify-center items-center">
//       <h2 className="mb-10 py-4  bg-clip-text text-blue-950
//         text-3xl sm:text-4xl lg:text-5xl font-black">
//         Welcome to VEX GO Challenge
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full ">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(card.route)}
//             className={`relative min-w-64 h-80 cursor-pointer rounded-2xl shadow-lg transition-all duration-500 hover:shadow-gray-300 overflow-hidden flex flex-col items-center justify-center ${card.bg} text-white`}
//           >
//             <div className="mb-4">{card.icon}</div>
//             <div className="text-xl font-semibold">{card.title}</div>
//             <button className="mt-4 px-6 py-2 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-300 transition-all">
//               Get Started
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { FaUsers, FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";
import Back from "../../../../../../../components/Back/Back"


const cards = [
  {
    title: "Matches",
    icon: <FaUsers size={50} />,
    route: "/Dashboard/Judge/matchesGO",
    bg: "from-green-400 to-blue-600",
  },
  {
    title: "Interview",
    icon: <FaMicrophone size={50} />,
    route: "/Dashboard/Judge/interviewGO",
    bg: "from-pink-400 to-yellow-600",
  },
];

export default function StartMatchGO() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto text-center flex flex-col items-center min-h-screen bg-gray-100">
      <Back/>
      <h2 className="mb-10 py-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700 text-4xl sm:text-5xl lg:text-6xl font-black">
        Welcome to VEX GO Challenge
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(card.route)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative min-w-64 h-80 cursor-pointer rounded-2xl shadow-lg transition-all duration-500 bg-gradient-to-br ${card.bg} text-white overflow-hidden flex flex-col items-center justify-center p-6`}
          >
            <div className="mb-4">{card.icon}</div>
            <div className="text-2xl font-bold">{card.title}</div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="mt-6 px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-300 transition-all"
            >
              Get Started
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
