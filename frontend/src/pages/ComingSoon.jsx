// import React from 'react';
// import comingSo from '../assets/Static/comingsoon.webp';

// const ComingSoonPage = () => {
//   return (
//     <div
//       className="relative h-screen w-full flex items-center justify-center bg-cover bg-center text-center px-5"
//         style={{
//         backgroundImage: `url(${comingSo})`,
//       }}
//     >
//       <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-900 opacity-75"></div>

//       <div className="z-30 flex flex-col justify-center text-white w-full h-screen">
//         <h1 className="text-5xl">
//           We are <b>Almost</b> there!
//         </h1>
//         <p>Stay tuned for something amazing!!!</p>

//         <div className="mt-10 mb-5">
//           <div className="shadow w-full bg-white mt-2 max-w-2xl mx-auto rounded-full">
//             <div
//               className="rounded-full bg-cyan-600 text-xs leading-none text-center text-white py-1"
//               style={{ width: '75%' }}
//             >
//               75%
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// export default ComingSoonPage;


import React from 'react';
import comingSo from '../assets/Static/comingsoon.webp';

const ComingSoonPage = () => {
  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center text-center px-5"
      style={{
        backgroundImage: `url(${comingSo})`,
      }}
    >
      {/* Overlay with fade-in animation */}
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-900 opacity-75"></div>

      <div className="z-30 flex flex-col justify-center text-white w-full h-screen">
        {/* Title with staggered animation */}
        <h1 className="text-5xl opacity-0 animate-fadeInUp delay-100">
          We are <b className="text-cyan-400 animate-pulse">Almost</b> there!
        </h1>

        {/* Text with fade-in animation */}
        <p className="opacity-0 animate-fadeIn delay-300 mt-4">
          Stay tuned for something amazing!!!
        </p>

        {/* Progress bar with width animation */}
        <div className="mt-10 mb-5 opacity-0 animate-fadeIn delay-500">
          <div className="shadow w-full bg-white/20 mt-2 max-w-2xl mx-auto rounded-full overflow-hidden">
            <div
              className="rounded-full bg-cyan-600 text-xs leading-none text-center text-white py-1 animate-progressBar"
              style={{ width: '75%' }}
            >
              75%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;