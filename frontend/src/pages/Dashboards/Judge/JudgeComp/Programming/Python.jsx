// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useParams, useSearchParams } from 'react-router-dom';

// export default function Python() {
//     const [searchParams] = useSearchParams();
//     const id = searchParams.get('eventName');
//   const [numberOfQuestions, setNumberOfQuestions] = useState('');
//   const [timeLimit, setTimeLimit] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const addNumOfQuestions = async (event) => {
//     event.preventDefault();
    
//     if (!numberOfQuestions || !timeLimit) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Missing Information',
//         text: 'Please enter the number of questions',
//       });
//       return;
//     }

//     setIsLoading(true);
//     const token = localStorage.getItem('access_token');

//     try {
//       // NOTE: Remember to replace {id} with actual competition ID
//       await axios.patch(
//         `${process.env.REACT_APP_API_URL}/programming/number-of-questions-time-limit/${id}/`,
//         {
//           number_of_questions: numberOfQuestions,
//           time_limit: timeLimit
//          },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: 'Number of questions added successfully!',
//         showConfirmButton: false,
//         timer: 2000
//       });
      
//       setNumberOfQuestions('');
//       setTimeLimit('');
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to add questions';
//       Swal.fire({
//         icon: 'error',
//         title: 'Operation Failed',
//         text: errorMessage,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <div className="mb-6 text-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Programming Competition Setup</h2>
//         <p className="text-gray-600">Set the number of questions </p>
//       </div>
      
//       <form onSubmit={addNumOfQuestions}>
//         <div className="mb-6">
//           <label
//             htmlFor="number_of_questions"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Number of Questions
//           </label>
//           <div className="relative">
//             <input
//               type="number"
//               id="number_of_questions"
//               name="number_of_questions"
//               value={numberOfQuestions}
//               onChange={(e) => setNumberOfQuestions(e.target.value)}
//               min="1"
//               max="100"
//               className="w-full py-3 px-4 pl-11 pr-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
//               placeholder="Enter number of questions"
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
         
//         </div>
//         <div className="mb-6">
//           <label
//             htmlFor="number_of_questions"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//            Time Limit
//           </label>
//           <div className="relative">
//             <input
//               type="number"
//               id="time_limit"
//               name="time_limit"
//               value={timeLimit}
//               onChange={(e) => setTimeLimit(e.target.value)}
          
//               className="w-full py-3 px-4 pl-11 pr-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
//               placeholder="Enter Time Limit"
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
         
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 flex items-center justify-center
//                     ${isLoading
//                       ? 'bg-blue-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'}`}
//         >
//           {isLoading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : (
//             <>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//               </svg>
//               Add Questions
//             </>
//           )}
//         </button>
//       </form>
      
      
//     </div>
//   );
// }


import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';

export default function Python() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('eventName');
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [timeUnit, setTimeUnit] = useState('minutes'); // default to minutes
    const [isLoading, setIsLoading] = useState(false);

    const convertToSeconds = (value, unit) => {
        switch (unit) {
            case 'seconds':
                return parseInt(value);
            case 'minutes':
                return parseInt(value) * 60;
            case 'hours':
                return parseInt(value) * 3600;
            default:
                return parseInt(value) * 60; // default to minutes
        }
    };

    const addNumOfQuestions = async (event) => {
        event.preventDefault();
        
        if (!numberOfQuestions || !timeLimit) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please enter both the number of questions and time limit',
            });
            return;
        }

        if (numberOfQuestions <= 0 || timeLimit <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Values must be greater than zero',
            });
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem('access_token');
        const timeLimitInSeconds = convertToSeconds(timeLimit, timeUnit);

        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/programming/number-of-questions-time-limit/${id}/`,
                {
                    number_of_questions: numberOfQuestions,
                    time_limit: timeLimitInSeconds
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Competition parameters set successfully!',
                showConfirmButton: false,
                timer: 2000
            });
            
            setNumberOfQuestions('');
            setTimeLimit('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update competition parameters';
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Programming Competition Setup</h2>
                <p className="text-gray-600">Configure competition parameters</p>
            </div>
            
            <form onSubmit={addNumOfQuestions}>
                <div className="mb-6">
                    <label 
                        htmlFor="number_of_questions" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Number of Questions
                    </label>
                    <div className="relative">
                        <input 
                            type="number"
                            id="number_of_questions"
                            name="number_of_questions"
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(e.target.value)}
                            min="1"
                            max="100"
                            className="w-full py-3 px-4 pl-11 pr-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                            placeholder="Enter number of questions"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label 
                        htmlFor="time_limit" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Time Limit
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="number"
                                id="time_limit"
                                name="time_limit"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(e.target.value)}
                                min="1"
                                className="w-full py-3 px-4 pl-11 pr-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                                placeholder="Enter time limit"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <select
                            value={timeUnit}
                            onChange={(e) => setTimeUnit(e.target.value)}
                            className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                        >
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                        </select>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        {timeLimit ? `Total time:    ${timeLimit + timeUnit}==${convertToSeconds(timeLimit, timeUnit)} seconds` : ''}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 flex items-center justify-center
                                ${isLoading 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'}`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Set Competition Parameters
                        </>
                    )}
                </button>
            </form>   
        </div>
    );
}