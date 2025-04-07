

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../../../assets/Static/logoWrite-re.png";
import PythonLogo from "../../../../assets/gallery/Programming/logos/python-logo.png";
import TynkerLogo from "../../../../assets/gallery/Programming/logos/tynker-logo.png";

const ProgWelcome = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    hover: { 
      scale: 1.05,
      y: -5,
      boxShadow: "0 15px 30px -10px rgba(6, 182, 212, 0.3)"
    }
  };

  const cardContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleContinue = () => {
    if (selectedTopic) {
      navigate(`/competition/${selectedTopic.toLowerCase()}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 sm:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Animated background elements */}
        <motion.div 
          className="fixed inset-0 -z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-100 opacity-20"
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
        </motion.div>

        {/* Logo and Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >

            <motion.div 
              className="absolute inset-0 rounded-full bg-cyan-500 opacity-0 -z-10"
              animate={{
                opacity: [0, 0.1, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          </motion.div>
          
          {/* <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-50 to-cyan-100 bg-clip-text text-transparent mb-3 pb-3"
            variants={itemVariants}
          >
            Welcome to <span>
              
              
            <motion.img 
              src={logo} 
              alt="RPAIR Logo" 
              className="w-28 sm:w-32 mx-auto mb-6 drop-shadow-lg"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                transition: { type: 'spring', stiffness: 300 }
              }}
            />
              </span> Programming Competition
          </motion.h1> */}


<motion.div 
  className="flex items-center justify-center gap-4 mb-6"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.h1 
    className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-50 to-gray-100 bg-clip-text text-transparent flex items-center"
    variants={itemVariants}
  >
    Welcome to 
    <motion.span 
      className="relative mx-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.img 
        src={logo} 
        alt="RPAIR Logo" 
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-lg inline-block align-middle"
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          transition: { type: 'spring', stiffness: 300 }
        }}
      />
      <motion.div 
        className="absolute inset-0 rounded-full bg-cyan-500 opacity-0 -z-10"
        animate={{
          opacity: [0, 0.1, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
    </motion.span>
    Programming Competition
  </motion.h1>
</motion.div>
        
        </motion.div>

        {/* Topic Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Python Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={selectedTopic !== 'Python' ? "hover" : {}}
            onClick={() => handleTopicSelect('Python')}
            onMouseEnter={() => setIsHovering('Python')}
            onMouseLeave={() => setIsHovering(null)}
            className={`relative flex-1 max-w-xs sm:max-w-sm cursor-pointer rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300 flex flex-col items-center ${selectedTopic === 'Python' ? 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-400' : 'bg-white border border-gray-200'}`}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 mb-6 flex items-center justify-center relative">
              <motion.img 
                src={PythonLogo} 
                alt="Python Logo" 
                className="w-full h-full object-contain" 
                animate={{
                  scale: isHovering === 'Python' && selectedTopic !== 'Python' ? [1, 1.1, 1] : 1,
                  rotate: isHovering === 'Python' && selectedTopic !== 'Python' ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.6 }}
              />
              {isHovering === 'Python' && selectedTopic !== 'Python' && (
                <motion.div 
                  className="absolute -bottom-2 w-16 h-2 bg-cyan-200 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            
            <motion.h3 
              className="text-xl font-bold text-gray-800 mb-2"
              variants={cardContentVariants}
            >
              Python
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 text-center mb-4"
              variants={cardContentVariants}
            >
              Solve algorithmic challenges with Python
            </motion.p>
            
            <AnimatePresence>
              {selectedTopic === 'Python' && (
                <motion.div 
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <motion.span 
                    className="text-cyan-700 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Selected
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tynker Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={selectedTopic !== 'Tynker' ? "hover" : {}}
            onClick={() => handleTopicSelect('Tynker')}
            onMouseEnter={() => setIsHovering('Tynker')}
            onMouseLeave={() => setIsHovering(null)}
            className={`relative flex-1 max-w-xs sm:max-w-sm cursor-pointer rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300 flex flex-col items-center ${selectedTopic === 'Tynker' ? 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-400' : 'bg-white border border-gray-200'}`}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 mb-6 flex items-center justify-center relative">
              <motion.img 
                src={TynkerLogo} 
                alt="Tynker Logo" 
                className="w-full h-full object-contain" 
                animate={{
                  scale: isHovering === 'Tynker' && selectedTopic !== 'Tynker' ? [1, 1.1, 1] : 1,
                  rotate: isHovering === 'Tynker' && selectedTopic !== 'Tynker' ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.6 }}
              />
              {isHovering === 'Tynker' && selectedTopic !== 'Tynker' && (
                <motion.div 
                  className="absolute -bottom-2 w-16 h-2 bg-cyan-200 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            
            <motion.h3 
              className="text-xl font-bold text-gray-800 mb-2"
              variants={cardContentVariants}
            >
              Tynker
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 text-center mb-4"
              variants={cardContentVariants}
            >
              Creative coding with block-based programming
            </motion.p>
            
            <AnimatePresence>
              {selectedTopic === 'Tynker' && (
                <motion.div 
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <motion.span 
                    className="text-cyan-700 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Selected
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div
          className="text-center"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* <motion.button
            onClick={handleContinue}
            disabled={!selectedTopic}
            whileHover={selectedTopic ? { 
              scale: 1.05,
              boxShadow: "0 15px 30px -10px rgba(6, 182, 212, 0.4)"
            } : {}}
            whileTap={selectedTopic ? { scale: 0.98 } : {}}
            className={`relative px-10 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl shadow-md transition-all ${selectedTopic ? 'bg-gradient-to-r from-cyan-500 to-cyan-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {selectedTopic ? (
              <>
                <span>Start {selectedTopic} Competition</span>
                <motion.span
                  className="absolute -right-2 -top-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  GO!
                </motion.span>
              </>
            ) : (
              'Select a Topic'
            )}
            {selectedTopic && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-white opacity-0"
                animate={{
                  opacity: [0, 0.2, 0],
                  scale: [1, 1.05, 1.1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
           */}


<motion.button
  onClick={() => {
    if (selectedTopic === 'Python') {
      navigate('/python-competition'); // Your Python competition route
    } else if (selectedTopic === 'Tynker') {
      navigate('/tynker-competition'); // Your Tynker competition route
    }
  }}
  disabled={!selectedTopic}
  whileHover={selectedTopic ? { 
    scale: 1.05,
    boxShadow: "0 15px 30px -10px rgba(6, 182, 212, 0.4)"
  } : {}}
  whileTap={selectedTopic ? { scale: 0.98 } : {}}
  className={`relative px-10 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl shadow-md transition-all ${selectedTopic ? 'bg-gradient-to-r from-cyan-500 to-cyan-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
>
  {selectedTopic ? (
    <>
      <span>Start {selectedTopic} Competition</span>
      <motion.span
        className="absolute -right-2 -top-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        GO!
      </motion.span>
    </>
  ) : (
    'Select a Topic'
  )}
  {selectedTopic && (
    <motion.div
      className="absolute inset-0 rounded-xl bg-white opacity-0"
      animate={{
        opacity: [0, 0.2, 0],
        scale: [1, 1.05, 1.1]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )}
</motion.button>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgWelcome