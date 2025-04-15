


import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo, FaChevronDown } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculatorSkills from "../Scores/ScoresSkills";
import axios from "axios";
import Swal from "sweetalert2";

const Skills = () => {
  const [expandedRounds, setExpandedRounds] = useState({ 1: true, 2: false, 3: false });
  const [scores, setScores] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [scoreType, setScoreType] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
    const [activeTab, setActiveTab] = useState('driver');

const event_name = localStorage.getItem("selected_event_name");
  const token = localStorage.getItem("access_token");

   const tabs = [
    { id: 'driver', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
    { id: 'auto', label: 'Autonomous Challenge', icon: '🤖', color: 'blue' },
  ];
  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/event/${event_name}/games-schedule/`,
      { stage: "skills", time: gameTime }, // Inline data ensures up-to-date values
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Schedule posted successfully:", response.data);
    
    setSchedule(response.data);
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

  setConfirmed(prev => ({
    ...prev,
    [round]: { ...prev[round], [teamId]: true },
  }));

  if (round < 3 && isRoundCompleted(round)) {
    setExpandedRounds(prev => ({
      ...prev,
      [round + 1]: true,
    }));
  }

  // تجهيز البيانات للإرسال
  const data = {
    event_name: event_name,
    score: {
      driver: scores[round]?.[teamId]?.driver ?? "0",
      autonomous: scores[round]?.[teamId]?.auto ?? "0",
    },
  };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/game/${teamId}/set-game-score/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log("Score submitted successfully:", response.data);
    Swal.fire({
                icon: "success",
                title: "Success",
                text: "Score submitted successfully!",
                showConfirmButton: true,
                confirmButtonColor: "#28a745" 
              });
  } catch (error) {
    console.error("Error submitting score:", error);
  }
};




    const openCalculator = (team, round, type) => {
    if (confirmed[round]?.[team.id]) return;

    setSelectedTeam(team);
    setSelectedRound(round);
    setScoreType(type);
    setShowCalculator(true);

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[round]) newScores[round] = {};
      if (!newScores[round][team.id]) {
        newScores[round][team.id] = { auto: 0, driver: 0 };
      }
      return newScores;
    });
  };

  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound || !scoreType) return;

    setScores((prev) => {
      const newScores = { ...prev };
      if (!newScores[selectedRound]) newScores[selectedRound] = {};
      if (!newScores[selectedRound][selectedTeam.id]) {
        newScores[selectedRound][selectedTeam.id] = { auto: 0, driver: 0 };
      }

      newScores[selectedRound][selectedTeam.id][scoreType] = calculatedScore ?? 0;
      return newScores;
    });

    setShowCalculator(false);
  };


  // const calculateRankings = () => {
  //   return schedule
  //     .map((team) => {
  //       let autoSum = 0,
  //         driverSum = 0,
  //         count = 0;

  //       Object.values(scores).forEach((round) => {
  //         if (round[team.id]) {
  //           autoSum += round[team.id].auto || 0;
  //           driverSum += round[team.id].driver || 0;
  //           count++;
  //         }
  //       });

  //       return {
  //         id: team.id,
  //         name: team.team1,
  //         autoAvg: count > 0 ? (autoSum / count).toFixed(2) : "0.00",
  //         driverAvg: count > 0 ? (driverSum / count).toFixed(2) : "0.00",
  //         total: count > 0 ? ((autoSum + driverSum) / count).toFixed(2) : "0.00",
  //       };
  //     })
  //     .sort((a, b) => b.total - a.total)
  //     .map((team, index) => ({ ...team, rank: index + 1 }));
  // };
const calculateRankings = () => {
    return schedule
      .map((team) => {
        let autoSum = 0,
          driverSum = 0,
          count = 0;

        Object.values(scores).forEach((round) => {
          if (round[team.id]) {
            autoSum += round[team.id].auto || 0;
            driverSum += round[team.id].driver || 0;
            count++;
          }
        });

        return {
          id: team.id,
          name: team.team1,
          autoAvg: count > 0 ? (autoSum / count).toFixed(2) : "0.00",
          driverAvg: count > 0 ? (driverSum / count).toFixed(2) : "0.00",
          total: count > 0 ? ((autoSum + driverSum) / count).toFixed(2) : "0.00",
        };
      })
      .sort((a, b) => b.total - a.total)
      .map((team, index) => ({ ...team, rank: index + 1 }));
};
  const Th = ({ children, className }) => (
  <th className={`px-2.5 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider text-center ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className }) => (
  <td className={`px-2.5 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 text-center ${className}`}>
    {children}
  </td>
);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-5 ">🏆 Skills Challenge</h1>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 text-sm font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `bg-black text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${tab.id === 'driver' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Schedule Input */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4 items-center">
            <input
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-white text-lg"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-all"
            >
              View Schedule
            </button>
          </form>
        </div>

        {/* Round Navigation */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setSelectedRound(prev => Math.max(1, prev - 1))}
            disabled={selectedRound === 1}
            className={`p-2 rounded-full ${selectedRound === 1 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-black hover:bg-indigo-200'}`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-xl font-semibold bg-slate-900 text-white px-4 py-2 rounded-full">
            Round {selectedRound}
          </span>
          <button
            onClick={() => setSelectedRound(prev => Math.min(3, prev + 1))}
            disabled={selectedRound === 3}
            className={`p-2 rounded-full ${selectedRound === 3 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-black hover:bg-indigo-200'}`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Matches Table */}
       <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                  <Th>Team</Th>
                  <Th >Match Code</Th>
                  <Th >
                    {activeTab === 'driver' ? 'Driver Score' : 'Auto Score'}
                  </Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((team) => (
                  <tr 
                    key={team.id} 
                    className={confirmed[selectedRound]?.[team.id] ? "bg-green-50" : "hover:bg-gray-50"}
                  >
                    <Td >{team.team1}</Td>
                    <Td >{team.id}</Td>
                    <Td >
                      {activeTab === 'driver' 
                        ? scores[selectedRound]?.[team.id]?.driver ?? 0
                        : scores[selectedRound]?.[team.id]?.auto ?? 0}
                      {!confirmed[selectedRound]?.[team.id] && (
                        <button
                          onClick={() => openCalculator(team, selectedRound, activeTab)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <AiOutlineCalculator className="inline" />
                        </button>
                      )}
                    </Td>
                    <Td >
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        confirmed[selectedRound]?.[team.id] 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {confirmed[selectedRound]?.[team.id] ? "Confirmed" : "Pending"}
                      </span>
                    </Td>
                    <Td>
                      <button
                        onClick={() => confirmScores(selectedRound, team.id)}
                        disabled={confirmed[selectedRound]?.[team.id]}
                        className={`px-3 py-1 rounded-md text-sm ${
                          confirmed[selectedRound]?.[team.id]
                            ? "bg-gray-300 text-gray-600"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        <FaCheck className="inline mr-1" /> Confirm
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {/* Ranking Section */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowRanking(!showRanking)}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center"
          
        >
          <FaTrophy className="mr-2" />
          {showRanking ? "Hide Rankings" : "View Rankings"}
        </button>
      </div>

      {showRanking && (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 bg-white text-black flex items-center">
            <FaTrophy className="mr-2" />
            <h2 className="text-xl font-bold">Overall Rankings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <Th className="px-6 py-3 text-left">Rank</Th>
                  <Th className="px-6 py-3 text-left">Team</Th>
                  <Th className="px-6 py-3 text-center">Avg Auto</Th>
                  <Th className="px-6 py-3 text-center">Avg Driver</Th>
                  <Th className="px-6 py-3 text-center">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {calculateRankings().map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <Th className="px-6 py-4 font-medium">
                      {index + 1}
                      {index < 3 && (
                        <span className="ml-2">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </Th>
                    <Th className="px-6 py-4">{team.name}</Th>
                    <Th className="px-6 py-4 text-center">{team.autoAvg}</Th>
                    <Th className="px-6 py-4 text-center">{team.driverAvg}</Th>
                    <Th className="px-6 py-4 text-center font-bold text-indigo-600">
                      {team.total}
                    </Th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCalculator && selectedTeam && selectedRound && (
        <CalculatorSkills 
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          gameId={selectedTeam.id}  
        />
      )}
    </div>
  );
};

export default Skills;