

// import React, { useState, useRef, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import Swal from 'sweetalert2';
// import logo from "../../../../assets/Static/logoWrite-re.png";
// import CircularTimer from "../../../../components/Timer/CircularTimer";
// import { useResult } from '../../../../context/CompetitionContext';

// const CompetitionPage = () => {
//   const { competition } = useParams();
//   const navigate = useNavigate();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const { updateResults, incrementAttempts } = useResult();
//   const startTime = useRef(Date.now());

//   // Python Questions with code snippets
//   const pythonQuestions = [
//     {
//       id: 1,
//       question: "What is the output of this code?",
//       options: [
//         { id: 'a', text: "21" },
//         { id: 'b', text: "777" },
//         { id: 'c', text: "37" },
//         { id: 'd', text: "Error" }
//       ],
//       correctAnswer: 'b',
//       type: 'single',
//       code: "print(3 * '7')"
//     },
//     {
//       id: 2,
//       question: "What will be printed?",
//       options: [
//         { id: 'a', text: "[1]" },
//         { id: 'b', text: "[2]" },
//         { id: 'c', text: "[2, 3]" },
//         { id: 'd', text: "[1, 2]" }
//       ],
//       correctAnswer: 'c',
//       type: 'single',
//       code: "print([1, 2, 3][1:])"
//     },
//     // Add the remaining 13 Python questions here...
//   ];

//   // Tynker Questions
//   const tynkerQuestions = [
//     {
//       id: 1,
//       question: "What is the purpose of the 'when flag clicked' block in Tynker?",
//       options: [
//         { id: 'a', text: "To start the program when the green flag is clicked" },
//         { id: 'b', text: "To create a conditional statement" },
//         { id: 'c', text: "To define a function" },
//         { id: 'd', text: "To stop the program" }
//       ],
//       correctAnswer: 'a',
//       type: 'single'
//     },
//     // Add the remaining 14 Tynker questions here...
//   ];

//   // Select questions based on competition type
//   const questions = competition === 'python' ? pythonQuestions : tynkerQuestions;
//   const currentQuestion = questions[currentQuestionIndex];

//   useEffect(() => {
//     incrementAttempts();
//   }, []);

//   const calculateResults = () => {
//     const endTime = Date.now();
//     const timeTakenInSeconds = Math.floor((endTime - startTime.current) / 1000);

//     const correctAnswers = questions.reduce((count, q) => {
//       const userAnswer = selectedOptions[q.id];
//       const isCorrect = userAnswer === q.correctAnswer;
//       return count + (isCorrect ? 1 : 0);
//     }, 0);

//     const totalQuestions = questions.length;
//     const passed = correctAnswers >= Math.ceil(totalQuestions * 0.6);

//     return {
//       score: correctAnswers,
//       totalQuestions,
//       timeTakenInSeconds,
//       passed,
//       answers: selectedOptions,
//       questions
//     };
//   };

//   const handleTimeUp = () => {
//     const results = calculateResults();
//     updateResults(results);

//     Swal.fire({
//       icon: 'error',
//       title: 'Time\'s up!',
//       text: 'The competition has ended.',
//       confirmButtonText: 'See Results',
//     }).then(() => {
//       navigate(`/competition/${competition}/results`);
//     });
//   };

//   const handleOptionSelect = (questionId, optionId, isMultiple = false) => {
//     setSelectedOptions(prev => {
//       if (isMultiple) {
//         return {
//           ...prev,
//           [questionId]: prev[questionId]
//             ? prev[questionId].includes(optionId)
//               ? prev[questionId].filter(id => id !== optionId)
//               : [...prev[questionId], optionId]
//             : [optionId]
//         };
//       }
//       return { ...prev, [questionId]: optionId };
//     });
//   };

//   const handleNext = () => {
//     const allAnswered = questions.every(q => selectedOptions[q.id]);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       if (!allAnswered) {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Incomplete',
//           text: 'Please answer all questions before submitting.',
//         });
//         return;
//       }

//       Swal.fire({
//         title: 'Are you sure?',
//         text: "You are about to submit your answers.",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, submit it!'
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const results = calculateResults();
//           updateResults(results);

//           Swal.fire({
//             title: 'Done!',
//             text: `You answered ${results.score} out of ${results.totalQuestions} correctly.`,
//             icon: 'success',
//             confirmButtonText: 'OK'
//           }).then(() => {
//             navigate(`/competition/${competition}/results`);
//           });
//         }
//       });
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-cyan-700 text-white p-6 flex flex-col justify-between">
//         <div>
//           <img src={logo} alt="Logo" className="w-28 mb-6 flex mx-auto" />
//           <div className="flex justify-center mb-4">
//             <CircularTimer
//               duration={1 * 60}
//               onEnd={handleTimeUp}
//               current={currentQuestionIndex + 1}
//               total={questions.length}
//             />
//           </div>

//           <div>
//             <h4 className="font-semibold mb-2">Questions</h4>
//             <ul className="space-y-2">
//               {questions.map((q, i) => (
//                 <li
//                   key={q.id}
//                   onClick={() => setCurrentQuestionIndex(i)}
//                   className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${i === currentQuestionIndex ? 'bg-white text-cyan-700' : selectedOptions[q.id] ? 'bg-cyan-900' : 'hover:bg-cyan-600'}`}
//                 >
//                   {i + 1}. {q.question.substring(0, 20)}...
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-8 bg-gray-50">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentQuestion.id}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             className="bg-white shadow-xl rounded-2xl p-6"
//           >
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {currentQuestionIndex + 1}. {currentQuestion.question}
//             </h2>
            
//             {/* Simple code display without external dependencies */}
//             {currentQuestion.code && (
//               <div className="mb-6 p-4 bg-gray-800 text-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
//                 <pre className="whitespace-pre-wrap">{currentQuestion.code}</pre>
//               </div>
//             )}

//             <div className="space-y-3">
//               {currentQuestion.options.map(option => (
//                 <div
//                   key={option.id}
//                   onClick={() => handleOptionSelect(currentQuestion.id, option.id, currentQuestion.type === 'multiple')}
//                   className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                     selectedOptions[currentQuestion.id] === option.id ||
//                     (Array.isArray(selectedOptions[currentQuestion.id]) && selectedOptions[currentQuestion.id].includes(option.id))
//                       ? 'border-cyan-500 bg-cyan-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   {option.text}
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between mt-6">
//               <button
//                 onClick={handlePrev}
//                 disabled={currentQuestionIndex === 0}
//                 className="px-6 py-2 bg-gray-500 text-gray-200 rounded-lg disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="px-6 py-2 bg-cyan-600 text-white rounded-lg"
//               >
//                 {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
//               </button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CompetitionPage;












import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import logo from "../../../../assets/Static/logoWrite-re.png";
import CircularTimer from "../../../../components/Timer/CircularTimer";
import { useResult } from '../../../../context/CompetitionContext';
import { useMediaQuery } from 'react-responsive';

const CompetitionPage = () => {
  const { competition } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { updateResults, incrementAttempts } = useResult();
  const startTime = useRef(Date.now());
  
  // Media queries for responsive design
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const showSidebar = !isMobile && !isTablet;

  // Python Questions with code snippets
  const pythonQuestions = [
    {
      id: 1,
      question: "What is the output of this code?",
      options: [
        { id: 'a', text: "21" },
        { id: 'b', text: "777" },
        { id: 'c', text: "37" },
        { id: 'd', text: "Error" }
      ],
      correctAnswer: 'b',
      type: 'single',
      code: "print(3 * '7')"
    },
    {
      id: 2,
      question: "What will be printed?",
      options: [
        { id: 'a', text: "[1]" },
        { id: 'b', text: "[2]" },
        { id: 'c', text: "[2, 3]" },
        { id: 'd', text: "[1, 2]" }
      ],
      correctAnswer: 'c',
      type: 'single',
      code: "print([1, 2, 3][1:])"
    },
    // Add the remaining 13 Python questions here...
  ];

  // Tynker Questions
  const tynkerQuestions = [
    {
      id: 1,
      question: "What is the purpose of the 'when flag clicked' block in Tynker?",
      options: [
        { id: 'a', text: "To start the program when the green flag is clicked" },
        { id: 'b', text: "To create a conditional statement" },
        { id: 'c', text: "To define a function" },
        { id: 'd', text: "To stop the program" }
      ],
      correctAnswer: 'a',
      type: 'single'
    },
    // Add the remaining 14 Tynker questions here...
  ];

  // Select questions based on competition type
  const questions = competition === 'python' ? pythonQuestions : tynkerQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    incrementAttempts();
  }, []);

  const calculateResults = () => {
    const endTime = Date.now();
    const timeTakenInSeconds = Math.floor((endTime - startTime.current) / 1000);

    const correctAnswers = questions.reduce((count, q) => {
      const userAnswer = selectedOptions[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      return count + (isCorrect ? 1 : 0);
    }, 0);

    const totalQuestions = questions.length;
    const passed = correctAnswers >= Math.ceil(totalQuestions * 0.6);

    return {
      score: correctAnswers,
      totalQuestions,
      timeTakenInSeconds,
      passed,
      answers: selectedOptions,
      questions
    };
  };

  const handleTimeUp = () => {
    const results = calculateResults();
    updateResults(results);

    Swal.fire({
      icon: 'error',
      title: 'Time\'s up!',
      text: 'The competition has ended.',
      confirmButtonText: 'See Results',
    }).then(() => {
      navigate(`/competition/${competition}/results`);
    });
  };

  const handleOptionSelect = (questionId, optionId, isMultiple = false) => {
    setSelectedOptions(prev => {
      if (isMultiple) {
        return {
          ...prev,
          [questionId]: prev[questionId]
            ? prev[questionId].includes(optionId)
              ? prev[questionId].filter(id => id !== optionId)
              : [...prev[questionId], optionId]
            : [optionId]
        };
      }
      return { ...prev, [questionId]: optionId };
    });
  };

  const handleNext = () => {
    const allAnswered = questions.every(q => selectedOptions[q.id]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (!allAnswered) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete',
          text: 'Please answer all questions before submitting.',
        });
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "You are about to submit your answers.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
      }).then((result) => {
        if (result.isConfirmed) {
          const results = calculateResults();
          updateResults(results);

          Swal.fire({
            title: 'Done!',
            text: `You answered ${results.score} out of ${results.totalQuestions} correctly.`,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate(`/competition/${competition}/results`);
          });
        }
      });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar - only shown on desktop */}
      {showSidebar && (
        <div className="w-64 bg-cyan-700 text-white p-6 flex flex-col justify-between">
          <div>
            <img src={logo} alt="Logo" className="w-28 mb-6 flex mx-auto" />
            <div className="flex justify-center mb-4">
              <CircularTimer
                duration={1 * 60}
                onEnd={handleTimeUp}
                current={currentQuestionIndex + 1}
                total={questions.length}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Questions</h4>
              <ul className="space-y-2">
                {questions.map((q, i) => (
                  <li
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${i === currentQuestionIndex ? 'bg-white text-cyan-700' : selectedOptions[q.id] ? 'bg-cyan-900' : 'hover:bg-cyan-600'}`}
                  >
                    {i + 1}. {q.question.substring(0, 20)}...
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        {/* Mobile/Tablet Header with Timer */}
        {(isMobile || isTablet) && (
          <div className="bg-cyan-700 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
            <img src={logo} alt="Logo" className="w-20" />
            <div className="flex items-center">
              <span className="mr-3 text-sm">
                Q: {currentQuestionIndex + 1}/{questions.length}
              </span>
              <CircularTimer
                duration={1 * 60}
                onEnd={handleTimeUp}
                current={currentQuestionIndex + 1}
                total={questions.length}
                size={isMobile ? 50 : 60}
              />
            </div>
          </div>
        )}

        {/* Question Navigation for Mobile/Tablet */}
        {(isMobile || isTablet) && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`min-w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    i === currentQuestionIndex
                      ? 'bg-cyan-600 text-white'
                      : selectedOptions[q.id]
                      ? 'bg-cyan-200 text-cyan-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white shadow-xl rounded-2xl p-4 md:p-6"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            
            {/* Simple code display without external dependencies */}
            {currentQuestion.code && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-800 text-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{currentQuestion.code}</pre>
              </div>
            )}

            <div className="space-y-2 md:space-y-3">
              {currentQuestion.options.map(option => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id, currentQuestion.type === 'multiple')}
                  className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOptions[currentQuestion.id] === option.id ||
                    (Array.isArray(selectedOptions[currentQuestion.id]) && selectedOptions[currentQuestion.id].includes(option.id))
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.text}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 md:px-6 md:py-2 bg-gray-500 text-gray-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 md:px-6 md:py-2 bg-cyan-600 text-white rounded-lg"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompetitionPage;