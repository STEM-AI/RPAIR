import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import logo from "../../../../assets/Static/logoWrite-re.png";
import CircularTimer from "../../../../components/Timer/CircularTimer";
import { useResult } from '../../../../context/CompetitionContext';
import { useMediaQuery } from 'react-responsive';
import useQuestion from '../../../../hooks/Questions/QuestionId';
import useAllQuestion from '../../../../hooks/Questions/AllQuestion';


const CompetitionPage = () => {
  const { competition } = useParams();
  const [searchParams] = useSearchParams();
  const competition_id = searchParams.get('id');
  const navigate = useNavigate();
  
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { updateResults, incrementAttempts } = useResult();
  const startTime = useRef(Date.now());
  
  // جلب قائمة الأسئلة
  const { questions: allQuestions, loading: allLoading, error: allError } = useAllQuestion(competition_id, competition);
  
  // جلب السؤال الحالي بالتفصيل
  const { question: detailedQuestion, loading: detailLoading, error: detailError } = useQuestion(currentQuestionId);
  
  // Media queries for responsive design
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const showSidebar = !isMobile && !isTablet;

  useEffect(() => {
    incrementAttempts();
  }, []);

  // عند تغيير قائمة الأسئلة، نحدد السؤال الأول
  useEffect(() => {
    if (allQuestions && allQuestions.length > 0 && !currentQuestionId) {
      setCurrentQuestionId(allQuestions[0].id);
      setCurrentQuestionIndex(0);
      
      // تهيئة الإجابات المختارة
      const initialSelectedOptions = {};
      allQuestions.forEach(q => {
        initialSelectedOptions[q.id] = q.type === 'multiple' ? [] : null;
      });
      setSelectedOptions(initialSelectedOptions);
    }
  }, [allQuestions]);

  // عند تغيير السؤال الحالي من خلال التنقل
  useEffect(() => {
    if (allQuestions && allQuestions.length > 0) {
      setCurrentQuestionId(allQuestions[currentQuestionIndex].id);
    }
  }, [currentQuestionIndex, allQuestions]);

  const calculateResults = useCallback(() => {
    if (!allQuestions || allQuestions.length === 0) return {};
    
    const endTime = Date.now();
    const timeTakenInSeconds = Math.floor((endTime - startTime.current) / 1000);
  
    const correctAnswers = allQuestions.reduce((count, q) => {
      const userAnswer = selectedOptions[q.id];
      const correctAnswer = q.correctAnswer;
      
      if (Array.isArray(correctAnswer)) {
        const sortedUser = [...userAnswer].sort().join('');
        const sortedCorrect = [...correctAnswer].sort().join('');
        return count + (sortedUser === sortedCorrect ? 1 : 0);
      }
      
      return count + (userAnswer === correctAnswer ? 1 : 0);
    }, 0);
  
    const totalQuestions = allQuestions.length;
    const passed = correctAnswers >= Math.ceil(totalQuestions * 0.6);
  
    return {
      score: correctAnswers,
      totalQuestions,
      timeTakenInSeconds,
      passed,
      answers: selectedOptions,
      questions: allQuestions
    };
  }, [allQuestions, selectedOptions]);

  const handleTimeUp = useCallback(() => {
    const results = calculateResults();
    updateResults(results);
  
    Swal.fire({
      icon: 'error',
      title: 'Time\'s up!',
      text: 'The competition has ended.',
      confirmButtonColor: '#32cd32',
      confirmButtonText: 'Show Results'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/competition/${competition}/results`);
      }
    });
  }, [updateResults, navigate, competition, calculateResults]);

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
  if (!allQuestions || allQuestions.length === 0) return;
  
  if (currentQuestionIndex < allQuestions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  } else {
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
          confirmButtonText: 'Show Results'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/competition/${competition}/results`);
          }
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

  // عند النقر على سؤال في القائمة الجانبية
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  // حالات التحميل
  if (allLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (allError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold">Error</h2>
          <p>Failed to load questions: {allError.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!allQuestions || allQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-center">
          <h2 className="text-xl font-bold">No Questions Available</h2>
          <p>The competition doesn't have any questions yet</p>
        </div>
      </div>
    );
  }

  // إذا كان السؤال الحالي لا يزال في طور التحميل
  if (detailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold">Error</h2>
          <p>Failed to load question: {detailError.message}</p>
          <button 
            onClick={() => setCurrentQuestionId(allQuestions[currentQuestionIndex].id)}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar - only shown on desktop */}
      {showSidebar && (
        <div className="w-64 bg-cyan-700 text-white p-6 flex flex-col justify-between">
          <div>
            <img src={logo} alt="Logo" className="w-28 mb-6 flex mx-auto" />
            <div className="flex justify-center mb-4">
              <CircularTimer
                duration={0.5 * 60}
                onEnd={handleTimeUp}
                current={currentQuestionIndex + 1}
                total={allQuestions.length}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Questions</h4>
              <ul className="space-y-2">
                {allQuestions.map((q, i) => (
                  <li
                    key={q.id}
                    onClick={() => handleQuestionSelect(i)}
                    className={`cursor-pointer px-3 py-1 rounded-lg transition-all ${i === currentQuestionIndex ? 'bg-white text-cyan-700' : selectedOptions[q.id] ? 'bg-cyan-900' : 'hover:bg-cyan-600'}`}
                  >
                    {i + 1}. {q.text.substring(0, 20)}...
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
                Q: {currentQuestionIndex + 1}/{allQuestions.length}
              </span>
              <CircularTimer
                duration={0.5 * 60}
                onEnd={handleTimeUp}
                current={currentQuestionIndex + 1}
                total={allQuestions.length}
                size={isMobile ? 50 : 60}
              />
            </div>
          </div>
        )}

        {/* Question Navigation for Mobile/Tablet */}
        {(isMobile || isTablet) && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {allQuestions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionSelect(i)}
                  className={`min-w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    i === currentQuestionIndex
                      ? 'bg-cyan-600 text-white'
                      : selectedOptions[q.id] && 
                        (q.type === 'multiple' 
                          ? selectedOptions[q.id].length > 0 
                          : selectedOptions[q.id] !== null)
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

        {detailedQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={detailedQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white shadow-xl rounded-2xl p-4 md:p-6"
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                {currentQuestionIndex + 1}. {detailedQuestion.text}
              </h2>
              
              {/* Display code if available */}
              {detailedQuestion.code && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-800 text-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{detailedQuestion.code}</pre>
                </div>
              )}

              <div className="space-y-2 md:space-y-3">
                {detailedQuestion.answers && detailedQuestion.answers.map(option => (
                  <div
                    key={option.id}
                    onClick={() => handleOptionSelect(detailedQuestion.id, option.id, detailedQuestion.type === 'multiple')}
                    className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
                      (selectedOptions[detailedQuestion.id] === option.id) ||
                      (Array.isArray(selectedOptions[detailedQuestion.id]) && 
                       selectedOptions[detailedQuestion.id].includes(option.id))
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
                  {currentQuestionIndex < allQuestions.length - 1 ? 'Next' : 'Submit'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CompetitionPage;