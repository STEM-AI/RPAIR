import { useNavigate } from "react-router-dom";
import { FaUsers, FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Matches",
    icon: <FaUsers size={50} />,
    route: "/Dashboard/Judge/matches123",
    bg: "from-purple-500 to-indigo-600",
  },
  {
    title: "Interview",
    icon: <FaMicrophone size={50} />,
    route: "/Dashboard/Judge/interview123",
    bg: "from-teal-400 to-cyan-600",  
  },
];

export default function SelectMatch123() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto text-center flex flex-col items-center min-h-screen bg-gray-100">
      <h2 className="mb-10 py-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-800 text-4xl sm:text-5xl lg:text-6xl font-black">
        Welcome to VEX123 Challenge
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
              className={`mt-6 px-6 py-3 bg-white font-bold rounded-full transition-all ${
                card.title === "Interview" 
                  ? "text-cyan-700 hover:bg-cyan-100" 
                  : "text-purple-800 hover:bg-purple-100"
              }`}
            >
              Get Started
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}