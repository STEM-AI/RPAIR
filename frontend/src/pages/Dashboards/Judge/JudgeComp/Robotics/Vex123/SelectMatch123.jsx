import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUsers, FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";


const cards = [
  {
    title: "Matches",
    icon: <FaUsers size={50} />,
    route: "/Dashboard/Judge/matches123",
    bg: "from-green-400 to-blue-600",
  },
  {
    title: "Interview",
    icon: <FaMicrophone size={50} />,
    route: "/Dashboard/Judge/interview123",
    bg: "from-pink-400 to-yellow-600",  
  },
];

export default function SelectMatch123() {
  const navigate = useNavigate();
     const [searchParams] = useSearchParams();
  const eventName = searchParams.get('eventName');
  console.log("eventName", eventName);
  

  return (
    <div className="mx-auto text-center flex flex-col items-center min-h-screen bg-gray-100">
      <h2 className="mb-10 py-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700 text-4xl sm:text-5xl lg:text-6xl font-black">
        Welcome to VEX123 Challenge
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(`${card.route}?eventName=${encodeURIComponent(eventName)}`)}
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