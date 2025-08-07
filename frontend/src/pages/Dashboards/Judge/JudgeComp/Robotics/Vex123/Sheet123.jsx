import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { FaTrophy, FaMedal} from "react-icons/fa";
import useSound from 'use-sound';
import { useSearchParams } from "react-router-dom";
import useGetScore from "../../../../../../hooks/Schedule/GetScore";


// Constants
const INITIAL_TIME = 5 * 60; // 5 minutes in seconds
const GAME_MODES = [
  {
    name: "Manual",
    stage: "vex_123_manual",
    missions: [
      { step: "Mission 1", description: "From Point 1 to Point 2", points: 5 },
      { step: "Mission 2", description: "From Point 2 to Point 3", points: 5 },
      { step: "Mission 3", description: "From Point 3 to Point 4", points: 5 }
    ]
  },
  {
    name: "Coder Card",
    stage: "vex_123_coder_card",
    missions: [
      { step: "Mission 4", description: "From Point 4 to Point 5", points: 10 },
      { step: "Mission 5", description: "From Point 5 to Point 6", points: 5 }
    ]
  },
  {
    name: "Programming",
    stage: "vex_123_programming",
    missions: [
      { step: "Mission 6", description: "From Point 6 to the End Line", points: 10 }
    ]
  }
];

const Sheet123 = () => {
  const token = localStorage.getItem("access_token");
const [missionEndTimes, setMissionEndTimes] = useState({}); 

  // State Management
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);
  const [timer, setTimer] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [missionStatus, setMissionStatus] = useState({});
  
  const [hasPlayedEndSound, setHasPlayedEndSound] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [playStart] = useSound('/sounds/Vex123Start.mp3', { volume: 1 });
  const [playEnd] = useSound('/sounds/Vex123End.mp3', { volume: 1 });

    const [searchParams] = useSearchParams();
    const event_name = searchParams.get('eventName');
    const event_id = searchParams.get('eventId');
  
  const { score: manualGames ,refetch: refetchManualGames } = useGetScore(event_id, "vex_123_manual");
  const { score: coderCardGames ,refetch: refetchCoderCardGames } = useGetScore(event_id, "vex_123_coder_card");
  const { score: programmingGames ,refetch: refetchProgrammingGames } = useGetScore(event_id, "vex_123_programming");
  
  const processTeamGames = useMemo(() => {
    const teamStatus = {};
      const processGames = (games, modeName) => {
      if (!games) return;
      
      games.forEach(game => {
        if (game.completed && game.team1) {
          const teamId = game.team1;
          
          if (!teamStatus[teamId]) {
            teamStatus[teamId] = {};
          }
          
          teamStatus[teamId][modeName] = {
            completed: true,
            score: game.score,
            timeTaken: game.time_taken,
            gameId: game.id
          };
        }
      });
    };
    
    processGames(manualGames, "Manual");
    processGames(coderCardGames, "Coder Card");
    processGames(programmingGames, "Programming");
    
    return teamStatus;
}, [manualGames, coderCardGames, programmingGames]);
  
  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="w-6 h-6 text-amber-400" />;
      case 2:
        return <FaMedal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <FaMedal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-600 font-medium">{rank}</span>;
    }
  };

  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vex-123/${event_id}/rank/`
      );
      
      // Sort rankings by score then time
      const sortedData = response.data.sort((a, b) => {
        if (b.total_score !== a.total_score) {
          return b.total_score - a.total_score;
        }
        return a.total_time_taken - b.total_time_taken;
      });
      
      setRankings(sortedData);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

 
  // Timer Management
useEffect(() => {
  let interval;
  if (isRunning && timer > 0) {
    interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 6 && !hasPlayedEndSound) {
          playEnd();
          setHasPlayedEndSound(true);
        }
        return prevTimer - 1;
      });
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isRunning, timer, hasPlayedEndSound, playEnd]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

   const formatSeconds = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
 const calculateTeamTotals = (teamId) => {
    if (!teamId || !processTeamGames[teamId]) {
      return { totalScore: 0, totalTime: 0 };
    }

    let totalScore = 0;
    let totalTime = 0;

    // Sum scores and times from all modes
    Object.values(processTeamGames[teamId]).forEach(mode => {
      totalScore += mode.score || 0;
      totalTime += mode.timeTaken || 0;
    });

    return { totalScore, totalTime };
  };
 
  

 const generateTeamPDF = (team, event_name, GAME_MODES) => {
    if (!team || !GAME_MODES) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const accentColor = '#4F46E5';
   const textColor = '#374151';
     const teamData = processTeamGames[team.id] || {}; // FIX: Get team data


    // Header
    doc.setFillColor(accentColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("VEX123 Robotics Challenge", pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Competition: ${event_name}`, pageWidth / 2, 32, { align: 'center' });

    // Team Info
    let yPosition = 50;
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text(`Team Name: ${team.name}`, 20, yPosition);
    doc.text(`Team Number: ${team.id}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 15;

    // Total Performance
    const { totalScore, totalTime } = calculateTeamTotals(team.id);
    doc.setFillColor('#E0E7FF');
    doc.rect(15, yPosition, pageWidth - 30, 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor(accentColor);
    doc.text('TOTAL PERFORMANCE SUMMARY', 20, yPosition + 8);
    
    yPosition += 25;
    doc.setFontSize(24);
    doc.setTextColor(accentColor);
    doc.text(`${totalScore} Points`, 20, yPosition+5);
    doc.text(`${formatSeconds(totalTime)}`, pageWidth - 20, yPosition+5, { align: 'right' });

    // Game Modes - Show ALL modes
    yPosition += 20;
    GAME_MODES.forEach((mode) => {
    const modeInfo = teamData[mode.name];
    const modeScore = modeInfo?.score || 0;
    const modeTime = modeInfo?.timeTaken || 0;
    const isCompleted = !!modeInfo;
        // Mode Header
      doc.setFillColor(isCompleted ? '#E0F7FA' : '#FFF8E1');
      doc.rect(15, yPosition, pageWidth - 30, 10, 'F');
      doc.setFontSize(12);
      doc.setTextColor(isCompleted ? '#00838F' : '#F57F17');
      doc.text(`${mode.name} MODE ${isCompleted ? '(COMPLETED)' : '(PENDING)'}`, 20, yPosition + 7);

       // Score and Time
      doc.setTextColor(textColor);
      doc.text(`Score: ${modeScore}`, pageWidth - 60, yPosition + 7);
      doc.text(`Time: ${formatSeconds(modeTime)}`, pageWidth - 20, yPosition + 7, { align: 'right' });

         // Missions List
      yPosition += 15;
      mode.missions.forEach((mission) => {
        doc.setFontSize(10);
        doc.setTextColor(textColor);
        doc.text(`• ${mission.step}: ${mission.description}`, 25, yPosition);
        doc.setTextColor(isCompleted ? '#10B981' : '#9CA3AF');
        doc.text(`${mission.points} pts`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
      });
      yPosition += 10;
    });

    // Footer
    doc.setDrawColor(200);
    doc.line(15, 280, pageWidth - 15, 280);
    doc.setFontSize(8);
    doc.setTextColor(textColor);
    doc.text(`Report generated on: ${new Date().toLocaleString()}`, 20, 285);
    doc.text('VEX123 Official Score Report', pageWidth - 20, 285, { align: 'right' });

    doc.save(`VEX123_${team.name}_Report.pdf`);
  };

  // Fetch teams for the current competition
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/list/`,
          {
            params: { competition_event__id: event_id },
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

    if (event_id) {
      fetchTeams();
    }
  }, [event_id, token]);

  // Handle team selection
  const handleTeamSelect = (event) => {
    const team = teams.find(t => t.id.toString() === event.target.value);
    setSelectedTeam(team);
    setCurrentMode(null);
  };

  // Create new game when timer starts
  const createGame = async (team, stage) => { 

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/vex-123/${event_id}/game/${stage}/create/`,
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
      return response.data.id;

    } catch (error) {
      Swal.fire('Error', 'Failed to create game', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle mode selection
  const handleModeSelect = async(mode) => {
    if (!selectedTeam) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a team first',
        icon: 'error'
      });
      return;
    }

    // Check if mode is already completed for this team
    if (processTeamGames[selectedTeam?.id]?.[mode.name]) { // FIXED: use processTeamGames
      Swal.fire({
        title: 'Mode Already Completed',
        text: `This team has already completed the ${mode.name} mode`,
        icon: 'warning'
      });
      return;
    }
    
       const gameId = await createGame(selectedTeam, mode.stage); 

  if (!gameId) return;


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

    // Check if current mode is already completed
    const isModeCompleted = !!processTeamGames[selectedTeam.id]?.[currentMode.name];
    if (isModeCompleted) {
      Swal.fire({
        title: 'Mode Already Completed',
        text: 'This mode has already been completed for the selected team',
        icon: 'warning'
      });
      return;
    }

    setIsRunning(true);
    setHasPlayedEndSound(false); 
    playStart();
  };

  // Handle timer controls
  const handleTimerControl = async () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      handleStartTimer();
    }
  };

// تعديل دالة handleMissionComplete
const handleMissionComplete = (missionIndex) => {
  if (!isRunning) {
    Swal.fire('Warning', 'Please start the timer first', 'warning');
    return;
  }if (timer <= 0) {
    Swal.fire('Warning', 'Tasks cannot be added after the time has expired...', 'warning');
    return;
  }
  
 const currentTime = INITIAL_TIME - timer;
  const prevMissionIndex = missionIndex - 1;
  const prevEndTime = missionEndTimes[prevMissionIndex] || 0; 
  if (missionStatus[missionIndex]) {
    setMissionStatus(prev => ({ ...prev, [missionIndex]: null }));
    setMissionEndTimes(prev => ({ ...prev, [missionIndex]: null }));
  } else {
    const elapsedTime = currentTime - prevEndTime;
    
    setMissionStatus(prev => ({
      ...prev,
      [missionIndex]: elapsedTime
    }));
    
    setMissionEndTimes(prev => ({
      ...prev,
      [missionIndex]: currentTime 
    }));
  }
  };
  
  const calculateScore = () => {
    return currentMode.missions.reduce((total, mission, index) => {
      return total + (missionStatus[index] ? mission.points : 0);
    }, 0);
  };

  
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

      
      refetchManualGames();
      refetchCoderCardGames();
      refetchProgrammingGames();

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

const handleRestart = async () => {
  const result = await Swal.fire({
    title: 'Restart Round?',
    text: 'This will reset all current progress!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Restart',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  });

  if (result.isConfirmed) {
    try {
      playStart();
      setLoading(true);
      setTimer(INITIAL_TIME);
      setIsRunning(true);
      setHasPlayedEndSound(false); 

      

      Swal.fire('Success!', 'Restart completed successfully', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Restart failed', 'error');
    } finally {
      setLoading(false);
    }
  }
};

  return (
    <>
  <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-2xl rounded-2xl">
  <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold">🤖 VEX123 Robotics Challenge</h1>
          <p className="text-gray-600 mt-2 font-medium">Performance Scoring Dashboard</p>
          <button
  onClick={() => {
    setShowRankings(!showRankings);
    fetchRankings();
  }}
  className="absolute top-0 right-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
>
  {showRankings ? 'Hide Rankings' : 'Show Rankings'}
</button>
        </div>

  {/* Team Selection Section */}
  <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
        <FaClock className="text-indigo-500" />
        Team Selection
      </h2>
      <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
        {teams.length} Teams Registered
      </span>
    </div>
    
    <select
      className="w-full p-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
      value={selectedTeam?.id || ""}
      onChange={handleTeamSelect}
      disabled={loading}
    >
      <option value="">Select a team...</option>
      {teams.map(team => (
        <option key={team.id} value={team.id} className="p-2">
          {team.name}
        </option>
      ))}
    </select>

    
    {selectedTeam && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-indigo-700">{selectedTeam.name}</h3>
              <p className="text-sm text-indigo-600">Team ID: #{selectedTeam.id}</p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Total Score */}
              <div className="text-center bg-white p-3 rounded-lg shadow-xs min-w-[100px]">
                <p className="text-sm font-medium text-indigo-600 mb-1">Total Score</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {calculateTeamTotals(selectedTeam.id).totalScore}
                </p>
              </div>
              
              {/* Total Time */}
              <div className="text-center bg-white p-3 rounded-lg shadow-xs min-w-[100px]">
                <p className="text-sm font-medium text-indigo-600 mb-1">Total Time</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {formatTime(calculateTeamTotals(selectedTeam.id).totalTime)}
                </p>
              </div>
              
             
              
            <button
                onClick={() => generateTeamPDF(selectedTeam, event_name, GAME_MODES)} // FIXED: remove extra params
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <FaDownload className="text-lg" />
                Export PDF
          </button>
            </div>
          </div>
        </div>
      )}
  </div>

  {/* Game Modes Section */}
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
      <FaPlay className="text-indigo-500" />
      Game Modes
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     {GAME_MODES.map(mode => {
 const teamStatus = selectedTeam 
          ? processTeamGames[selectedTeam.id]?.[mode.name] 
          : null;
          
        const isCompleted = !!teamStatus;  
  return (
    <button
      key={mode.name}
      onClick={() => handleModeSelect(mode)}
      disabled={isCompleted} 
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${isCompleted 
                ? 'border-green-500 bg-green-50 hover:bg-green-100 cursor-default' 
                : currentMode?.name === mode.name 
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-indigo-200 bg-white hover:border-indigo-300 hover:shadow-md'}
              ${!selectedTeam ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-indigo-700">{mode.name}</h3>
              {isCompleted && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Completed
                </span>
              )}
            </div>
            {isCompleted ? (
              <div className="text-left space-y-1">
                <p className="text-sm text-green-700">
                  Score: {teamStatus.score}
                </p>
                <p className="text-sm text-green-700">
                  Time: {formatTime(teamStatus.timeTaken || 0)}
                </p>
              </div>
            ) : (
              <ul className="text-sm text-gray-600 space-y-1">
                {mode.missions.slice(0, 2).map((mission, i) => (
                  <li key={i} className="truncate">• {mission.step}</li>
                ))}
                {mode.missions.length > 2 && (
                  <li className="text-indigo-600">+ {mode.missions.length - 2} more...</li>
                )}
              </ul>
            )}
          </button>
        );
      })}
    </div>
  </div>

  {/* Timer & Missions Section */}
  {currentMode && (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium text-indigo-600">CURRENT MODE</div>
            <div className="text-2xl font-bold text-indigo-700">{currentMode.name}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-4xl font-bold text-indigo-700 bg-indigo-50 px-8 py-4 rounded-xl">
                {formatTime(timer)}
              </div>
              {isRunning && (
                <div className="absolute inset-0 border-2 border-indigo-200 rounded-xl animate-pulse"></div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleTimerControl}
                disabled={!selectedTeam || !currentMode || !!processTeamGames[selectedTeam.id]?.[currentMode.name]}
                className={`
                  px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                  ${isRunning 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'}
                  ${!selectedTeam ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isRunning ? (
                  <>
                    <FaPause className="text-lg" />
                    Pause
                  </>
                ) : (
                  <>
                    <FaPlay className="text-lg" />
                    {timer === INITIAL_TIME ? 'Start Round' : 'Resume'}
                  </>
                )}
              </button>
              
              <button
  onClick={handleRestart}
  disabled={!selectedTeam || !currentMode || timer === INITIAL_TIME}
  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
>
  <FaRedo className="text-lg" />
  Restart Round
</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-700 mb-4">
          Mission Checklist ({calculateScore()} Points)
        </h3>
        
        <div className="space-y-3">
{currentMode.missions.map((mission, index) => {
  const missionTime = missionStatus[index] || 0;
  const isCompleted = !!missionStatus[index];
  
  return (
    <div key={index}
      className={`
        flex items-center justify-between p-4 rounded-lg border-2 transition-all
        ${isCompleted 
          ? 'border-green-500 bg-green-50' 
          : 'border-indigo-100 bg-white hover:border-indigo-200'}
      `}
    >
      <div className="space-y-1">
        <div className="font-medium text-indigo-700">{mission.step}</div>
        <div className="text-sm text-gray-600">{mission.description}</div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right min-w-[120px]">
          <div className="text-indigo-700 font-bold">{mission.points} pts</div>
          {isCompleted && (
            <div className="text-xs text-gray-500">
              Time: {formatTime(missionTime)}
            </div>
          )}
        </div>
        <button
          onClick={() => handleMissionComplete(index)}
          disabled={!isRunning}
          className={`
            px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors
            ${isCompleted 
              ? 'bg-green-500 text-white cursor-default' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
            ${!isRunning || timer <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
})}
        </div>
      </div>

      <div className="bg-indigo-600 p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="text-sm font-medium">CURRENT ROUND TOTAL</div>
            <div className="text-3xl font-bold">{calculateScore()} Points</div>
          </div>
          <button
            onClick={handleRoundComplete}
            disabled={loading || !selectedTeam || !currentMode}
            className="px-8 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            Complete 
            <FaPlay className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
      )}
      
</div>
      {showRankings && (
        <div className="max-w-5xl mx-auto my-3 animate-fade-in">
          <div className="overflow-x-auto rounded-lg shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">Team</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.map((team, index) => (
                  <tr
                    key={team.team}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    } hover:bg-indigo-100 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index + 1)}
                        <span className="text-gray-600">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 text-center font-bold text-indigo-600">
                          #{team.team}
                        </span>
                        <span className="font-medium text-gray-900">{team.team_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 font-bold">
                        {team.total_score} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                        {team.total_time_taken}s
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
  );
};


export default Sheet123;