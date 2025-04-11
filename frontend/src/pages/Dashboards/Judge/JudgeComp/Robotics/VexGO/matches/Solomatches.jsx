import Alert from "../../../../../../../components/Alert/Alert";
import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from './MatchContext';
import Back from "../../../../../../../components/Back/Back";


const SkillsGO = () => {
  const { matches, setCurrentMatch } = useMatchContext(); // Now this exists
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState('driving'); // 'driving' or 'coding'
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  // Players and matches for each round and mode
  const schedule = {
    driving: {
      1: [
        { id: 'd1', player: "Driver 1", team: "Team A" },
        { id: 'd2', player: "Driver 2", team: "Team B" },
        { id: 'd3', player: "Driver 3", team: "Team C" }
      ],
      2: [
        { id: 'd4', player: "Driver 4", team: "Team D" },
        { id: 'd5', player: "Driver 5", team: "Team E" },
        { id: 'd6', player: "Driver 6", team: "Team F" }
      ],
      3: [
        { id: 'd7', player: "Driver 7", team: "Team G" },
        { id: 'd8', player: "Driver 8", team: "Team H" },
        { id: 'd9', player: "Driver 9", team: "Team I" }
      ],
    },
    coding: {
      1: [
        { id: 'c1', player: "Coder 1", team: "Team A" },
        { id: 'c2', player: "Coder 2", team: "Team B" },
        { id: 'c3', player: "Coder 3", team: "Team C" }
      ],
      2: [
        { id: 'c4', player: "Coder 4", team: "Team D" },
        { id: 'c5', player: "Coder 5", team: "Team E" },
        { id: 'c6', player: "Coder 6", team: "Team F" }
      ],
      3: [
        { id: 'c7', player: "Coder 7", team: "Team G" },
        { id: 'c8', player: "Coder 8", team: "Team H" },
        { id: 'c9', player: "Coder 9", team: "Team I" }
      ],
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSaveScore = (matchId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [matchId]: parseInt(score) || 0,
    }));
  };

   // Keep the existing handleStartMatch implementation
  const handleStartMatch = (match) => {
  setCurrentMatch({
    id: match.id, 
    type: 'solo', 
    team: match.team,
    challengeType: activeTab === 'driving' ? 'Driving Challenge' : 'Coding Challenge',
    mode: activeTab,
    round: round,
  });
  navigate("/SheetSolo");
};

  


 const handleCompleteMatch = (matchId) => {
    setCompletedMatches((prev) => ({
      ...prev,
      [matchId]: true,
    }));
       
    Alert.confirm({
      title: 'Submit Final Score?',
      html: `<p>You're about to submit your final score of <strong>${scores[matchId] || 0}</strong> points.</p>`,
      confirmText: 'Confirm Submission',
      cancelText: 'Cancel',
      onConfirm: () => {
        Alert.success({
          title: 'Score Submitted!',
          text: 'Your results have been successfully recorded'
        });
      }
    });
    setIsRunning(false);
    setTimeLeft(60);
  };

  const handleFinishRound = () => {
    const currentRoundMatches = schedule[activeTab][round];
    const allMatchesCompleted = currentRoundMatches.every(
      (match) => completedMatches[match.id]
    );

    if (allMatchesCompleted) {
      if (round < 3) {
        setRound((prevRound) => prevRound + 1);
        setCompletedMatches({});
      } else {
        alert(`All ${activeTab} rounds completed!`);
      }
    } else {
      alert("Please complete all matches before finishing the round.");
    }
  };

  const calculateRankings = () => {
    const allPlayers = [
      ...Object.values(schedule.driving).flat(),
      ...Object.values(schedule.coding).flat()
    ];
    
    return allPlayers
      .map(player => ({
        ...player,
        score: scores[player.id] || 0,
        mode: player.id.startsWith('d') ? 'Driving' : 'Coding'
      }))
      .sort((a, b) => b.score - a.score);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <Back />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">🏁 Skills Challenge</h1>
        
        {/* Mode Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => { setActiveTab('driving'); setRound(1); setCompletedMatches({}); }}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'driving' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Driving Challenge
            </button>
            <button
              onClick={() => { setActiveTab('coding'); setRound(1); setCompletedMatches({}); }}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'coding' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Coding Challenge
            </button>
          </div>
        </div>

        {/* Round Navigation */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setRound(prev => Math.max(1, prev - 1))}
            disabled={round === 1}
            className={`p-2 rounded-full ${round === 1 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-xl font-semibold bg-indigo-600 text-white px-4 py-2 rounded-full">
            {activeTab === 'driving' ? 'Driving' : 'Coding'} Round {round}
          </span>
          <button
            onClick={() => setRound(prev => Math.min(3, prev + 1))}
            disabled={round === 3}
            className={`p-2 rounded-full ${round === 3 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Timer
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4">
          <div className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</div>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              isRunning 
                ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => setTimeLeft(60)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center"
          >
            <FaRedo className="mr-2" /> Reset
          </button>
        </div>
      </div> */}

      {/* Matches Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Match ID</th>
                <th className="px-6 py-3 text-left">Team</th>
                <th className="px-6 py-3 text-center">Score</th>
                <th className="px-6 py-3 text-center">Time</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedule[activeTab][round].map((match) => (
                <tr 
                  key={match.id} 
                  className={completedMatches[match.id] ? "bg-green-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 font-medium">{match.id.toUpperCase()}</td>
                  <td className="px-6 py-4">{match.team}</td>
                  <td className="px-6 py-4 text-center">
          {matches[match.id]?.score || 0}
        </td>
        <td className="px-6 py-4 text-center">
          {matches[match.id]?.totalTime ? formatTime(matches[match.id].totalTime) : '-'}
        </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      completedMatches[match.id] 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {completedMatches[match.id] ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                   <button
                      onClick={() => handleStartMatch(match)}
                      disabled={completedMatches[match.id]}
                      className={`px-3 py-1 ${
                        completedMatches[match.id] 
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      } rounded-md text-sm`}
                    >
                      <FaPlay className="inline mr-1" /> Start
                    </button>
                    <button
                      onClick={() => handleCompleteMatch(match.id)}
                      disabled={completedMatches[match.id]}
                      className={`px-3 py-1 rounded-md text-sm ${
                        completedMatches[match.id]
                          ? "bg-gray-300 text-gray-600"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <FaCheck className="inline mr-1" /> Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Round Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handleFinishRound}
          disabled={!schedule[activeTab][round].every(match => completedMatches[match.id])}
          className={`px-6 py-2 rounded-lg flex items-center ${
            schedule[activeTab][round].every(match => completedMatches[match.id])
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          <FaFlagCheckered className="mr-2" />
          {round === 3 ? `Finish ${activeTab === 'driving' ? 'Driving' : 'Coding'}` : "Finish Round"}
        </button>
        
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center"
        >
          <FaTrophy className="mr-2" />
          {showRanking ? "Hide Rankings" : "Show Rankings"}
        </button>
      </div>

      {/* Rankings Table */}
      {showRanking && (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 bg-indigo-600 text-white flex items-center">
            <FaTrophy className="mr-2" />
            <h2 className="text-xl font-bold">Overall Rankings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left">Rank</th>
                  
                  <th className="px-6 py-3 text-left">Team</th>
                  <th className="px-6 py-3 text-center">Mode</th>
                  <th className="px-6 py-3 text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {calculateRankings().map((player, index) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {index + 1}
                      {index < 3 && (
                        <span className="ml-2">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">{player.team}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        player.mode === 'Driving' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {player.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600">
                      {player.score}
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

export default SkillsGO;