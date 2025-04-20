import { createContext, useContext, useState } from "react";

const EventNameContext = createContext();

export const EventNameProvider = ({ children }) => {
  const [currentCompetition, setCurrentCompetition] = useState(null);

  return (
    <EventNameContext.Provider value={{ currentCompetition, setCurrentCompetition }}>
      {children}
    </EventNameContext.Provider>
  );
};

export const useEventNameContext = () => useContext(EventNameContext);