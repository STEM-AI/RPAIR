

import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaMedal, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import DriverRounds from "./DriverRounds";
import AutoRounds from "./AutoRounds";
import { useSearchParams } from "react-router-dom";

const LiveSkillsVex = () => {
  const [rankings, setRankings] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoIqMatches, setAutoIqMatches] = useState([]);
  const [driverIqMatches, setDriverIqMatches] = useState([]);
  const [showRankings, setShowRankings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamRounds, setTeamRounds] = useState({});
const [searchParams] = useSearchParams();
  const eventName = searchParams.get('eventName');
  const eventId = searchParams.get('eventId');
  const autoSocketRef = useRef(null);
  const driverSocketRef = useRef(null);


  // Load existing matches from localStorage when component mounts
  useEffect(() => {
    const storedAutoIqMatches = JSON.parse(localStorage.getItem("autoIqMatches")) || [];
    const storedDriverIqMatches = JSON.parse(localStorage.getItem("driverIqMatches")) || [];
    setAutoIqMatches(storedAutoIqMatches);
    setDriverIqMatches(storedDriverIqMatches);
    updateTeamRounds(storedAutoIqMatches, storedDriverIqMatches);
  }, []);

  // Update team rounds when matches change
  useEffect(() => {
    updateTeamRounds(autoIqMatches, driverIqMatches);
  }, [autoIqMatches, driverIqMatches]);

  const updateTeamRounds = (autoIqMatches, driverIqMatches) => {
    const rounds = {};

    autoIqMatches.forEach(match => {
      if (!rounds[match.team1]) rounds[match.team1] = 0;
      rounds[match.team1]++;
    });

    driverIqMatches.forEach(match => {
      if (!rounds[match.team1]) rounds[match.team1] = 0;
      rounds[match.team1]++;
    });

    setTeamRounds(rounds);
  };

  useEffect(() => {
    autoSocketRef.current = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/auto/`);

    autoSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.game_id && data.score?.autonomous !== undefined) {
        setAutoIqMatches(prev => {
          const updatedMatches = updateMatches(prev, data);
          localStorage.setItem("autoIqMatches", JSON.stringify(updatedMatches));
          return updatedMatches;
        });
        setLastUpdate(new Date());
      }
    };

    return () => {
      if (autoSocketRef.current) {
        autoSocketRef.current.close();
      }
    };
  }, [eventName]);

  useEffect(() => {
    driverSocketRef.current = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/driver_iq/`);

    driverSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.game_id && data.score?.driver !== undefined) {
        setDriverIqMatches(prev => {
          const updatedMatches = updateMatches(prev, data);
          localStorage.setItem("driverIqMatches", JSON.stringify(updatedMatches));
          return updatedMatches;
        });
        setLastUpdate(new Date());
      }
    };

    return () => {
      if (driverSocketRef.current) {
        driverSocketRef.current.close();
      }
    };
  }, [eventName]);

  const updateMatches = (prevMatches, data) => {
    const teamName = data.team1_name || "Team 1";
    const teamMatches = prevMatches.filter(m => m.team1 === teamName);

    if (teamMatches.length >= 3) {
      return prevMatches;
    }

    const matchIndex = prevMatches.findIndex(m => m.code === data.game_id);
    if (matchIndex === -1) {
      // New match
      return [
        ...prevMatches,
        {
          code: data.game_id,
          team1: teamName,
          score: data.score,
        }
      ];
    } else {
      // Update existing match
      return prevMatches.map((m, i) =>
        i === matchIndex ? { ...m, score: data.score } : m
      );
    }
  };

  const fetchRankings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/event/${eventId}/skills-rank`);
      setRankings(response.data);
      setShowRankings(true);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaMedal className="text-yellow-500 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-2xl" />;
      case 3:
        return <FaMedal className="text-amber-600 text-2xl" />;
      default:
        return <span className="text-gray-500 font-medium">{rank}</span>;
    }
  };

  const renderRankingTeamWithRounds = (teamName) => {
    const roundsCount = teamRounds[teamName] || 0;
    if (roundsCount <= 1) return teamName;

    return (
      <div className="flex items-center gap-2">
        <span>{teamName}</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Round {roundsCount}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Live-Skills</title>
      </Helmet>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Skills Challenge
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <FaSyncAlt className="animate-spin" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Rounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <DriverRounds matches={driverIqMatches} />
        <AutoRounds matches={autoIqMatches} />
      </div>

      {/* Rankings */}
      <div className="flex justify-center my-8">
        <button
          onClick={fetchRankings}
          disabled={isLoading}
          className={`inline-flex items-center px-6 py-3 rounded-full font-medium text-white shadow-lg ${
            isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
          } transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
        >
          {isLoading ? <FaSyncAlt className="animate-spin mr-2" /> : <FaTrophy className="mr-2" />}
          {isLoading ? "Loading..." : "View Skills Rankings"}
        </button>
      </div>

      {showRankings && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4">
            <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
              <FaTrophy /> Skills Challenge Rankings
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.map((team, index) => (
                  <tr
                    key={team.team}
                    className={`${
                      index === 0 ? "bg-amber-50" :
                      index === 1 ? "bg-gray-50" :
                      index === 2 ? "bg-amber-25" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getMedalIcon(index + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {renderRankingTeamWithRounds(team.team__name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                        {(team.total_score ?? 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSkillsVex;
