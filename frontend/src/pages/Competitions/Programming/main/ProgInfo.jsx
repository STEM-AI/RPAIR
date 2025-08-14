
import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../../../../assets/Static/logoWrite-re.png";
import useInfoQuestions from '../../../../hooks/Questions/InfoQuestion';
import useGameID from '../../../../hooks/GameID';

const ProgInfo = () => {
  // All hooks moved to the top level
  const { competition } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const event_id = id;
  const type = searchParams.get('eventName');
  const team_id = searchParams.get('teamId');

  const { 
    questions: allQuestions, 
    loading: allLoading, 
    error: allError 
  } = useInfoQuestions(id, competition);
  
  const { 
    GameID, 
    loading: gameIdLoading, 
    error: gameIdError 
  } = useGameID(team_id, event_id, "programming");

  const completed = GameID?.completed;
  
  

  // Handle loading state
  if (allLoading || gameIdLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-300"></div>
      </motion.div>
    );
  }
  
  // Handle error state
  if (allError || gameIdError) {
    const errorMessage = allError || gameIdError;
    
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white bg-opacity-90 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </motion.div>
    );
  }

  const competitionDetails = {
    questions: allQuestions.number_of_questions,
    score: allQuestions.number_of_questions,
    time: (allQuestions.time_limit) / 60,
    title: type,
    description: `Test your ${type} programming skills with algorithmic challenges`,
    color: "from-emerald-500 to-emerald-700"
  };

  const details = competitionDetails;
  const isCompetitionStarted = !!GameID?.id;

  const handleStartCompetition = () => {
    navigate(`/competition/${type}/${GameID.id}?id=${encodeURIComponent(id)}`);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
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
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider"> Competition Topic - <span className="text-cyan-700 text-2xl">Game: {GameID.id}</span></h3>
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
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Number Of Questions </h3>
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
            </div>
          </div>
        </motion.div>
        
        {/* Start Button Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >

          {completed ? (
            <div className="text-center">
              <motion.h2 
                className="text-2xl font-bold text-cyan-600 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Competition Completed!
              </motion.h2>
            </div>
          ) : (isCompetitionStarted ? (
            <div className="relative inline-block">
              <motion.button
                onClick={handleStartCompetition}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px -10px rgba(6, 182, 212, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 rounded-xl font-bold text-2xl text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 shadow-xl shadow-cyan-500/50 text-center transition-all duration-300 cursor-pointer z-10"
              >
                Start Competition
                <motion.span
                  className="absolute inset-0 rounded-xl bg-white"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.1, 1.2]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
              </motion.button>
              
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-cyan-400/80"
                  initial={{ 
                    width: "6px", 
                    height: "6px",
                    opacity: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -20],
                    x: [0, (i % 2 === 0 ? -1 : 1) * 30]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  style={{
                    top: "50%",
                    left: "50%",
                    translateX: "-50%",
                    translateY: "-50%"
                  }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 border border-cyan-500/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4 
                  }}
                  className="mb-6"
                >
                  <ClockIcon className="h-16 w-16 text-cyan-400" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-cyan-50 mb-4">
                  Competition Not Started Yet
                </h3>
                
                <p className="text-cyan-100/80 mb-6 max-w-md text-center">
                  The competition will begin soon. Prepare yourself for
                  <span className="font-semibold text-cyan-300"> {details.questions} challenges </span> 
                  with a time limit of 
                  <span className="font-semibold text-cyan-300"> {details.time} minutes</span>.
                </p>
                
                <div className="bg-cyan-900/30 rounded-xl px-6 py-3 border border-cyan-500/30">
                  <span className="text-cyan-100 font-medium">Current Status: </span>
                  <span className="ml-2 font-semibold text-amber-400 animate-pulse">
                    Waiting to Start
                  </span>
                </div>
              </div>
            </motion.div>
          )
          )}
          

          <motion.p 
            className="mt-6 text-cyan-100/90 text-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {isCompetitionStarted ? (
              <>
                <span className="font-semibold text-cyan-300">{details.time} minute time limit</span> for 
                <span className="font-semibold text-cyan-300"> {details.questions} challenges</span>
              </>
            ) : (
              "Stay tuned - The competition will begin shortly"
            )}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ClockIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
);

export default ProgInfo;