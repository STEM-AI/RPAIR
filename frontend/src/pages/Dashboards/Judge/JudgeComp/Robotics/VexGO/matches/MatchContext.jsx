import { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [matches, setMatches] = useState({});
  const [currentMatch, setCurrentMatch] = useState(null);

  // دالة عامة لتحديث أي نوع مباراة
  const updateMatch = (matchId, data) => {
    setMatches(prev => ({
      ...prev,
      [matchId]: {
        ...data,
        type: data.type // 'solo' أو 'coop'
      }
    }));
  };

  return (
    <MatchContext.Provider value={{ 
      matches,
      currentMatch,
      setCurrentMatch,
      updateMatch
    }}>
      {children}
    </MatchContext.Provider>
  );
}

export const useMatchContext = () => useContext(MatchContext);