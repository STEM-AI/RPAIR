import { useNavigate } from 'react-router-dom';

export default function Back() {
  const navigate = useNavigate();

  return (
    <div >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed bottom-8 left-2 lg:left-72 z-50 flex h-12 w-12 items-center justify-center rounded-full
         bg-white shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:bottom-12 sm:right-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

    </div>
  );
};



// import { useNavigate } from 'react-router-dom';

// export default function Back() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <button
//         onClick={() => navigate(-1)}
//         aria-label="Go back"
//         className="fixed bottom-6 left-36 md:bottom-8 md:left-8 z-50 
//         flex h-14 w-14 items-center justify-center rounded-full 
//         bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg 
//         transition-all duration-300 hover:scale-105 hover:shadow-xl 
//         hover:from-blue-600 hover:to-blue-700 focus:outline-none 
//         focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-8 w-8 text-white transform -translate-x-0.5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };
