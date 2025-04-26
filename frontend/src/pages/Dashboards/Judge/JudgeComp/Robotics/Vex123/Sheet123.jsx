import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload } from "react-icons/fa";
import { useEventNameContext } from "../../../../../../context/EventName";

// Constants
const INITIAL_TIME = 5 * 60; // 5 minutes in seconds
const GAME_MODES = [
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

const Sheet123 = () => {
  const { currentCompetition } = useEventNameContext();
  const token = localStorage.getItem("access_token");

  // State Management
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);
  const [timer, setTimer] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [teamGames, setTeamGames] = useState({});
  const [missionStatus, setMissionStatus] = useState({});
  const [teamScores, setTeamScores] = useState({}); // Track scores per team
  const [teamTimes, setTeamTimes] = useState({}); // Track times per team

  // Timer Management
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate total time and score for a team
  const calculateTeamTotals = (teamId) => {
    let totalScore = 0;
    let totalTime = 0;
    
    if (teamScores[teamId]) {
      totalScore = Object.values(teamScores[teamId]).reduce((sum, score) => sum + score, 0);
    }
    
    if (teamTimes[teamId]) {
      totalTime = Object.values(teamTimes[teamId]).reduce((sum, time) => sum + time, 0);
    }
    
    return { totalScore, totalTime };
  };

  // Fetch teams for the current competition
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/list/`,
          {
            params: { competition_event__name: currentCompetition },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setTeams(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch teams', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (currentCompetition) {
      fetchTeams();
    }
  }, [currentCompetition, token]);

  // Handle team selection
  const handleTeamSelect = (event) => {
    const team = teams.find(t => t.id.toString() === event.target.value);
    setSelectedTeam(team);
  };

  // Create new game when timer starts
  const createGame = async (team) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/vex-123/${currentCompetition}/game/create/`,
        {
          team1: team.id.toString(),
          time: formatTime(INITIAL_TIME)
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCurrentGame(response.data);
      setTeamGames(prev => ({
        ...prev,
        [team.id]: {
          ...prev[team.id],
          [currentMode?.name || 'manual']: response.data.id
        }
      }));
      
      return response.data.id;
    } catch (error) {
      Swal.fire('Error', 'Failed to create game', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle mode selection
  const handleModeSelect = (mode) => {
    if (!selectedTeam) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a team first',
        icon: 'error'
      });
      return;
    }

    // Check if mode is already completed for this team
    if (teamGames[selectedTeam?.id]?.[mode.name]) {
      Swal.fire({
        title: 'Mode Already Completed',
        text: `This team has already completed the ${mode.name} mode`,
        icon: 'warning'
      });
      return;
    }

    setCurrentMode(mode);
    setTimer(INITIAL_TIME);
    setIsRunning(false);
    setMissionStatus({});
  };

  // Start game when timer starts
  const handleStartTimer = async () => {
    if (!selectedTeam || !currentMode) {
      Swal.fire({
        title: 'Error',
        text: 'Please select both team and game mode first',
        icon: 'error'
      });
      return;
    }

    // Create game when starting timer
    const gameId = await createGame(selectedTeam);
    if (gameId) {
      setIsRunning(true);
    }
  };

  // Handle timer controls
  const handleTimerControl = async () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      handleStartTimer();
    }
  };

  // Handle mission completion
  const handleMissionComplete = (missionIndex) => {
    if (!isRunning) {
      Swal.fire('Warning', 'Please start the timer first', 'warning');
      return;
    }
    setMissionStatus(prev => ({
      ...prev,
      [missionIndex]: !prev[missionIndex]
    }));
  };

  // Calculate total score
  const calculateScore = () => {
    return currentMode.missions.reduce((total, mission, index) => {
      return total + (missionStatus[index] ? mission.points : 0);
    }, 0);
  };

  // Handle round completion
  const handleRoundComplete = async () => {
    if (!currentGame) return;

    const result = await Swal.fire({
      title: 'Complete Round?',
      text: 'Are you sure you want to complete this round?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete it',
      cancelButtonText: 'No, continue'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const score = calculateScore();
        const timeTaken = INITIAL_TIME - timer;

        await axios.patch(
          `${process.env.REACT_APP_API_URL}/vex-123/game/${currentGame.id}/`,
          {
            score: score,
            time_taken: timeTaken
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Update team scores and times
        setTeamScores(prev => ({
          ...prev,
          [selectedTeam.id]: {
            ...prev[selectedTeam.id],
            [currentMode.name]: score
          }
        }));

        setTeamTimes(prev => ({
          ...prev,
          [selectedTeam.id]: {
            ...prev[selectedTeam.id],
            [currentMode.name]: timeTaken
          }
        }));

        Swal.fire('Success', 'Round completed successfully!', 'success');
        setCurrentGame(null);
        setTimer(INITIAL_TIME);
        setIsRunning(false);
        setMissionStatus({});
      } catch (error) {
        Swal.fire('Error', 'Failed to complete round', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-xl rounded-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">🤖 VEX123 Robotics</h1>
        <p className="text-gray-600">Performance Score Sheet</p>
      </div>

      {/* Team Selection */}
      <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
        <label className="block font-semibold text-indigo-700 mb-2">
          Select Team
        </label>
        <select
          className="w-full p-2 border rounded"
          value={selectedTeam?.id || ""}
          onChange={handleTeamSelect}
          disabled={loading}
        >
          <option value="">Choose a team...</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {selectedTeam && (
          <div className="mt-4 p-3 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-indigo-700">Team Stats</h3>
                <p className="text-sm text-gray-600">Team: {selectedTeam.name}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm font-semibold">Total Score</p>
                  <p className="text-lg">{calculateTeamTotals(selectedTeam.id).totalScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Total Time</p>
                  <p className="text-lg">{formatTime(calculateTeamTotals(selectedTeam.id).totalTime)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Modes */}
      <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
        <h2 className="font-semibold text-indigo-700 mb-2">Game Modes</h2>
        <div className="grid grid-cols-3 gap-4">
          {GAME_MODES.map(mode => {
            const isCompleted = teamGames[selectedTeam?.id]?.[mode.name];
            return (
              <button
                key={mode.name}
                onClick={() => handleModeSelect(mode)}
                disabled={loading || !selectedTeam || isCompleted}
                className={`
                  p-3 rounded-lg transition-all duration-200
                  ${isCompleted ? 'bg-green-500 text-white' : 'bg-white hover:bg-indigo-100'}
                  ${currentMode?.name === mode.name ? 'ring-2 ring-indigo-500' : ''}
                `}
              >
                <h3 className="font-semibold mb-1">{mode.name}</h3>
                {isCompleted && (
                  <div className="text-sm">
                    <p>Score: {teamScores[selectedTeam?.id]?.[mode.name] || 0}</p>
                    <p>Time: {formatTime(teamTimes[selectedTeam?.id]?.[mode.name] || 0)}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timer and Missions */}
      {currentMode && (
        <>
          <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold">
                {formatTime(timer)}
              </div>
              <div className="space-x-2">
                <button
                  onClick={handleTimerControl}
                  disabled={!selectedTeam || !currentMode}
                  className={`
                    px-4 py-2 rounded text-white
                    ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}
                    disabled:opacity-50
                  `}
                >
                  {isRunning ? (
                    <>
                      <FaPause className="inline mr-2" /> Pause
                    </>
                  ) : (
                    <>
                      <FaPlay className="inline mr-2" /> {timer === INITIAL_TIME ? 'Start' : 'Resume'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setTimer(INITIAL_TIME);
                    setIsRunning(false);
                  }}
                  disabled={!selectedTeam || !currentMode || timer === INITIAL_TIME}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                >
                  <FaRedo className="inline mr-2" /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
            <h2 className="font-semibold text-indigo-700 mb-4">
              {currentMode.name} Missions
            </h2>
            <div className="space-y-4">
              {currentMode.missions.map((mission, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-3 rounded
                    ${missionStatus[index] ? 'bg-green-50 border-2 border-green-500' : 'bg-white'}
                  `}
                >
                  <div>
                    <div className="font-medium">{mission.step}</div>
                    <div className="text-sm text-gray-600">{mission.description}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-indigo-600 font-bold">
                      {mission.points} pts
                    </div>
                    <button
                      onClick={() => handleMissionComplete(index)}
                      disabled={!isRunning}
                      className={`
                        px-3 py-1 rounded text-white
                        ${missionStatus[index] ? 'bg-green-500' : 'bg-gray-500 hover:bg-gray-600'}
                        disabled:opacity-50
                      `}
                    >
                      {missionStatus[index] ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
            <div className="text-xl font-bold text-indigo-700">
              Total Score: {calculateScore()}
            </div>
            <button
              onClick={handleRoundComplete}
              disabled={loading || !isRunning}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Complete Round
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sheet123;