
import React, { createContext, useState, useContext } from 'react';

const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [results, setResults] = useState({
    score: 0,
    totalQuestions: 0,
    timeTakenInSeconds: 0,
    passed: false,
    attempts: 1,
    answers: {},
    questions: []
  });

  const updateResults = (newResults) => {
    setResults(prev => ({
      ...prev,
      ...newResults
    }));
  };

  const incrementAttempts = () => {
    setResults(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }));
  };

  return (
    <ResultContext.Provider
      value={{
        ...results,
        updateResults,
        incrementAttempts
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResult must be used within a ResultProvider');
  }
  return context;
};