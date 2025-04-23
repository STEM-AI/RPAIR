import Alert from "../../../../../../../components/Alert/Alert";
import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from './MatchContext';
import SheetSolo from "./SheetSolo"
import { useEventNameContext } from "../../../../../../../context/EventName";
import axios from "axios";
import Swal from "sweetalert2";

const SkillsGO = () => {
  const { currentCompetition } = useEventNameContext();
  const { matches, setCurrentMatch } = useMatchContext();
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState('driver_go');
  const [scores, setScores] = useState({});
  const [completedMatches, setCompletedMatches] = useState({});
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
  
  const event_name = currentCompetition;
  const token = localStorage.getItem("access_token");

  // تعريف التبويبات بنفس نمط skills.jsx
  const tabs = [
    { id: 'driver_go', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
    { id: 'auto', label: 'Autonomous Challenge', icon: '🤖', color: 'blue' },
  ];

  // Fetch schedule
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/core/event/${event_name}/games/schedule/`,
        { stage: activeTab, game_time: gameTime },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedule(response.data);
      console.log(response.data);
      
    } catch (err) {
      console.error("Error posting schedule:", err);
   
 console.log("Error Response:", err.response.data);
    console.log(event_name);      
    }
  };

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

  const handleStartMatch = (match) => {
    setCurrentMatch({
      ...match,
      id: match.id, 
      type: 'solo', 
      team: match.team1_name,
      challengeType: activeTab === 'driver_go' ? 'Driving Challenge' : 'Coding Challenge',
      mode: activeTab,
      round: round,
    });
    setSelectedMatch(match);
  };

  // const handleCompleteMatch = async (matchId) => {
  //   const currentScore = matches[matchId]?.score || 0;
       
    // Alert.confirm({
    //   title: 'Submit Final Score?',
    //   html: `<p>You're about to submit your final score of <strong>${currentScore}</strong> points.</p>`,
    //   confirmText: 'Confirm Submission',
    //   cancelText: 'Cancel',
    //   onConfirm: async () => {
    //     try {
    //       setCompletedMatches((prev) => ({
    //         ...prev,
    //         [matchId]: true,
    //       }));

    //       await axios.post(
    //         `${process.env.REACT_APP_API_URL}/game/${matchId}/set-game-score/`,
    //         {
    //           event_name: event_name,
    //           score: currentScore
    //         },
    //         { headers: { Authorization: `Bearer ${token}` } }
    //       );

    //       Alert.success({
    //         title: 'Score Submitted!',
    //         text: 'Your results have been successfully recorded'
    //       });
    //     } catch (error) {
    //       console.error("Submission error:", error);
    //       Swal.fire("Error", "Submission failed!", "error");
    //     }
    //   }
    // });
  //   setIsRunning(false);
  //   setTimeLeft(60);
  // };

  const handleFinishRound = () => {
    const currentRoundMatches = schedule.filter(match => match.round === round);
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
    return schedule
      .map(match => ({
        id: match.id,
        team: match.team1_name,
        score: scores[match.id] || 0
      }))
      .sort((a, b) => b.score - a.score);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
   <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {!selectedMatch ? ( 
        <>
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-indigo-700 mb-2">🏁 Skills Challenge</h1>
            
            {/* Mode Tabs - تم التعديل لتعكس تبويبات driver_go و auto */}
            <div className="flex justify-center gap-4 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id); 
                    setRound(1); 
                    setCompletedMatches({});
                  }}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                    activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Schedule Input */}
            <form onSubmit={handleSubmit} className="flex justify-center gap-4 mb-4">
              <input
                type="time"
                value={gameTime}
                onChange={(e) => setGameTime(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                View Schedule
              </button>
            </form>

            {/* Round Navigation */}
            <div className="flex justify-center items-center gap-2 mt-2">
              <button
                onClick={() => setRound(prev => Math.max(1, prev - 1))}
                disabled={round === 1}
                className={`p-1 rounded-full ${round === 1 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                <FaChevronLeft />
              </button>
              <span className="text-lg font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">
                {activeTab === 'driver_go' ? 'Driving' : 'Autonomous'} R{round}
              </span>
              <button
                onClick={() => setRound(prev => Math.min(3, prev + 1))}
                disabled={round === 3}
                className={`p-1 rounded-full ${round === 3 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          {/* Matches Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Match</th>
                    <th className="px-3 py-2 text-left">Team</th>
                    <th className="px-3 py-2 text-center">Score</th>
                    <th className="px-3 py-2 text-center">Time</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedule
                    .map((match) => (
                      <tr 
                        key={match.id} 
                        className={completedMatches[match.id] ? "bg-green-50" : "hover:bg-gray-50"}
                      >
                        <td className="px-3 py-3 font-medium">{match.id}</td>
                        <td className="px-3 py-3">{match.team1_name}</td>
                        <td className="px-3 py-3 text-center">
                          {matches[match.id]?.score || 0}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {matches[match.id]?.totalTime ? formatTime(matches[match.id].totalTime) : '-'}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            completedMatches[match.id] 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {completedMatches[match.id] ? "Done" : "Pending"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center space-x-1">
                          <button
                            onClick={() => handleStartMatch(match)}
                            disabled={completedMatches[match.id]}
                            className={`p-1 ${
                              completedMatches[match.id] 
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            } rounded text-xs`}
                          >
                            <FaPlay className="inline" />
                          </button>
                          {/* <button
                            onClick={() => handleCompleteMatch(match.id)}
                            disabled={completedMatches[match.id]}
                            className={`p-1 rounded text-xs ${
                              completedMatches[match.id]
                                ? "bg-gray-300 text-gray-600"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            <FaCheck className="inline" />
                          </button> */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Round Controls */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={handleFinishRound}
              disabled={!schedule.filter(match => match.round === round).every(match => completedMatches[match.id])}
              className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                schedule.filter(match => match.round === round).every(match => completedMatches[match.id])
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <FaFlagCheckered className="mr-1" />
              {round === 3 ? 'Finish' : "Finish Round"}
            </button>
            
            <button
              onClick={() => setShowRanking(!showRanking)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center text-sm"
            >
              <FaTrophy className="mr-1" />
              {showRanking ? "Hide" : "Rankings"}
            </button>
          </div>

          {/* Rankings Table */}
          {showRanking && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
              <div className="px-4 py-2 bg-indigo-600 text-white flex items-center">
                <FaTrophy className="mr-2" />
                <h2 className="text-lg font-bold">Overall Rankings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Rank</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {calculateRankings().map((player, index) => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 font-medium">
                          {index + 1}
                          {index < 3 && (
                            <span className="ml-1">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">{player.team}</td>
                        <td className="px-3 py-3 text-center font-bold text-indigo-600">
                          {player.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <SheetSolo 
          selectedMatch={selectedMatch} 
          eventName={event_name}
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
};

export default SkillsGO;