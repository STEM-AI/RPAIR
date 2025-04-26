
import { useState, useEffect, useCallback, useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Alert from "../../../../../../../components/Alert/Alert";
import Swal from "sweetalert2";
import axios from "axios";
import { FaDownload, FaTrophy, FaClock, FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useEventNameContext } from "../../../../../../../context/EventName";

// Constants
export const INITIAL_TIME = 5 * 60; // 5 minutes in seconds
export const GAME_MODES = [
  {
    name: "Manual",
    missions: [
      { step: "Mission 1", description: "From Point 1 to Point 2", points: 5 },
      { step: "Mission 2", description: "From Point 2 to Point 3", points: 5 },
      { step: "Mission 3", description: "From Point 3 to Point 4", points: 5 }
    ]
  },
  {
    name: "Coder Card",
    missions: [
      { step: "Mission 4", description: "From Point 4 to Point 5", points: 10 },
      { step: "Mission 5", description: "From Point 5 to Point 6", points: 5 }
    ]
  },
  {
    name: "Programming",
    missions: [
      { step: "Mission 6", description: "From Point 6 to the End Line", points: 10 }
    ]
  }
];

export const getModeKey = (modeName) => modeName.toLowerCase().replace(/\s+/g, '');
export const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Components
function Header() {
  return (
    <>
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">🤖 VEX123 Robotics</h1>
        <p className="text-sm sm:text-base md:text-xl text-gray-600">Performance Score Sheet</p>
      </div>
    </>
  );
}

function TeamInput({ selectedTeam, setSelectedTeam }) {
  const { currentCompetition } = useEventNameContext();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/list/`,
          {
            params: { competition_event__name: currentCompetition },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeams(res.data);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch teams", "error");
      } finally {
        setLoading(false);
      }
    };

    if (currentCompetition) {
      fetchTeams();
    }
  }, [token, currentCompetition]);

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    const team = teams.find((t) => t.id === parseInt(teamId));
    setSelectedTeam(team || null);
  };

  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
      <label className="block text-sm sm:text-base font-semibold text-indigo-700 mb-1">
        👥 Team Name
      </label>
      {loading ? (
        <div className="w-full p-2 sm:p-3 border rounded-lg bg-white text-sm sm:text-base">
          Loading teams...
        </div>
      ) : (
        <select
          value={selectedTeam?.id || ""}
          onChange={handleTeamChange}
          className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white text-sm sm:text-base"
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function TimerControls({ 
  timer, 
  isRunning, 
  setIsRunning, 
  resetTimer, 
  currentMode, 
  completedModes 
}) {
  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between items-center">
        <div className="flex items-center">
          <FaClock className="text-indigo-600 mr-2 text-lg sm:text-xl" />
          <span className={`text-base sm:text-xl font-semibold ${
            timer <= 60 ? 'text-red-600' : 'text-gray-700'
          }`}>
            {formatTime(timer)}
          </span>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (!completedModes.includes(currentMode?.name)) {
                setIsRunning(!isRunning);
              }
            }}
            disabled={timer === 0 || completedModes.includes(currentMode?.name)}
            className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-lg flex items-center justify-center ${
              isRunning
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } ${timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRunning ? <FaPause className="mr-1 sm:mr-2" /> : <FaPlay className="mr-1 sm:mr-2" />}
            <span className="text-xs sm:text-sm">{isRunning ? "Pause" : "Start"}</span>
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center"
            disabled={!currentMode}
          >
            <FaRedo className="mr-1 sm:mr-2" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function GameModeNavigation({ 
  GAME_MODES, 
  handleGameModeSelect, 
  currentMode, 
  completedModes,
  selectedTeam,
  totalTime
}) {
  const { currentCompetition } = useEventNameContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const formatTimeForAPI = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleModeSelection = async (mode) => {
    if (!selectedTeam?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Team Required',
        text: 'Please select a team before choosing a game mode',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/vex-123/${currentCompetition}/game/create/`,
        {
          team1: selectedTeam.id,
          time: formatTimeForAPI(totalTime)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data?.id) {
        throw new Error("Invalid game creation response");
      }

      handleGameModeSelect({
        mode,
        gameId: response.data.id,
        teamId: selectedTeam.id,
        gameData: response.data
      });

    } catch (error) {
      console.error("Game creation error:", error);
      console.error("Game creation error details:", error.response?.data);

      Swal.fire({
        icon: 'error',
        title: 'Game Creation Failed',
        text: error.response?.data?.message || 
             error.response?.data?.time?.[0] || 
             'Could not create game session',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-3 rounded-lg overflow-x-auto">
      <h2 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">
        Game Mode Progress {loading && "(Processing...)"}
      </h2>
      <div className="flex space-x-2 min-w-max">
        {GAME_MODES.map((mode) => (
          <div key={mode.name} className="flex flex-col items-center min-w-[100px]">
            <button
              onClick={() => handleModeSelection(mode)}
              disabled={loading || completedModes.includes(mode.name)}
              className={`w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                completedModes.includes(mode.name)
                  ? "bg-green-600 text-white shadow-md cursor-default"
                  : currentMode?.name === mode.name
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {mode.name}
            </button>
            {completedModes.includes(mode.name) && (
              <span className="text-[10px] sm:text-xs mt-1 text-green-600">
                ✓ Completed
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MissionTable({ 
  currentMode, 
  currentModeData, 
  isRunning, 
  completedModes, 
  handleModeComplete,
  handleMissionComplete,
  getTimeDifference,
  currentGame
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("access_token");

  if (!currentMode) return null;

  const handleCompleteWithScore = async () => {
    if (!currentGame?.gameId) {
      Swal.fire({
        icon: 'error',
        title: 'Game Session Error',
        text: 'No active game session found',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const totalScore = currentMode.missions.reduce((sum, mission, index) => {
        return sum + (currentModeData?.done[index] ? mission.points : 0);
      }, 0);
      
      const totalTime = currentMode.missions.reduce((sum, mission, index) => {
        return sum + (currentModeData?.done[index] ? getTimeDifference(index) : 0);
      }, 0);

      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/vex-123/game/${currentGame.gameId}/`,
        {
          score: totalScore,
          time_taken: totalTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.id) {
        handleModeComplete();
        
        Swal.fire({
          icon: 'success',
          title: 'Score Submitted',
          text: `Successfully submitted ${totalScore} points`,
          confirmButtonColor: '#6366f1'
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Score submission error:", error);
      console.log("Error Response:", error.response.data);
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Could not submit scores',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-4 sm:mb-6 bg-white p-2 sm:p-3 rounded-lg border border-indigo-100 overflow-x-auto">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-indigo-700 mb-2 sm:mb-3">
        {currentMode.name} Missions
      </h2>
      <div className="min-w-[400px] sm:min-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Mission</th>
              <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Description</th>
              <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Points</th>
              <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Time</th>
              <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Done</th>
            </tr>
          </thead>
          <tbody>
            {currentMode.missions.map((mission, index) => (
              <tr key={index} className="border-b border-indigo-50">
                <td className="px-2 py-1 sm:px-3 sm:py-2 font-medium text-gray-800 text-xs sm:text-sm">
                  {mission.step}
                </td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-xs sm:text-sm">
                  {mission.description}
                </td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                  {mission.points}
                </td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                  {formatTime(getTimeDifference(index))}
                </td>
                <td className="px-2 py-1 sm:px-3 sm:py-2 text-center">
                  <input
                    type="checkbox"
                    onChange={() => handleMissionComplete(index)}
                    checked={!!currentModeData?.done[index] || false}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isRunning || completedModes.includes(currentMode.name)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 sm:mt-3 flex justify-end">
        <button
          onClick={handleCompleteWithScore}
          disabled={!isRunning || completedModes.includes(currentMode.name) || isSubmitting}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center ${
            !isRunning || completedModes.includes(currentMode.name)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          } ${isSubmitting ? "opacity-75" : ""}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            completedModes.includes(currentMode.name) ? "Completed" : "Mark Complete"
          )}
        </button>
      </div>
    </div>
  );
}

function SummarySection({ 
  totalScore, 
  totalPossible, 
  totalTime, 
  handleDownloadPDF, 
  teamName 
}) {
  const { currentCompetition } = useEventNameContext();
  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [teamRank, setTeamRank] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchRankings = async () => {
      if (!currentCompetition || !teamName) return;
      
      try {
        setLoadingRankings(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/vex-123/${currentCompetition}/rank/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRankings(response.data);
        
        const currentTeamRank = response.data.find(
          (team) => team.team_name === teamName
        );
        setTeamRank(currentTeamRank);
      } catch (error) {
        console.error("Failed to fetch rankings:", error);
        Swal.fire({
          icon: 'error',
          title: 'Rankings Unavailable',
          text: 'Could not load team rankings',
          confirmButtonColor: '#6366f1'
        });
      } finally {
        setLoadingRankings(false);
      }
    };

    fetchRankings();
  }, [currentCompetition, teamName, token]);

  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg space-y-4">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Score</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {totalScore} / {totalPossible} points
          </p>
        </div>
        
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Time</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {formatTime(totalTime)}
          </p>
        </div>
        
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Team Rank</h3>
          <p className="text-xl sm:text-2xl font-bold flex items-center justify-center">
            {loadingRankings ? (
              <span className="text-sm">Loading...</span>
            ) : teamRank ? (
              <>
                <FaTrophy className="mr-1 text-yellow-500" />
                #{teamRank.rank || 'N/A'}
              </>
            ) : (
              'N/A'
            )}
          </p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
          disabled={!teamName}
        >
          <FaDownload className="mr-1 sm:mr-2" />
          <span>Download PDF</span>
        </button>
      </div>

      {rankings.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">
            Leaderboard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="px-2 py-1 text-left text-xs sm:text-sm">Rank</th>
                  <th className="px-2 py-1 text-left text-xs sm:text-sm">Team</th>
                  <th className="px-2 py-1 text-xs sm:text-sm">Score</th>
                  <th className="px-2 py-1 text-xs sm:text-sm">Time</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((team, index) => (
                  <tr 
                    key={team.team} 
                    className={`border-b border-indigo-50 ${
                      team.team_name === teamName ? 'bg-indigo-100 font-semibold' : ''
                    }`}
                  >
                    <td className="px-2 py-1 text-xs sm:text-sm">{index + 1}</td>
                    <td className="px-2 py-1 text-xs sm:text-sm">
                      {team.team_name}
                      {team.team_name === teamName && (
                        <span className="ml-1 text-xs text-indigo-500">(Your Team)</span>
                      )}
                    </td>
                    <td className="px-2 py-1 text-center text-xs sm:text-sm">{team.total_score}</td>
                    <td className="px-2 py-1 text-center text-xs sm:text-sm">{formatTime(team.total_time_taken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Container Component
export default function CompetitionSheetContainer() {
  // State
  const [completedOrder, setCompletedOrder] = useState([]);
  const [taskStartTime, setTaskStartTime] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [timer, setTimer] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);
  const [completedModes, setCompletedModes] = useState([]);
  const token = localStorage.getItem("access_token");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  // Data structure for all modes
  const [allData, setAllData] = useState(() => {
    const initialData = {};
    GAME_MODES.forEach(mode => {
      initialData[getModeKey(mode.name)] = {
        times: {},
        done: {},
        timeDiffs: {}
      };
    });
    return initialData;
  });

  useEffect(() => {
    const newAllData = { ...allData };
    
    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeCompleted = completedOrder
        .filter(item => item.modeKey === modeKey)
        .sort((a, b) => a.time - b.time);

      newAllData[modeKey].timeDiffs = calculateTimeDiffs(modeCompleted);
    });

    setAllData(newAllData);
  }, [completedOrder]);

  const currentModeKey = currentMode ? getModeKey(currentMode.name) : null;
  const currentModeData = currentModeKey ? allData[currentModeKey] : null;
  
  useEffect(() => {
    if (isRunning && currentMode) {
      setTaskStartTime(INITIAL_TIME - timer);
    }
  }, [currentMode, isRunning]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Calculate scores
  const { totalScore, totalPossible, totalTime } = useMemo(() => {
    let totalScore = 0;
    let totalPossible = 0;
    let totalTime = 0;

    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { done: {}, times: {} };

      const modeCompleted = completedOrder
        .filter(item => item.modeKey === modeKey)
        .sort((a, b) => a.time - b.time);
      
      if (modeCompleted.length > 0) {
        totalTime += modeCompleted[0].time;
        
        for (let i = 1; i < modeCompleted.length; i++) {
          totalTime += (modeCompleted[i].time - modeCompleted[i-1].time);
        }
      }  
      
      const modeScore = mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
      
      totalScore += modeScore;
      totalPossible += mode.missions.reduce((sum, m) => sum + m.points, 0);
    });

    return { totalScore, totalPossible, totalTime };
  }, [allData, completedOrder]);

  const calculateTimeDiffs = (modeCompleted) => {
    const diffs = {};
    modeCompleted.forEach((task, idx) => {
      if (idx === 0) {
        diffs[task.taskIndex] = task.time;
      } else {
        diffs[task.taskIndex] = task.time - modeCompleted[idx - 1].time;
      }
    });
    return diffs;
  };

  const handleGameModeSelect = ({ mode, gameId }) => {
    setCurrentGame({ gameId });
    setTimer(INITIAL_TIME);
    setIsRunning(false);
    setCurrentMode(mode);
  };

  const handleModeComplete = useCallback(() => {
    if (!currentMode || !isRunning || completedModes.includes(currentMode.name)) return;

    Alert.confirm({
      title: `Complete ${currentMode.name} Mode?`,
      html: `<p>You're about to mark <strong>${currentMode.name}</strong> mode as completed.</p>`,
      confirmText: 'Yes, Complete',
      onConfirm: () => {
        setCompletedModes(prev => [...prev, currentMode.name]);
        setIsRunning(false);
        Alert.success({
          title: 'Mode Completed!',
          text: `${currentMode.name} mode has been marked as completed.`
        });
      }
    });
  }, [currentMode, completedModes, isRunning]);

  const handleMissionComplete = useCallback((index) => {
    if (!currentModeKey || !isRunning) return;

    const newDoneStatus = !currentModeData?.done[index];
    const completionTime = INITIAL_TIME - timer;

    setAllData(prev => ({
      ...prev,
      [currentModeKey]: {
        ...prev[currentModeKey],
        done: { ...prev[currentModeKey].done, [index]: newDoneStatus },
        times: { ...prev[currentModeKey].times, [index]: completionTime }
      }
    }));

    if (newDoneStatus) {
      setCompletedOrder(prev => [
        ...prev,
        {
          modeKey: currentModeKey,
          taskIndex: index,
          time: completionTime
        }
      ]);
    } else {
      setCompletedOrder(prev =>
        prev.filter(item =>
          !(item.modeKey === currentModeKey && item.taskIndex === index)
        )
      );
    }
  }, [currentModeKey, isRunning, timer, currentModeData]);

  const getTimeDifference = (index) => {
    if (!currentModeKey) return 0;
    
    const modeCompleted = completedOrder.filter(
      item => item.modeKey === currentModeKey
    ).sort((a, b) => a.time - b.time);
    
    const currentTask = modeCompleted.find(t => t.taskIndex === index);
    if (!currentTask) return 0;
    
    const taskIndex = modeCompleted.findIndex(t => t.taskIndex === index);
    
    if (taskIndex === 0) {
      return currentTask.time;
    }
    
    const prevTime = modeCompleted[taskIndex - 1].time;
    return currentTask.time - prevTime;
  };

  const resetTimer = useCallback(() => {
    if (!currentMode) return;

    const modeKey = getModeKey(currentMode.name);
    
    setAllData(prev => ({
      ...prev,
      [modeKey]: {
        times: {},
        done: {},
        timeDiffs: {},
        startTime: INITIAL_TIME
      }
    }));

    setCompletedModes(prev => prev.filter(mode => mode !== currentMode.name));
    setIsRunning(false);
    setTimer(INITIAL_TIME);
    setCompletedOrder(prev =>
      prev.filter(item => item.modeKey !== modeKey)
    );
  }, [currentMode]);

  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX123 Competition Score Sheet", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${teamName}`, 20, 30);
    doc.text(`Time Remaining: ${formatTime(totalTime)}`, 20, 40);

    let finalY = 50;
    let totalMissionTime = 0;
    
    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { timeDiffs: {} };
      const missionDiffs = Object.values(modeData.timeDiffs);
      totalMissionTime += missionDiffs.reduce((sum, diff) => sum + diff, 0);
    });
    
    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { times: {}, done: {}, timeDiffs: {} };
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${mode.name} Mode`, 20, finalY);
      finalY += 10;
      
      const tableData = mode.missions.map((mission, index) => [
        mission.step,
        mission.description,
        mission.points,
        modeData.timeDiffs && modeData.timeDiffs[index] !== undefined ?
        `${formatTime(modeData.timeDiffs[index])}` : "N/A",
        modeData.done[index] ? "✔️" : "❌",
      ]);

      doc.autoTable({
        startY: finalY,
        head: [["Step", "Description", "Points", "Time", "Completed"]],
        body: tableData,
        theme: "striped",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [240, 240, 255]
        },
        margin: { left: 10, right: 10 }
      });
      
      const modeScore = mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
      
      const totalPossible = mode.missions.reduce((sum, m) => sum + m.points, 0);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${mode.name} Score: ${modeScore}/${totalPossible}`,
        20, doc.autoTable.previous.finalY + 10);
      
      finalY = doc.autoTable.previous.finalY + 20;
    });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Final Score: ${totalScore}/${totalPossible}`, 20, finalY);
    
    doc.save(`Team_${teamName}_Score_Sheet.pdf`);
  }, [teamName, allData, totalScore, totalPossible]);

  // Update team name when selected team changes
  useEffect(() => {
    if (selectedTeam) {
      setTeamName(selectedTeam.name);
    } else {
      setTeamName("");
    }
  }, [selectedTeam]);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 bg-white shadow-xl rounded-xl border border-gray-200">
      <Header />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <TeamInput selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />
        <TimerControls 
          timer={timer}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          resetTimer={resetTimer}
          currentMode={currentMode}
          completedModes={completedModes}
        />
      </div>

      <GameModeNavigation
        GAME_MODES={GAME_MODES}
        handleGameModeSelect={handleGameModeSelect}
        currentGame={currentGame}
        currentMode={currentMode}
        completedModes={completedModes}
        selectedTeam={selectedTeam}
        totalTime={totalTime}
      />

      <MissionTable
        currentGame={currentGame}
        currentMode={currentMode}
        currentModeData={currentModeData}
        isRunning={isRunning}
        completedModes={completedModes}
        handleMissionComplete={handleMissionComplete}
        handleModeComplete={handleModeComplete}
        getTimeDifference={getTimeDifference}
        totalTime={totalTime}
      />

      <SummarySection 
        totalScore={totalScore}
        totalPossible={totalPossible}
        totalTime={totalTime}
        handleDownloadPDF={handleDownloadPDF}
        teamName={teamName}
      />
    </div>
  );
}