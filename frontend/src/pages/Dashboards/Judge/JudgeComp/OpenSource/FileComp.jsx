import React, { useState, useEffect } from "react";
import { MdAddBox, MdOutlineScore } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { FiSearch } from "react-icons/fi";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

export default function FileComp() {
  const { competition_name } = useParams();
  const [searchParams] = useSearchParams();
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
  const navigate = useNavigate();
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
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
        {event_name?.replace(/_/g, ' ')} Competition
        </h1>
        {/* <p className="mt-2 text-gray-600">Event: {event_name?.replace(/_/g, ' ')}</p> */}
        <div className="mt-4 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 w-24 mx-auto rounded-full" />
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Status Messages */}
      {responseMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert severity={alertType} className="rounded-lg">
            <AlertTitle className="capitalize">{alertType}</AlertTitle>
            {responseMessage}
          </Alert>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" className="mb-6 rounded-lg">
          <AlertTitle>Error</AlertTitle>
          {responseMessage}
        </Alert>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* Mobile View */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-800">{team.team_name}</h3>
                    <p className="text-sm text-gray-500">{team.competition_event_name}</p>
                  </div>
                  <button
                    onClick={() => openScoreModal(team.team, team.team_name)}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                    aria-label="Add score"
                  >
                    <MdAddBox size={20} />
                  </button>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Team ID:</div>
                  <div className="font-medium">{team.team}</div>
                  <div className="text-gray-500">File:</div>
                  <div className="font-medium">

                      {team.attachment ? (
                        <a 
                          href={team.attachment} 
                          className="text-blue-500 hover:underline"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Uploaded
                        </a>
                      ) : (
                        "None"
                      )}
                  </div>
                  <div className="text-gray-500">Score:</div>
                  <div className={`font-medium ${team.score ? "text-cyan-600" : "text-gray-400"}`}>
                    {team.score || "Not scored"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wider">Team Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wider">Team ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wider">file</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTeams.map((team) => (
                    <motion.tr
                      key={team.team}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-cyan-900">{team.team_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{team.competition_event_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{team.team}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                      {team.attachment ? (
                        <a 
                          href={team.attachment} 
                          className="text-blue-500 hover:underline"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Uploaded
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${team.score ? "bg-cyan-100 text-cyan-800" : "bg-gray-100 text-gray-800"}`}>
                          {score || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openScoreModal(team.team, team.team_name)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                        >
                          <MdAddBox className="mr-1" size={14} />
                          Score
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {filteredTeams.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <FiSearch size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                No teams found
              </h3>
              <p className="text-gray-400">
                {searchQuery ? "Try a different search term" : "No teams registered for this event"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Score Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Add Score</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 p-1 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">Team: {selectedTeamName}</p>
            </div>

            <form onSubmit={addScore} className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Score
                  </label>
                  <input
                    id="score"
                    type="number"
                    value={score}
                    onChange={handleScoreChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    placeholder="0-100"
                    min="0"
                    max="100"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Score"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}