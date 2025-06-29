
// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import logo from "../../../../assets/Static/logoWrite-re.png";

// const CompetitionFinal = () => {
//   const { competition } = useParams();
  
//   const navigate = useNavigate();
 



//   const Data = {
//     title: competition || "Programming Competition",
//     description:  `Thank you for participating in the ${competition} programming competition! Stay tuned — the results will be announced at the end`,
//     color: "from-cyan-500 to-cyan-700"
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 sm:p-8 relative overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Background animation */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         {[...Array(8)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full bg-cyan-100 opacity-10"
//             style={{
//               width: Math.random() * 300 + 100,
//               height: Math.random() * 300 + 100,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               x: [0, Math.random() * 100 - 50],
//               y: [0, Math.random() * 100 - 50],
//             }}
//             transition={{
//               duration: Math.random() * 20 + 10,
//               repeat: Infinity,
//               repeatType: "reverse",
//               ease: "easeInOut"
//             }}
//           />
//         ))}
//       </div>

//       <div className="max-w-4xl mx-auto relative z-10">
//         {/* Header */}
//         <motion.div
//           className="text-center mb-12 sm:mb-16"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//         >
//           <div className="flex items-center justify-center gap-4 mb-6">
//             <motion.img
//               src={logo}
//               alt="RPAIR Logo"
//               className="w-20 h-20 sm:w-24 sm:h-24"
//               initial={{ scale: 0.8, rotate: -5 }}
//               animate={{
//                 scale: 1,
//                 rotate: 0,
//                 transition: { type: 'spring', stiffness: 300 }
//               }}
//             />
//             <motion.h1
//               className="text-3xl pb-3 sm:text-4xl font-extrabold bg-gradient-to-r from-gray-50 to-gray-100 bg-clip-text text-transparent"
//             >
//               {Data.title} Compitition
//             </motion.h1>
//           </div>
//           <motion.p
//             className="text-lg text-gray-200 max-w-2xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             {Data.description}
//           </motion.p>
//         </motion.div>

       

//         {/* Actions */}
//         <motion.div
//           className="text-center space-x-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9 }}
//         >
//           <button
//             onClick={() => navigate(`/LiveProgramming/?eventName=${encodeURIComponent(competition)}`)}
//             className={`px-8 py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r ${Data.color} shadow-lg`}
//           >
//             Show Rank
//           </button>
//           <button
//             onClick={() => navigate(`/`)}
//             className="px-8 py-3 rounded-xl text-white font-bold text-lg bg-gray-600 hover:bg-gray-700 shadow-lg"
//           >
//             Back to Home
//           </button>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// const DataBox = ({ title, value }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.5 }}
//   >
//     <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
//     <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
//   </motion.div>
// );

// export default CompetitionFinal;


import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../../../../assets/Static/logoWrite-re.png";

const CompetitionFinal = () => {
  const { competition } = useParams();
  const navigate = useNavigate();

  const Data = {
    title: competition || "Programming Competition",
    description: `Thank you for participating in the ${competition} programming competition!`,
    resultsInfo: "The results will be announced at the end of the event.",
    color: "from-cyan-500 to-cyan-700"
  };

 

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-700 to-cyan-900 p-4 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced background animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-100 opacity-[0.08]"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="h-full mx-auto flex flex-col items-center justify-center relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 mt-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <motion.img
              src={logo}
              alt="RPAIR Logo"
              className="w-16 h-16 sm:w-20 sm:h-20"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.h1
              className="text-2xl pb-2 sm:text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Data.title} Competition
            </motion.h1>
          </motion.div>
          
          <motion.div
            className="relative inline-block"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-cyan-600/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-400/30 shadow-lg">
              <motion.p
                className="text-xl sm:text-2xl font-medium text-white mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Data.description}
              </motion.p>
              <motion.p
                className="text-cyan-100 max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {Data.resultsInfo}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

       
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/LiveProgramming/?eventName=${encodeURIComponent(competition)}`)}
            className={`px-6 py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r ${Data.color} shadow-lg hover:shadow-xl transition-shadow`}
          >
            Show Live Rankings
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/`)}
            className="px-6 py-3 rounded-xl text-white font-bold text-lg bg-cyan-800/70 hover:bg-cyan-800 shadow-lg hover:shadow-xl transition-shadow border border-cyan-600/50"
          >
            Back to Home
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute top-1/4 -right-20 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -left-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            delay: 1
          }}
        />
      </div>
    </motion.div>
  );
};


export default CompetitionFinal;