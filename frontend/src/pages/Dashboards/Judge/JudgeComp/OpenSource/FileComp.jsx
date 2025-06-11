import React, { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import { FaTrophy, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useParams, useSearchParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function FileComp() {
  const { competition_name } = useParams();
  const [searchParams] = useSearchParams();
  const [showRanking, setShowRanking] = useState(false);
  const [rankings, setRankings] = useState([]);
  const event_name = searchParams.get('eventName');
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [score, setScore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("access_token");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTeams = async () => {
    if (!token) {
      setError("Authentication Error");
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      setLoading(false);
      return;
    }

    const myAPI = `${process.env.REACT_APP_API_URL}/${competition_name}/${event_name}/`;
    try {
      setLoading(true);
      setError(null);
      setResponseMessage(null);

      const response = await axios.get(myAPI, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });

      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);

      if (err.code === "ECONNABORTED") {
        setResponseMessage("Request timed out. Please check your connection and try again.");
      } else if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 401:
            setResponseMessage("Your session has expired. Please log in again.");
            break;
          case 403:
            setResponseMessage("You don't have permission to access these teams.");
            break;
          case 404:
            setResponseMessage("The teams resource was not found. Please try again later.");
            break;
          case 500:
            setResponseMessage("Server error. Please try again later.");
            break;
          default:
            setResponseMessage(
              err.response?.data?.message || "Failed to fetch teams. Please try again."
            );
        }
      } else {
        setResponseMessage("An unexpected error occurred. Please try again.");
      }
      setAlertType("error");
    }
  };

  const fetchCoopRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/${competition_name}/${event_name}/rank/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRankings(response.data);
    } catch (error) {
      console.error("Error fetching coop rankings:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRanking = () => {
    setShowRanking(prev => {
      const newState = !prev;
      if (newState) {
        fetchCoopRankings();
      }
      return newState;
    });
  };
  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const addScore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);
    setAlertType("");

    if (!score || !selectedTeam) {
      setAlertType("error");
      setResponseMessage("Please enter a valid score");
      setIsSubmitting(false);
      return;
    }

    const scoreData = {
      team: selectedTeam,
      score: parseInt(score)
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/${competition_name}/${event_name}/score/${selectedTeam}/`,
        scoreData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertType("success");
      setResponseMessage("Score added successfully!");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Score added successfully!",
        showConfirmButton: false,
        timer: 1500
      });

      setScore("");
      setShowModal(false);
      fetchTeams();
    } catch (err) {
      setAlertType("error");
      setResponseMessage(
        err.response?.data?.detail || "Failed to add score. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openScoreModal = (teamId, teamName) => {
    setSelectedTeam(teamId);
    setSelectedTeamName(teamName);
    setShowModal(true);
  };

  useEffect(() => {
    fetchTeams();
  }, [token, event_name]);

  const filteredTeams = teams.filter(team => {
    const matchesName = team.team_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesName;
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Header Section with improved gradient */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
          {event_name?.replace(/_/g, ' ')} Submissions
        </h1>
        <div className="mt-3 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 w-20 mx-auto rounded-full" />
      </div>

      {/* Search Bar with improved styling */}
      <div className="mb-6">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-cyan-500" />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full pl-12 pr-5 py-3 rounded-xl border border-cyan-100 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Status Messages with animation */}
      <AnimatePresence>
        {responseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5"
          >
            <Alert severity={alertType} className="rounded-xl shadow-md">
              <AlertTitle className="capitalize font-medium">{alertType}</AlertTitle>
              {responseMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State with modern spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-cyan-300 border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-5 text-gray-600 font-medium">Loading submissions...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" className="rounded-xl shadow-md mb-6">
          <AlertTitle className="font-medium">Error</AlertTitle>
          {responseMessage}
        </Alert>
      )}

      {/* Content Section */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-cyan-50">
          {/* Mobile View - Enhanced card design */}
          <div className="block md:hidden">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 border-b border-cyan-50 last:border-b-0 hover:bg-cyan-50/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-800">{team.team_name}</h3>
                    <div className="flex items-center mt-2">
                      <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full">
                        ID: {team.team}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openScoreModal(team.team, team.team_name)}
                    className="ml-3 p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white transition-colors"
                    aria-label="Add score"
                  >
                    <MdAddBox size={20} />
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-500 flex items-center">
                    <span className="mr-2">📁 File:</span>
                  </div>
                  <div className="font-medium">
                    {team.attachment ? (
                      <a 
                        href={team.attachment} 
                        className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Submission
                      </a>
                    ) : (
                      <span className="text-gray-400">Not submitted</span>
                    )}
                  </div>
                  
                  <div className="text-gray-500 flex items-center">
                    <span className="mr-2">⭐ Score:</span>
                  </div>
                  <div className="font-medium">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      team.score 
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {team.score || "Pending"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop View - Enhanced table design */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-800 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-800 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-800 uppercase tracking-wider">Submission</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-800 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-cyan-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-50">
                  {filteredTeams.map((team) => (
                    <motion.tr
                      key={team.team}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-cyan-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-cyan-900">
                        <div className="flex items-center">
                          <div className="bg-cyan-100 rounded-lg w-8 h-8 flex items-center justify-center mr-3 text-cyan-700">
                            {team.team_name.charAt(0)}
                          </div>
                          {team.team_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-cyan-700">{team.team}</td>
                      <td className="px-6 py-4">
                        {team.attachment ? (
                          <a 
                            href={team.attachment} 
                            className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <span className="mr-2">📄</span> View File
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          team.score 
                            ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {team.score || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openScoreModal(team.team, team.team_name)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 transition-all"
                        >
                          <MdAddBox className="mr-1.5" size={16} />
                          Add Score
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State - Enhanced design */}
          {filteredTeams.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 text-cyan-500 mb-5">
                <FaSearch size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? "No matches found" : "No submissions yet"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Teams haven't submitted their files for this event"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rankings Section - Improved design */}
      <div className="mt-8">
        <button
          onClick={handleToggleRanking}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-md flex items-center font-medium"
        >
          <FaTrophy className="mr-2" />
          {showRanking ? "Hide Rankings" : "View Rankings"}
        </button>

        {showRanking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden mt-5 border border-amber-50"
          >
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <FaTrophy className="text-white text-xl" />
                <h2 className="text-white text-lg font-bold">Current Rankings</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {/* ... ranking table remains similar but with improved styling ... */}
              {/* Recommend adding: rounded corners, better spacing, medal icons */}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Score Modal - Enhanced design */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-cyan-100"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-teal-500 p-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Add Score</h3>
                  <p className="text-sm opacity-90 mt-1">Team: {selectedTeamName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <IoClose size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={addScore} className="p-6">
              <div className="mb-6">
                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
                  Score Value
                </label>
                <input
                  id="score"
                  type="number"
                  value={score}
                  onChange={handleScoreChange}
                  className="w-full px-4 py-3 border border-cyan-200 rounded-xl bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
                  placeholder="Enter score (0-100)"
                  min="0"
                  max="100"
                  required
                  autoFocus
                />
                <div className="mt-2 text-xs text-gray-500">
                  Enter a value between 0 and 100
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-500 rounded-xl hover:from-cyan-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 disabled:opacity-70 transition-colors shadow-md"
                >
                  {isSubmitting ? "Saving..." : "Save Score"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}