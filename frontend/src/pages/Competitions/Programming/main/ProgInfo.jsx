
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../../../assets/Static/logoWrite-re.png";

const ProgInfo = () => {
  const { competition } = useParams();
  console.log("Competition:", competition);
  
  const navigate = useNavigate();

  // Competition details based on competition type
  const competitionDetails = {
    python: {
      questions: 14,
      score: 125,
      time: 6,
      title: "Python",
      description: "Test your Python programming skills with algorithmic challenges",
      color: "from-emerald-500 to-emerald-700"
    },
    tynker: {
      questions: 10,
      score: 100,
      time: 8,
      title: "Tynker",
      description: "Creative coding with block-based programming challenges",
      color: "from-cyan-500 to-cyan-700"
    }
  };

  const details = competitionDetails[competition] || competitionDetails.python;

  const handleStartCompetition = () => {
    navigate(`/competition/${competition}`);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements - kept as requested */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-100 opacity-10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div className="flex items-center justify-center gap-4 mb-6">
            <motion.img 
              src={logo} 
              alt="RPAIR Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                transition: { type: 'spring', stiffness: 300 }
              }}
            />
            <motion.h1 
              className="text-3xl pb-3 sm:text-4xl font-extrabold bg-gradient-to-r from-gray-50 to-gray-100 bg-clip-text text-transparent"
            >
              {details.title} Competition
            </motion.h1>
          </motion.div>
          <motion.p 
            className="text-lg text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {details.description}
          </motion.p>
        </motion.div>

        {/* Competition Info Card */}
        <motion.div 
          className="bg-gray-100 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-200 border-opacity-30"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Selected Competition Topic</h3>
              <div className="flex items-center mt-3">
                <motion.p 
                  className="text-2xl font-bold text-cyan-700"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                >
                  {details.title}
                </motion.p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Questions to attempt</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{details.questions}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total score</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{details.score} points</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Time limit</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">{details.time} minutes</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Attempts allowed</h3>
                <p className="text-2xl font-bold text-gray-800 mt-2">2</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={handleStartCompetition}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(6, 182, 212, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-12 py-4 rounded-xl font-bold text-2xl text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80    text-center me-2 mb-2 `}
          >
            Start Competition

            <motion.div
              className="absolute inset-0 rounded-xl bg-white opacity-0"
              animate={{
                opacity: [0, 0.2, 0],
                scale: [1, 1.05, 1.1]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
          </motion.button>

          <motion.p 
            className="mt-6 text-gray-200 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            You'll have {details.time} minutes to complete all {details.questions} questions
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgInfo;