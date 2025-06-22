
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../../../../assets/Static/logoWrite-re.png";
import { useResult } from '../../../../context/CompetitionContext';

const CompetitionResult = () => {
  const { competition } = useParams();
  
  const navigate = useNavigate();
  const { 
    score, 
    totalQuestions, 
    timeTakenInSeconds, 
    passed, 
    attempts 
  } = useResult();

  const minutes = Math.floor(timeTakenInSeconds / 60);
  const seconds = timeTakenInSeconds % 60;

  const resultData = {
    title: competition === "python" ? "Python" : "Tynker",
    description: competition === "python"
      ? "Test your Python programming skills with algorithmic challenges"
      : "Creative coding with block-based programming challenges",
    color: competition === "python"
      ? "from-cyan-500 to-cyan-700"
      : "from-cyan-500 to-cyan-700"
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background animation */}
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
          <div className="flex items-center justify-center gap-4 mb-6">
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
              {resultData.title} Result
            </motion.h1>
          </div>
          <motion.p
            className="text-lg text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {resultData.description}
          </motion.p>
        </motion.div>

        {/* Result Card */}
        <motion.div
          className="bg-gray-100 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-200 border-opacity-30"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultBox title="Questions Solved" value={`${score} / ${totalQuestions}`} />
            <ResultBox title="Time Taken" value={`${minutes}m ${seconds}s`} />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="text-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={() => navigate(`/competition/rank/${competition}`)}
            className={`px-8 py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r ${resultData.color} shadow-lg`}
          >
            Show Rank
          </button>
          <button
            onClick={() => navigate(`/`)}
            className="px-8 py-3 rounded-xl text-white font-bold text-lg bg-gray-600 hover:bg-gray-700 shadow-lg"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ResultBox = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
  </motion.div>
);

export default CompetitionResult;