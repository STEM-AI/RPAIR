import React, { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import { FaTrophy, FaSearch, FaMedal } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useParams, useSearchParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegFileCode } from "react-icons/fa";
import AddScore from "./AddScore";

const theme = {
  primary: {
    light: "#06b6d4",
    main: "#0891b2",
    dark: "#0e7490"
  },
  secondary: {
    light: "#f59e0b",
    main: "#d97706",
    dark: "#b45309"
  },
  text: {
    primary: "#1e293b",
    secondary: "#64748b"
  },
  background: {
    light: "#f8fafc",
    paper: "#ffffff"
  }
};

export default function FileComp() {
  const { competition_name } = useParams();
  const [searchParams] = useSearchParams();
  const [showRanking, setShowRanking] = useState(false);
  const [rankings, setRankings] = useState([]);
  const event_name = searchParams.get('eventName');
  const event_id = searchParams.get('eventId');
  const [searchQuery, setSearchQuery] = useState("");
  const [tempScores, setTempScores] = useState({});
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

  const getTeamScore = (teamId) => {
    const teamRanking = rankings.find(team => team.team === teamId);
    return teamRanking ? teamRanking.score : null;
  };

  const handleScore = (score) => {
    setTempScores((prev) => ({
      ...prev,
      [selectedTeam]: score,
    }));
    setSelectedTeam(null);
  };

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

    const myAPI = `${process.env.REACT_APP_API_URL}/${competition_name}/${event_id}/`;
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
        `${process.env.REACT_APP_API_URL}/${competition_name}/${event_id}/rank/`,
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
        `${process.env.REACT_APP_API_URL}/${competition_name}/${event_id}/score/${selectedTeam}/`,
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
      fetchCoopRankings(); // Refresh rankings after adding score
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
    fetchCoopRankings(); // Fetch rankings on initial load
  }, [token, event_id]);

  const filteredTeams = teams.filter(team => {
    const matchesName = team.team_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesName;
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Enhanced Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent pb-2">
          {event_name?.replace(/_/g, ' ')} Submissions
        </h1>
        <div className="mt-4 h-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 w-24 mx-auto rounded-full opacity-80" />
        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
          Manage team submissions and scores for this competition event
        </p>
      </motion.div>

      {/* Improved Search Bar with Floating Label */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-cyan-500" />
          </div>
          <input
            type="text"
            placeholder=" "
            className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-cyan-100 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all shadow-sm peer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label className="absolute left-12 top-3 text-slate-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-sm peer-focus:text-cyan-600">
            Search teams...
          </label>
        </div>
      </div>

      {/* Enhanced Status Messages */}
      <AnimatePresence>
        {responseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 mx-auto max-w-4xl"
          >
            <Alert 
              severity={alertType} 
              className="rounded-xl shadow-lg border-l-4 border-cyan-500"
              sx={{
                '&.MuiAlert-filledSuccess': {
                  backgroundColor: '#ecfdf5',
                  color: '#065f46'
                },
                '&.MuiAlert-filledError': {
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c'
                }
              }}
            >
              <AlertTitle className="capitalize font-medium">{alertType}</AlertTitle>
              {responseMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-slate-600 font-medium"
          >
            Loading submissions...
          </motion.p>
        </div>
      )}

      {/* Enhanced Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {filteredTeams.map((team) => (
          <motion.div
            key={team.team}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{team.team_name}</h3>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="bg-cyan-100 text-cyan-800 text-xs px-2.5 py-1 rounded-full font-medium">
                    ID: {team.team}
                  </span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => openScoreModal(team.team, team.team_name)}
                className="ml-3 p-2.5 bg-gradient-to-br from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl text-white shadow-sm transition-all"
                aria-label="Add score"
              >
                <MdAddBox size={20} />
              </motion.button>
            </div>
            
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="text-slate-500">Submission</div>
              <div className="font-medium">
                {team.attachment ? (
                  <a 
                    href={team.attachment} 
                    className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FaRegFileCode className="mr-2 text-slate-700" />
                    View File
                  </a>
                ) : (
                  <span className="text-slate-400">Not submitted</span>
                )}
              </div>
              
              <div className="text-slate-500">Score</div>
              <div className="font-medium">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  getTeamScore(team.team)
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {getTeamScore(team.team) || "Pending"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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
            <tbody className="divide-y divide-slate-100">
              {filteredTeams.map((team) => (
                <motion.tr
                  key={team.team}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(8, 145, 178, 0.05)" }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    <div className="flex items-center">
                      <div className="bg-cyan-100 rounded-lg w-10 h-10 flex items-center justify-center mr-3 text-cyan-700 font-bold shadow-inner">
                        {team.team_name.charAt(0)}
                      </div>
                      {team.team_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{team.team}</td>
                  <td className="px-6 py-4">
                    {team.attachment ? (
                      <a 
                        href={team.attachment} 
                        className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FaRegFileCode className="mr-2 text-slate-700" />
                        View File
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      getTeamScore(team.team)
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md" 
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {getTeamScore(team.team) || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openScoreModal(team.team, team.team_name)}
                      className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 transition-all"
                    >
                      <MdAddBox className="mr-2" size={16} />
                      Add Score
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Empty State */}
      {filteredTeams.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-100"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-50 text-cyan-500 mb-6">
            <FaSearch size={40} />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-3">
            {searchQuery ? "No matches found" : "No submissions yet"}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {searchQuery 
              ? "Try adjusting your search query" 
              : "Teams haven't submitted their files for this event"}
          </p>
          {!searchQuery && (
            <button
              onClick={fetchTeams}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl shadow-sm font-medium transition-all"
            >
              Refresh
            </button>
          )}
        </motion.div>
      )}

      {/* Enhanced Rankings Section */}
      <div className="mt-12">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggleRanking}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-md flex items-center font-medium mx-auto transition-all"
        >
          <FaTrophy className="mr-2" />
          {showRanking ? "Hide Rankings" : "View Rankings"}
        </motion.button>

        {showRanking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                  ⚠️ Error loading rankings: {error}
                </div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
                  🏟️ No rankings available yet
                </div>
              ) : (
                <div className="grid gap-4">
                  {rankings.map((team, index) => {
                    const rank = index + 1;
                    return (
                      <motion.div
                        key={team.team}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-5 rounded-lg ${
                          rank <= 3 ? 'border-2 shadow-sm' : 'border hover:border-cyan-200'
                        } ${
                          rank === 1
                            ? 'border-amber-300 bg-amber-50'
                            : rank === 2
                            ? 'border-slate-300 bg-slate-50'
                            : rank === 3
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <span
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
                              rank <= 3
                                ? rank === 1
                                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md'
                                  : rank === 2
                                  ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-md'
                                  : 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md'
                                : 'bg-cyan-100 text-cyan-600'
                            }`}
                          >
                            {rank}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800">{team.team_name}</span>
                            <span className="text-xs text-slate-500">Team #{team.team}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-5">
                          <span className="text-xl font-bold text-cyan-600">
                            {typeof team.score === 'number' 
                              ? team.score.toFixed(2)
                              : 'N/A'}
                          </span>
                          {rank <= 3 && (
                            <span className={`flex items-center text-sm px-3 py-1 rounded-full ${
                              rank === 1 ? 'bg-amber-100 text-amber-800' :
                              rank === 2 ? 'bg-slate-100 text-slate-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {rank === 1 ? <FaMedal className="mr-1 text-amber-500" /> : 
                               rank === 2 ? <FaMedal className="mr-1 text-slate-400" /> : 
                               <FaMedal className="mr-1 text-amber-600" />}
                              {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {showModal && selectedTeam && (
        <AddScore
          onClose={() => setShowModal(false)}
          onScore={handleScore}
          eventName={event_name}
          eventID={event_id}
          competition_name={competition_name}
          selectedTeam={selectedTeam}
          selectedTeamName={selectedTeamName}
          onScoreAdded={() => {
            fetchTeams();
            fetchCoopRankings();
          }}
        />
      )}
    </div>
  );
}