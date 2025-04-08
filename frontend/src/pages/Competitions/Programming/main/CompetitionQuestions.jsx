
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useTimer from '../../../../hooks/UseTime/UseTimer';
import logo from "../../../../assets/Static/logoWrite-re.png";

const CompetitionPage = () => {
  const { competition } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const questions = [
    {
      id: 1,
      question: "What is JSX in React?",
      options: [
        { id: 'a', text: "A syntax extension for JavaScript that allows writing HTML-like code in JavaScript" },
        { id: 'b', text: "A state management library for React applications" },
        { id: 'c', text: "A build tool for bundling React applications" },
        { id: 'd', text: "A testing framework for React components" }
      ],
      correctAnswer: 'a',
      type: 'single'
    },
    {
      id: 2,
      question: "React components must always return a single JSX element.",
      options: [
        { id: 'a', text: "True" },
        { id: 'b', text: "False" }
      ],
      correctAnswer: 'a',
      type: 'single'
    },
  ];

  const { formattedTime } = useTimer(10 * 60, () => {
    navigate(`/competition/${competition}/results`);
  });

  const currentDate = new Date();

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate(`/competition/${competition}/results`);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex  min-h-screen">
      {/* Sidebar */}
      

<div className="w-64 bg-cyan-700 text-white p-6 flex flex-col justify-between justify-content-center">
  <div>
    <img src={logo} alt="Logo" className="w-28 mb-6 flex mx-auto" />
    <div className="text-3xl font-bold mb-2">⏳{formattedTime}</div>
    <div>
      <h4 className="font-semibold mb-2">Questions</h4>
      <ul className="space-y-2">
        {questions.map((q, i) => (
          <li
            key={q.id}
            onClick={() => setCurrentQuestionIndex(i)}
            className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${i === currentQuestionIndex ? 'bg-white text-cyan-700' : selectedOptions[q.id] ? 'bg-cyan-900' : 'hover:bg-cyan-600'}`}
          >
            {i + 1}. {q.question} {/* Display question text here */}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-50">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white shadow-xl rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id, currentQuestion.type === 'multiple')}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
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
                className="px-6 py-2 bg-gray-500 text-gray-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg"
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