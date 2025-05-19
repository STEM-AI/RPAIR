import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { FaTrophy, FaMedal} from "react-icons/fa";
import useSound from 'use-sound';
import { useSearchParams } from "react-router-dom";


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
  const token = localStorage.getItem("access_token");
const [missionEndTimes, setMissionEndTimes] = useState({}); // تتبع أوقات نهاية المهام

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
const [hasPlayedEndSound, setHasPlayedEndSound] = useState(false);
 const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const [showRankings, setShowRankings] = useState(false); // Add this state
      const [playStart] = useSound('/sounds/Vex123Start.mp3', { volume: 1 });
      const [playEnd] = useSound('/sounds/Vex123End.mp3', { volume: 1 });
 
      const [searchParams] = useSearchParams();
    const event_name = searchParams.get('eventName');
    console.log("eventName", event_name);
  
  
   // Medal icon rendering function (keep this in your component)
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

  // Modified fetch function with sorting
  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/vex-123/${event_name}/rank/`
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
        // تشغيل الصوت عند الوصول لـ 5 ثواني
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



// Generate PDF for a team
const generateTeamPDF = (team, event_name, GAME_MODES, teamScores, teamTimes) => {
  // Add null checks for critical parameters
  if (!team || !GAME_MODES) return;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const accentColor = '#4F46E5'; // Indigo
  const textColor = '#374151'; // Gray

  // Add Header
  doc.setFillColor(accentColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("VEX123 Robotics Challenge", pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Competition: ${event_name}`, pageWidth / 2, 32, { align: 'center' });

  // Team Information Section
  let yPosition = 50;
  doc.setFontSize(14);
  doc.setTextColor(textColor);
  doc.text(`Team Name: ${team.name}`, 20, yPosition);
  doc.text(`Team Number: ${team.id}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 15;

  // Total Scores Section
  const { totalScore, totalTime } = calculateTeamTotals(team.id);
  doc.setFillColor('#E0E7FF'); // Light indigo background
  doc.rect(15, yPosition, pageWidth - 30, 20, 'F');
  doc.setFontSize(12);
  doc.setTextColor(accentColor);
  doc.text('TOTAL PERFORMANCE SUMMARY', 20, yPosition + 8);
  
  yPosition += 25;
  doc.setFontSize(24);
  doc.setTextColor(accentColor);
  doc.text(`${totalScore} Points`, 20, yPosition+5);
  doc.text(`${formatTime(totalTime)}`, pageWidth - 20, yPosition+5, { align: 'right' });

  // Game Mode Details
  yPosition += 20;
 GAME_MODES?.forEach((mode) => {
    const modeScore = teamScores[team.id]?.[mode.name] || 0;
    const modeTime = teamTimes[team.id]?.[mode.name] || 0;

    if (modeScore > 0 || modeTime > 0) {
      // Check page overflow
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20; // Reset position, add header if needed
      }

      // Mode Header
      doc.setFillColor('#E0E7FF');
      doc.rect(15, yPosition, pageWidth - 30, 10, 'F');
      doc.setFontSize(12);
      doc.setTextColor(accentColor);
      doc.text(`${mode.name} MODE`, 20, yPosition + 7);
      
      // Score and Time
      doc.setTextColor(textColor);
      doc.text(`Score: ${modeScore}`, pageWidth - 60, yPosition + 7);
      doc.text(`Time: ${formatTime(modeTime)}`, pageWidth - 20, yPosition + 7, { align: 'right' });
      
      // Missions List
      yPosition += 15;
      mode.missions.forEach((mission) => {
        // Replace with actual earned points if available
        const earnedPoints = mission.points; // Placeholder
        doc.setFontSize(10);
        doc.setTextColor(textColor);
        doc.text(`✓ ${mission.step}`, 25, yPosition);
        doc.setTextColor('#10B981');
        doc.text(`${earnedPoints} pts`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 8;
      });
      yPosition += 10;
    }
  });

  // Footer
  doc.setDrawColor(200);
  doc.line(15, 280, pageWidth - 15, 280);
  doc.setFontSize(8);
  doc.setTextColor(textColor);
  doc.text(`Report generated on: ${new Date().toLocaleString()}`, 20, 285);
  doc.text('VEX123 Official Score Report', pageWidth - 20, 285, { align: 'right' });

  // Save PDF
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
            params: { competition_event__name: event_name },
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

    if (event_name) {
      fetchTeams();
    }
  }, [event_name, token]);

  // Handle team selection
  const handleTeamSelect = (event) => {
    const team = teams.find(t => t.id.toString() === event.target.value);
    setSelectedTeam(team);
    setCurrentMode(null);
  };

  // Create new game when timer starts
  const createGame = async (team) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/vex-123/${event_name}/game/create/`,
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
    if (teamGames[selectedTeam?.id]?.[mode.name]) {
      Swal.fire({
        title: 'Mode Already Completed',
        text: `This team has already completed the ${mode.name} mode`,
        icon: 'warning'
      });
      return;
    }
    
     const gameId = await createGame(selectedTeam);
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
  
 const currentTime = INITIAL_TIME - timer; // الوقت المنقضي منذ بدء المؤقت
  const prevMissionIndex = missionIndex - 1;
  const prevEndTime = missionEndTimes[prevMissionIndex] || 0; // وقت نهاية المهمة السابقة
  if (missionStatus[missionIndex]) {
    // إلغاء تنشيط المهمة
    setMissionStatus(prev => ({ ...prev, [missionIndex]: null }));
    setMissionEndTimes(prev => ({ ...prev, [missionIndex]: null }));
  } else {
    // حساب الوقت المنقضي منذ نهاية المهمة السابقة
    const elapsedTime = currentTime - prevEndTime;
    
    // تحديث الحالات
    setMissionStatus(prev => ({
      ...prev,
      [missionIndex]: elapsedTime
    }));
    
    setMissionEndTimes(prev => ({
      ...prev,
      [missionIndex]: currentTime // حفظ وقت نهاية المهمة الحالية
    }));
  }
  };
  
  // إضافة دالة حساب الوقت
const calculateMissionTime = () => {
  return Object.values(missionStatus)
    .filter(time => time !== null)
    .reduce((sum, time) => sum + time, 0);
};


  // Calculate total score
  const calculateScore = () => {
    return currentMode.missions.reduce((total, mission, index) => {
      return total + (missionStatus[index] ? mission.points : 0);
    }, 0);
  };

  // Handle round completion
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
      setTeamGames(prev => ({
        ...prev,
        [selectedTeam.id]: {
          ...prev[selectedTeam.id],
          [currentMode.name]: true
        }
      }));
      
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
      setHasPlayedEndSound(false); // إعادة التعيين هنا

      // 2. Remove current mode from completed modes
      if (selectedTeam && currentMode) {
        setTeamGames(prev => ({
          ...prev,
          [selectedTeam.id]: {
            ...prev[selectedTeam.id],
            [currentMode.name]: undefined // Remove "Completed" status
          }
        }));
      }

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
            <div className="text-center bg-white p-3 rounded-lg shadow-xs min-w-[100px]">
              <p className="text-sm font-medium text-indigo-600 mb-1">Total Score</p>
              <p className="text-2xl font-bold text-indigo-700">
                {calculateTeamTotals(selectedTeam.id).totalScore}
              </p>
            </div>
            
            <div className="text-center bg-white p-3 rounded-lg shadow-xs min-w-[100px]">
              <p className="text-sm font-medium text-indigo-600 mb-1">Total Time</p>
              <p className="text-2xl font-bold text-indigo-700">
                {formatTime(calculateTeamTotals(selectedTeam.id).totalTime)}
              </p>
            </div>
            
            <button
              onClick={() => generateTeamPDF(selectedTeam, event_name, GAME_MODES, teamScores, teamTimes)}
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
  const isCompleted = teamGames[selectedTeam?.id]?.[mode.name]; // الاعتماد على teamGames
  
  return (
    <button
      key={mode.name}
      onClick={() => handleModeSelect(mode)}
      disabled={isCompleted} // تعطيل الزر إذا اكتمل
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
                  Score: {teamScores[selectedTeam?.id]?.[mode.name] || 0}
                </p>
                <p className="text-sm text-green-700">
                  Time: {formatTime(teamTimes[selectedTeam?.id]?.[mode.name] || 0)}
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
                disabled={!selectedTeam || !currentMode}
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