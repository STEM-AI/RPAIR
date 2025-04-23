import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo, FaChevronDown, FaTimes } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculatorSkills from "../Scores/ScoresSkills";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import { useEventNameContext } from "../../../../../../../context/EventName";


const Skills = () => {
  const { currentCompetition } = useEventNameContext();
  const [expandedRounds, setExpandedRounds] = useState({ 1: true, 2: false, 3: false });
  const [scores, setScores] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(1);
  const [scoreType, setScoreType] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
  const [activeTab, setActiveTab] = useState('driver_iq');

  const event_name = currentCompetition
  const token = localStorage.getItem("access_token");

  const tabs = [
    { id: 'driver_iq', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
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
    }
  };

    const isRoundCompleted = (round) => {
    return schedule.every(
      (team) => confirmed[round]?.[team.id] === true
    );
  };
 
const confirmScores = async (round, teamId) => {
  const team = schedule.find(t => t.id === teamId);
  if (!team) return;

  const currentScore = scores[round]?.[teamId]?.[activeTab === 'driver_iq' ? 'driver' : 'auto'] || 0;
  Alert.confirm({
    title: 'Submit Final Score?',
    html: `<p>You're about to submit your final score of <strong>${currentScore}</strong> points.</p>`,
    confirmText: 'Confirm Submission',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        setConfirmed(prev => ({ ...prev, [round]: { ...prev[round], [teamId]: true } }));

        await axios.post(
          `${process.env.REACT_APP_API_URL}/game/${teamId}/set-game-score/`,
          {
            event_name: event_name,
            score: currentScore
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // إذا اكتملت الجولة، فتح الجولة التالية
        if (round < 3 && isRoundCompleted(round)) {
          setExpandedRounds(prev => ({ ...prev, [round + 1]: true }));
        }

        Swal.fire("Success", "Score submitted!", "success");
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire("Error", "Submission failed!", "error");
      }
    }
  });
};
  // Unified calculator handler
  const openCalculator = (team, round, type) => {
    if (confirmed[round]?.[team.id]) return;

    setSelectedTeam(team);
    setSelectedRound(round);
    setScoreType(type);
    setShowCalculator(true);

    setScores(prev => ({
      ...prev,
      [round]: {
        ...prev[round],
        [team.id]: {
          ...prev[round]?.[team.id],
          [type]: prev[round]?.[team.id]?.[type] || 0
        }
      }
    }));
  };

  // Score calculation handler
  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound || !scoreType) return;

    setScores(prev => ({
      ...prev,
      [selectedRound]: {
        ...prev[selectedRound],
        [selectedTeam.id]: {
          ...prev[selectedRound]?.[selectedTeam.id],
          [scoreType]: calculatedScore || 0
        }
      }
    }));
    setShowCalculator(false);
  };

  // Ranking calculation
  const calculateRankings = () => {
    return schedule.map(team => {
      let autoSum = 0, driverSum = 0, count = 0;
      
      Object.values(scores).forEach(round => {
        if (round[team.id]) {
          autoSum += round[team.id].auto || 0;
          driverSum += round[team.id].driver || 0;
          count++;
        }
      });

      return {
        id: team.id,
        name: team.team1,
        autoAvg: (autoSum / (count || 1)).toFixed(2),
        driverAvg: (driverSum / (count || 1)).toFixed(2),
        total: ((autoSum + driverSum) / (count || 1)).toFixed(2),
      };
    }).sort((a, b) => b.total - a.total);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header and Tabs */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🏆 Skills Challenge</h1>
        
        <div className="flex justify-center gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        <form onSubmit={handleSubmit} className="flex justify-center gap-4 mb-8">
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
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Team</th>
              <th className="p-4">Match Code</th>
              <th className="p-4">{activeTab === 'driver_iq' ? 'Driver Score' : 'Auto Score'}</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(team => (
              <tr key={team.id} className="border-t">
                <td className="p-4 text-center">{team.team1_name}</td>
                <td className="p-4 text-center">{team.id}</td>
                <td className="p-4 text-center">
                  {scores[selectedRound]?.[team.id]?.[activeTab === 'driver_iq' ? 'driver' : 'auto'] || 0}
                  {!confirmed[selectedRound]?.[team.id] && (
                    <button
                      onClick={() => openCalculator(team, selectedRound, activeTab === 'driver_iq' ? 'driver' : 'auto')}
                      className="ml-2 text-blue-600"
                    >
                     <AiOutlineCalculator  className="text-2xl"/>
                    </button>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full ${
                    confirmed[selectedRound]?.[team.id] 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {confirmed[selectedRound]?.[team.id] ? "Confirmed" : "Pending"}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => confirmScores(selectedRound, team.id)}
                    disabled={confirmed[selectedRound]?.[team.id]}
                    className={`px-4 py-2 rounded-lg ${
                      confirmed[selectedRound]?.[team.id] 
                        ? "bg-gray-300" 
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    <FaCheck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ranking Section */}
      <div className="text-center">
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg mb-4"
        >
          <FaTrophy className="inline mr-2" />
          {showRanking ? "Hide Rankings" : "Show Rankings"}
        </button>

        {showRanking && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">🏆 Rankings</h2>
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Auto Avg</th>
                  <th className="p-3">Driver Avg</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {calculateRankings().map((team, index) => (
                  <tr key={team.id} className="border-t">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{team.name}</td>
                    <td className="p-3 text-center">{team.autoAvg}</td>
                    <td className="p-3 text-center">{team.driverAvg}</td>
                    <td className="p-3 text-center font-bold">{team.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCalculator && selectedTeam && (
        <CalculatorSkills
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          mode={activeTab}
          gameId={selectedTeam.id}
        />
      )}
    </div>
  );
};

export default Skills;
