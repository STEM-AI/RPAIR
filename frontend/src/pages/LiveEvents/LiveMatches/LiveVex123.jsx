import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal, FaSyncAlt, FaRobot, FaCar, FaListOl } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const LiveVex123 = () => {
  const [rankings, setRankings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const eventName = 'vex_123';
  const URL = `${process.env.REACT_APP_API_URL}/vex-123/${eventName}/rank/`;
  const intervalRef = useRef();
    const socketRef = useRef(null);
      const [matches, setMatches] = useState([]);
    
  

 

 
 useEffect(() => {
  const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/vex_123/`;
  socketRef.current = new WebSocket(wsUrl);

  socketRef.current.onopen = () => {
    console.log("WebSocket connection established");
    setConnectionStatus('connected');
  };

  socketRef.current.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Score Update:", data);

      setMatches(prevMatches => {
        const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
        
        // Create new match object with proper structure
       // In the WebSocket onmessage handler
const newMatch = {
  code: data.game_id,
  team1: data.team1_name || 'Team 1',
  // Extract scores from the score object
  driverScore: data.score?.driver || 0,
};

        if (matchIndex === -1) {
          return [...prevMatches, newMatch];
        }

        const updatedMatches = [...prevMatches];
        updatedMatches[matchIndex] = {
          ...updatedMatches[matchIndex],
          ...newMatch
        };
        return updatedMatches;
      });

    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  socketRef.current.onerror = (error) => {
    console.error("WebSocket error:", error);
    setConnectionStatus('error');
  };

  socketRef.current.onclose = () => {
    console.log("WebSocket connection closed");
    setConnectionStatus('disconnected');
  };

  return () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };
}, [eventName]);

// Add connection status state
const [connectionStatus, setConnectionStatus] = useState('connecting');

// Add connection status indicator
const connectionStatusColors = {
  connected: 'bg-green-500',
  connecting: 'bg-yellow-500',
  disconnected: 'bg-red-500',
  error: 'bg-red-700'
};


  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Live-Robotics</title>
      </Helmet>
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          VEX 123 Challenge
        </h1>

            {/* Desktop Table */}
      <div className="mb-4 flex items-center justify-center gap-2">
  <div className={`w-3 h-3 rounded-full ${connectionStatusColors[connectionStatus]}`}></div>
  <span className="text-sm text-gray-600">
    {connectionStatus === 'connected' && 'Live updates connected'}
    {connectionStatus === 'connecting' && 'Connecting...'}
    {connectionStatus === 'disconnected' && 'Connection lost'}
    {connectionStatus === 'error' && 'Connection error'}
  </span>
</div>

{matches.length === 0 ? (
  <div className="text-center py-4 text-gray-500">
    No active matches available
  </div>
) : (
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {matches.map((match) => (
        <tr key={match.code} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{match.code}</td>
          <td className="px-6 py-4 whitespace-nowrap">{match.team1}</td>
          <td className="px-6 py-4 whitespace-nowrap text-center font-bold bg-blue-50 text-blue-700 rounded-lg mx-2">
  <div className="flex flex-col">
    <span>score: {match.driverScore}</span>
  </div>
</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

      </div>
    </div>
  );
};

export default LiveVex123;