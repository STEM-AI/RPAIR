import { useState, useEffect, useRef } from "react";
import { FaTrophy, FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { sortBy } from 'lodash';
import { useMatchContext } from './MatchContext';
import Back from "../../../../../../../components/Back/Back";
import axios from "axios";
import Swal from "sweetalert2";
import { BsSkipStartFill } from "react-icons/bs";

const tasks = [
  { title: "Move purple sensor to the fish habitat", points: 1 },
  { title: "Move blue sensor to the pipeline", points: 1 },
  { title: "Move the orange sensor to the volcano tile", points: 1 },
  { title: "Orange sensor placed on top of the volcano", points: 2 },
  { title: "Align the turbines", points: "1 per turbine", isDynamic: true },
  { title: "Open the clam", points: 1 },
  { title: "Remove the pearl from the clam", points: 1 },
  { title: "Deliver the pearl to the green starting tile", points: 1 },
  { title: "End with the robot on the green tile", points: 1 },
];

export default function SheetCoop() {
  const { currentMatch, updateMatch } = useMatchContext();
  const [scores, setScores] = useState({});
  const [taskTimes, setTaskTimes] = useState({});
  const [turbines, setTurbines] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [matchData, setMatchData] = useState({ matchId: '', team1_name: '', team2_name: '' });
  const navigate = useNavigate();
  const [completedOrder, setCompletedOrder] = useState([]);
  const token = localStorage.getItem("access_token");
  const socketRef = useRef(null);

  const [timeUp, setTimeUp] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (currentMatch?.type === 'coop') {
      setMatchData({
        matchId: currentMatch.id,
        team1: currentMatch.team1_name,
        team2: currentMatch.team2_name
      });
    }
  }, [currentMatch]);

  // WebSocket connection
  useEffect(() => {
    const gameId = currentMatch?.id;
    const eventName = "vex_go";
    
    if (!gameId) return;

    socketRef.current = new WebSocket(
      `ws://192.168.1.25:8000/ws/competition_event/${eventName}/game/${gameId}/`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "paused") {
        setGamePaused(true);
        return;
      }
      if (data.status === "resume") {
        setGamePaused(false);
        return;
      }
      if (data.remaining_time !== undefined) {
        const newRemaining = Math.round(data.remaining_time);
        setRemainingTime(newRemaining);
        if (newRemaining <= 0) {
          setGameActive(false);
          setTimeUp(true);
        }
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("WebSocket connection closed");
      }
    };
  }, [currentMatch?.id]);

  const handleCheckboxChange = (index, value) => {
    const elapsedTime = 60 - remainingTime;
    setScores((prev) => ({ ...prev, [index]: value ? tasks[index].points : 0 }));
    
    if (value) {
      setCompletedOrder(prev => [...prev, { index, time: elapsedTime }]);
      setTaskTimes((prev) => ({ ...prev, [index]: elapsedTime }));
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== index));
      setTaskTimes((prev) => {
        const newTimes = { ...prev };
        delete newTimes[index];
        return newTimes;
      });
    }
  };

  const handleTurbineChange = (e) => {
    let value = parseInt(e.target.value, 10) || 0;
    if (value > 5) value = 5;
    if (value < 0) value = 0;
    setTurbines(value);
    setScores((prev) => ({ ...prev, 4: value }));

    const elapsedTime = 60 - remainingTime;
    if (value > 0) {
      setCompletedOrder(prev => {
        const exists = prev.some(item => item.index === 4);
        return exists ? prev : [...prev, { index: 4, time: elapsedTime }];
      });
      setTaskTimes((prev) => ({ ...prev, 4: elapsedTime }));
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== 4));
      setTaskTimes((prev) => {
        const newTimes = { ...prev };
        delete newTimes[4];
        return newTimes;
      });
    }
  };

  const getTimeDifference = (index) => {
    const sortedCompleted = sortBy(completedOrder, 'time');
    const task = sortedCompleted.find(t => t.index === index);
    if (!task) return '-';

    const taskIndex = sortedCompleted.indexOf(task);
    return taskIndex === 0
      ? formatTime(task.time)
      : formatTime(task.time - sortedCompleted[taskIndex - 1].time);
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  const handleSubmit = async () => {
    if (!totalScore) {
      alert("Please enter a valid score.");
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/vex-go/game/${matchData.matchId}/coop/`,
        { score: totalScore },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Score submitted successfully!",
          confirmButtonColor: "#28a745"
        });
        updateMatch(currentMatch.id, {
          ...currentMatch,
          score: totalScore,
          taskTimes,
          totalTime: 60 - remainingTime
        });
        navigate('/Dashboard/VexGO/COOPMatches');
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to submit score." });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    if (!socketRef.current) return;
    socketRef.current.send(JSON.stringify({
      action: "start_game",
      event_name: "vex_go",
      game_id: currentMatch.id
    }));
    setGameActive(true);
    setShowControls(true);
    setTimeUp(false);
  };

  const pauseGame = () => {
    if (!gameActive || gamePaused) return;
    socketRef.current.send(JSON.stringify({
      action: "pause_game",
      event_name: "vex_go",
      game_id: currentMatch.id
    }));
    setGamePaused(true);
  };

  const resumeGame = () => {
    if (!gameActive || !gamePaused) return;
    socketRef.current.send(JSON.stringify({
      action: "resume_game",
      event_name: "vex_go",
      game_id: currentMatch.id
    }));
    setGamePaused(false);
  };

  const restartGame = () => {
    socketRef.current.send(JSON.stringify({
      action: "restart_game",
      event_name: "vex_go",
      game_id: currentMatch.id
    }));
    setRemainingTime(60);
    setGameActive(false);
    setGamePaused(false);
    setTimeUp(false);
    setShowControls(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18)
      .setTextColor(79, 70, 229)
      .text("Ocean Science Exploration", 105, 20, { align: "center" })
      .setFontSize(14)
      .text("Coop Match Score Sheet", 105, 30, { align: "center" });

    doc.setFontSize(14)
      .setTextColor(0)
      .text(`Match ID: ${currentMatch?.id || 'N/A'}`, 20, 40)
      .text(`Teams: ${currentMatch?.team1_name || 'N/A'} & ${currentMatch?.team2_name || 'N/A'}`, 20, 50)

    const tableData = tasks.map((task, index) => [
      task.title,
      task.points,
      scores[index] || 0,
      getTimeDifference(index)
    ]);

    doc.autoTable({
      startY: 70,
      head: [["Task", "Points", "Score", "Time"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }
    });

    doc.text(`Total Score: ${totalScore}`, 20, doc.autoTable.previous.finalY + 10);
    doc.save(`Match_${matchData.matchId}_Score.pdf`);
  };


  return (
    <div className="max-w-5xl mx-auto mt-4 sm:mt-8 p-3 sm:p-6 bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-xl">
      <Back />
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">🌊 Ocean Science Exploration</h1>
        <p className="text-sm sm:text-lg text-gray-600">Coop Match Score Sheet</p>
      </div>

      {/* Match Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700 mb-1">Match ID</h3>
          <p className="text-base sm:text-xl font-bold">{currentMatch?.id || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700 mb-1">Team 1</h3>
          <p className="text-base sm:text-xl font-bold">{currentMatch?.team1_name || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-indigo-700 mb-1">Team 2</h3>
          <p className="text-base sm:text-xl font-bold">{currentMatch?.team2_name || 'N/A'}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-2 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-center mb-2 sm:mb-0">
          <FaClock className="text-indigo-600 mr-2 text-lg sm:text-xl" />
          <span className="text-lg sm:text-xl font-semibold">{formatTime(remainingTime)}</span>
        </div>
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
          {!showControls && (
            <button onClick={startGame}
               className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white`}
            >
              <FaPlay className="mr-1 sm:mr-2" />
              Start
            </button>
          )}
          {showControls && (
            <>
              <button onClick={pauseGame} disabled={!gameActive || gamePaused}
          className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center text-sm sm:text-base bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <FaPause className="mr-1 sm:mr-2" /> Pause
              </button>
              {/* <button onClick={resumeGame} disabled={!gamePaused} className="bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-600">
                <BsSkipStartFill size={18} />
              </button> */}
              <button onClick={restartGame}
                 className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"
              >
                <FaRedo className="mr-1 sm:mr-2" />
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Score Table */}
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm sm:shadow-md">
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
              <td className="px-4 py-2 text-sm">{task.title}</td>
              <td className="px-4 py-2 text-center text-sm font-medium">{task.points}</td>
              <td className="px-4 py-2 text-center text-sm hidden sm:table-cell">
                {task.isDynamic ? scores[4] || 0 : scores[index] || 0}
              </td>
              <td className="px-4 py-2 text-center text-sm hidden sm:table-cell">
                {getTimeDifference(index)}
              </td>
              <td className="px-4 py-2 text-center">
                {task.isDynamic ? (
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={turbines}
                    onChange={handleTurbineChange}
                    className="w-16 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-indigo-400 text-sm"
                    disabled={!gameActive || gamePaused || timeUp}
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={!!scores[index]}
                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                    disabled={!gameActive || gamePaused || timeUp}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Score and Buttons */}
      <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-center sm:text-left">
          <h3 className="text-sm font-medium text-indigo-700">Total Score</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalScore}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaCheckCircle className="mr-2" /> Submit Score
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}