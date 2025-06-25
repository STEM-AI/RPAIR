import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import logo from "../../../../assets/Static/logoWrite-re.png";
import CircularTimer from "../../../../components/Timer/CircularTimer";
import { useMediaQuery } from 'react-responsive';
import useQuestion from '../../../../hooks/Questions/QuestionId';
import useAllQuestion from '../../../../hooks/Questions/AllQuestion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import axios from 'axios';
import useInfoQuestions from '../../../../hooks/Questions/InfoQuestion';


const CompetitionQuestions = () => {
  const { competition } = useParams();
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [searchParams] = useSearchParams();
  const competition_id = searchParams.get('id');
  const [formattedQuestion, setFormattedQuestion] = useState('');
  const [formattedCode, setFormattedCode] = useState('');  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({}); // تتبع الأسئلة المحفوظة

  const startTime = useRef(Date.now());
  
      const { questions: infoQuestions} = useInfoQuestions(competition_id, competition);
  
  const { questions: allQuestions, loading: allLoading, error: allError } = useAllQuestion(competition_id, competition);
  
  const { question: detailedQuestion, loading: detailLoading, error: detailError } = useQuestion(currentQuestionId);
  
  const token= localStorage.getItem('access_token');
  
const formatSingleLineCode = (text) => {
  if (!text) return { question: '', code: '' };
  const questionEnd = text.indexOf('?');
  const question = text.substring(0, questionEnd + 1);
  let code = text.substring(questionEnd + 1).trim();
  code = code
  .replace(/;\s*/g, ';\n')   
  .replace(/^;\n/, '') 
    .replace(/:\s*/g, ':\n    ')
    .replace(/\breturn\s+/g, 'return ')
    .replace(/\bif\s+/g, 'if ')
    .replace(/\bdef\s+/g, 'def ');
    setFormattedCode(code);
  return { question, code };
};

  

  
  // Media queries for responsive design
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const showSidebar = useMemo(() => !isMobile && !isTablet, [isMobile, isTablet]);
  
   const saveAnswer = useCallback(async (questionId, answerId) => {
    if (savedAnswers[questionId]) return; 
    
    const data = {
      question_id: questionId,
      answer_id: answerId,
      event_game_id: 813
    };
    
    try {
      setIsSaving(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/programming/answer-question/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // وضع علامة على السؤال كـ "محفوظ"
      setSavedAnswers(prev => ({ ...prev, [questionId]: true }));
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Save Error',
        text:`Failed to save your answer, ${error.response.data.error}` ||  'Failed to save your answer. Please try again.' ,
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [savedAnswers, token]);

  // دالة انتهاء الوقت المعدلة
  const handleTimeUp = useCallback(async () => {

    
    const unsavedQuestions = Object.entries(selectedOptions)
      .filter(([id, answer]) => 
        answer !== null && 
        !savedAnswers[id] &&
        (Array.isArray(answer) ? answer.length > 0 : true)
      );
    
    try {
      Swal.fire({
        icon: 'error',
        title: 'Time\'s up!',
        text: 'The competition has ended.',
        confirmButtonColor: '#32cd32',
      });
      setIsSaving(true);
      await Promise.all(
        unsavedQuestions.map(([id, answer]) => 
          saveAnswer(id, answer)
        )
      );
    } catch (error) {
      console.error("Failed to save answers:", error);
    } finally {
      setIsSaving(false);
      Swal.fire({
        icon: 'error',
        title: 'Time\'s up!',
        text: 'The competition has ended.',
        confirmButtonColor: '#32cd32',
      }).then(() => {
        navigate(`/competition/${competition}/results`, { replace: true });
      });
    }
  }, [navigate, competition, selectedOptions, savedAnswers, saveAnswer]);

  useEffect(() => {
    if (detailedQuestion?.text) {
      const { question } = formatSingleLineCode(detailedQuestion.text);
      setFormattedQuestion(question);
    }
  }, [detailedQuestion]);
 




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

  useEffect(() => {
    if (allQuestions && allQuestions.length > 0) {
      setCurrentQuestionId(allQuestions[currentQuestionIndex].id);
    }
  }, [currentQuestionIndex, allQuestions]);


  // const handleTimeUp = useCallback(() => {
    
  
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Time\'s up!',
  //     text: 'The competition has ended.',
  //     confirmButtonColor: '#32cd32',
  //   }).then(() => {
      
  //       navigate(`/competition/${competition}/results`, { replace: true });
      
  //   });
  // }, [ navigate, competition ]);

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

  const answerDone = async () => {
    const currentId = allQuestions[currentQuestionIndex].id;
    const currentAnswer = selectedOptions[currentId];
    
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      Swal.fire({
        icon: 'warning',
        title: 'No Answer Selected',
        text: 'Please select an answer before submitting.',
      });
      return;
    }
  
    try {
      
      await saveAnswer(currentId, currentAnswer);
      
      setAnsweredQuestions(prev => ({ ...prev, [currentId]: true }));
  
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
        }).then(async () => {
                // await saveAnswer(currentId, currentAnswer);
          Swal.fire({
            title: 'Done!',
            text: `thank you have answerd submitted`,
            icon: 'success',
          }).then(() => {
              navigate(`/competition/${competition}/results`, { replace: true });
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleNext = async () => {
    if (!allQuestions || allQuestions.length === 0 || isSaving) return;
    
    const currentId = allQuestions[currentQuestionIndex].id;
    const currentAnswer = selectedOptions[currentId];
    
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
   
  };
  
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevQuestionId = allQuestions[currentQuestionIndex - 1].id;
      if (!answeredQuestions[prevQuestionId]) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Question Already Answered',
          text: 'You cannot return to this question after submitting your answer.',
        });
      }
    }
  };


  const handleQuestionSelect = (index) => {
    const questionId = allQuestions[index].id;
    if (!answeredQuestions[questionId]) {
      setCurrentQuestionIndex(index);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Question Already Answered',
        text: 'You cannot return to this question after submitting your answer.',
      });
    }
  };
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
    <div className="flex flex-col md:flex-row">
      {/* Sidebar - only shown on desktop */}
        {showSidebar && (
          <div className="w-64 bg-cyan-700 text-white flex flex-col h-screen sticky top-0">
            {/* Fixed Header */}
            <div className="p-6 pb-4 border-b border-cyan-600">
              <img src={logo} alt="Logo" className="w-28 mb-4 mx-auto" />
              <div className="flex justify-center">
                <CircularTimer
                  duration={infoQuestions.time_limit}
                  onEnd={handleTimeUp}
                  current={currentQuestionIndex + 1}
                  total={(infoQuestions.time_limit)/60}
                />
              </div>
            </div>

            {/* Scrollable Questions List */}
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              <div className="px-6">
                <h4 className="font-semibold mb-3 text-lg">Questions</h4>
                <ul className="space-y-2">
                  {allQuestions.map((q, i) => (
                    <li
                    key={q.id}
                    onClick={() => handleQuestionSelect(i)}
                    className={`cursor-pointer px-3 py-2 rounded-lg transition-all flex items-start relative group ${
                      i === currentQuestionIndex
                        ? 'bg-white text-cyan-700 font-medium'
                        : answeredQuestions[q.id]
                          ? 'bg-cyan-800 cursor-not-allowed'
                          : selectedOptions[q.id] 
                            ? 'bg-cyan-600'
                            : 'hover:bg-cyan-600'
                    }`}
                  >
                    <span className="min-w-[24px] font-medium">{i + 1}.</span>
                    <span className="ml-1 line-clamp-1 text-left">
                      {q.text.substring(0, 30)}
                      {q.text.length > 30 && "..."}
                    </span>
                    
                    {answeredQuestions[q.id] && (
                      <span className="ml-2 text-xs bg-white text-cyan-700 px-1 rounded">
                        Answered
                      </span>
                    )}
                      
                      
                      {/* Internal Hover Tooltip */}
                      <div className="absolute top-full left-0 w-full mt-1 p-3 bg-white text-cyan-800 text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        <div className="font-semibold mb-1">Question {i + 1}</div>
                        <div className="max-h-32 overflow-y-auto">
                          <div>{formattedQuestion}</div>
                          <div>{formattedCode}</div>
                        </div>
                        <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45"></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-4 border-t border-cyan-600 text-center text-sm">
              {Object.values(selectedOptions).filter(opt => 
                opt !== null && 
                (!Array.isArray(opt) || opt.length > 0)
              ).length}
              /{allQuestions.length} answered
            </div>
          </div>
        )}

      {/* Main content */}
      <div className="flex-1 p-4 bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        {/* Mobile/Tablet Header with Timer */}
        {(isMobile || isTablet) && (
          <div className="bg-cyan-700 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
            <img src={logo} alt="Logo" className="w-20" />
            <div className="flex items-center">
              <span className="mr-3 text-sm">
                Q: {currentQuestionIndex + 1}/{allQuestions.length}
              </span>
              <CircularTimer
                duration={infoQuestions.time_limit}
                onEnd={handleTimeUp}
                current={currentQuestionIndex + 1}
                total={(infoQuestions.time_limit)/60}
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
                    : answeredQuestions[q.id]
                      ? 'bg-cyan-800 text-white cursor-not-allowed'
                      : selectedOptions[q.id] 
                        ? 'bg-cyan-200 text-cyan-800'
                        : 'bg-gray-200 text-gray-700'
                }`}
                disabled={answeredQuestions[q.id]}
              >
                {i + 1}
                {answeredQuestions[q.id] && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></span>
                )}
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
                {currentQuestionIndex + 1}. {formattedQuestion}
              </h2>
              
              {/* Display code if available */}
              {formattedCode && (
                
            <div className="mb-6">
            <SyntaxHighlighter 
              language="python" 
              style={tomorrow}
              showLineNumbers={true}
              wrapLines={true}
              className="rounded-md text-sm"
            >
              {formattedCode}
            </SyntaxHighlighter>
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
                  onClick={answerDone}
                  disabled={isSaving}
                  className={`px-4 py-2 md:px-6 md:py-2 bg-green-600 text-white rounded-lg ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Saving...
                    </span>
                  ) : currentQuestionIndex < allQuestions.length - 1 ? 'Done' : 'Submit'}
                </button>
                <button
                  onClick={handleNext}
                  className={`px-4 py-2 md:px-6 md:py-2 bg-cyan-600 text-white rounded-lg ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Saving...
                    </span>
                  ) : currentQuestionIndex < allQuestions.length - 1 ? 'Next' : 'Submit'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      </div>
    </div>
  );
};

export default CompetitionQuestions;