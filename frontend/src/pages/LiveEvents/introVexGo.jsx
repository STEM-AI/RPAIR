


import React from 'react';
import { BiJoystick } from "react-icons/bi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const IntroVexGO = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  const challenges = [
    { 
      title: "COOP Challenge", 
      color: "from-teal-400 to-emerald-500", 
      shadow: "shadow-teal-500/40", 
      icon: <FontAwesomeIcon icon={faPeopleGroup} className="text-white text-2xl" />, 
      path: "/LiveMatch/Coop",
      pattern: "teal"
    },
    { 
      title: "Skills Challenge", 
      color: "from-rose-500 to-pink-600", 
      shadow: "shadow-rose-500/40", 
      icon: <BiJoystick className="text-white text-2xl" />, 
      path: "/LiveMatch/Skills",
      pattern: "rose"
    }
  ];

  return (
    <div className="w-full p-8 md:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
       <Helmet>
                  <title>Live-vexGo</title>
            </Helmet>
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
              <motion.h2 
                className="mb-12 text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block mr-2">🚀</span> 
                VEX GO COMPETITION
                <span className="inline-block ml-2">⚡</span>
              </motion.h2>
        <div className="grid gap-8 md:grid-cols-2 md:gap-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                scale: 1.02
              }}
              onClick={() => handleClick(challenge.path)}
              className="relative rounded-2xl bg-white p-6 shadow-xl h-40 flex items-center justify-between cursor-pointer overflow-hidden group"
            >
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Title with icon */}
              <div className="flex items-center z-10">
                <motion.div 
                  className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${challenge.color} ${challenge.shadow} mr-4`}
                  whileHover={{ 
                    rotate: 10,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {challenge.icon}
                </motion.div>
                <motion.h1 
                  className="text-xl font-bold text-gray-800"
                  whileHover={{ scale: 1.03 }}
                >
                  {challenge.title}
                </motion.h1>
              </div>
              
              {/* Glow effect */}
              <div className={`absolute left-16 h-14 w-14 rounded-full ${challenge.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>

              {/* Arrow indicator */}
              <motion.div
                className="text-gray-400 text-2xl mr-2 z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                →
              </motion.div>
              
              {/* Decorative corner elements */}
              <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-${challenge.pattern}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-${challenge.pattern}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default IntroVexGO;