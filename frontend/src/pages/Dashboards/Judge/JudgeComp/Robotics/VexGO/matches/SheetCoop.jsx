import { useState, useEffect, useRef } from "react";
import { FaTimes ,FaTrophy, FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { sortBy } from 'lodash';
import { useMatchContext } from './MatchContext';
import axios from "axios";
import Swal from "sweetalert2";
import { BsSkipStartFill } from "react-icons/bs";
import Alert from "../../../../../../../components/Alert/Alert";
import useSound from 'use-sound';
import { tasks as oceanTasks } from './SheetOcean';
import { tasks as spaceTasks } from './SheetSpace';
export default function SheetCoop({ eventName, onClose ,sheetType}) {

  const { currentMatch, updateMatch } = useMatchContext();
  const [scores, setScores] = useState({});
  const [taskTimes, setTaskTimes] = useState({});
  const [turbines, setTurbines] = useState({});
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [selectedChallenge, setSelectedChallenge] = useState('ocean'); 
  const [tasks, setTasks] = useState(oceanTasks);
  const [matchData, setMatchData] = useState({ matchId: '', team1_name: '', team2_name: '' });
  const [completedOrder, setCompletedOrder] = useState([]);
  const token = localStorage.getItem("access_token");
  const socketRef = useRef(null);
 

  const [timeUp, setTimeUp] = useState(false);
  const [showControls, setShowControls] = useState(false);
    const prevTimeRef = useRef(remainingTime);

  const [playStart] = useSound('/sounds/Start.MP3', { volume: 1 });
  const [playEnd] = useSound('/sounds/End.mp3', { volume: 1 });
  const [playMiddle] = useSound('/sounds/Middle.MP3', { volume: 1 });

   
  useEffect(() => {
    setTasks(sheetType === 'Ocean' ? oceanTasks : spaceTasks);
  }, [sheetType]);


  useEffect(() => {
    if (currentMatch?.type === 'coop') {
      setMatchData({
        matchId: currentMatch.id,
        team1: currentMatch.team1_name,
        team2: currentMatch.team2_name
      });
    }
  }, [currentMatch]);

  const gameId = currentMatch.id

 useEffect(() => {
      if (!eventName || !gameId) {
         Alert.error({
      title: "Missing Data",
      text: "Event name or Game ID is missing. Please check the configuration.",
    });
    return;
    }
    
      socketRef.current = new WebSocket(
        `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/game/${gameId}/`

      );
 
      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };
  
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
          if (data.status === "started") {
            setGameActive(true);
            setTimeUp(false);
        }
         if (data.remaining_time <= 0) {
          setGameActive(false); // إضافة تحديث الحالة
          setTimeUp(true);
        }
        if (data.status === "paused") {
          setGamePaused(true);
          return;
        }
        if (data.status === "resume") {
          setGamePaused(false);
          return;
        }
        if (data.remaining_time !== undefined) {
          setRemainingTime(Math.round(data.remaining_time));
          if (data.remaining_time <= 0) {
            setGameActive(false);
            setTimeUp(true);
          }
        }
      };
  
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }, [eventName, gameId]);
  const startGame = () => {
      playStart(); // تشغيل الصوت هنا
      setGameActive(true);
      setGamePaused(false);
      setShowControls(true);
      setTimeUp(false);
  
      // Send a message to start the game via WebSocket
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ action: "start_game", event_name: eventName, game_id: gameId })
        );
      }
    };
  
    const pauseGame = () => {
      if (!gameActive || gamePaused) return;
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ action: "pause_game", event_name: eventName, game_id: gameId })
        );
      }
      setGamePaused(true);
    };
  
    const resumeGame = () => {
      if (!gameActive || !gamePaused) return;
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ action: "resume_game", event_name: eventName, game_id: gameId })
        );
      }
      setGamePaused(false);
    };
  
   const restartGame = () => {
  Alert.confirm({
    title: 'Restart Game?',
    html: 'This will reset all counters and the timer!',
    confirmText: 'Confirm Restart',
    cancelText: 'Cancel',
    onConfirm: () => {
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ 
            action: "restart_game", 
            event_name: eventName, 
            game_id: gameId 
          })
        );
      }
      playStart(); // تشغيل الصوت هنا
      setRemainingTime(60);
      setGameActive(true);
      setShowControls(true);
    setGamePaused();
    setTimeUp(false);
    setScores({});
    setTurbines(0);
    setCompletedOrder([]);
    },
        onCancel: () => {
          Swal.fire('Cancelled', 'Game restart was cancelled', 'info');
        }
      });
  };
     const EndGame = () => {
      setGameActive(false);
      setShowControls(false);
      setTimeUp(true);
  
      // Send a message to start the game via WebSocket
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ action: "end_game", event_name: eventName, game_id: gameId })
        );
      }
    };

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

  const handleTurbineChange = (index, value) => {
    let parsedValue = parseInt(value, 10) || 0;
    if (parsedValue > 2) parsedValue = 5;
    if (parsedValue < 0) parsedValue = 0;
  
    setTurbines(prev => ({ ...prev, [index]: parsedValue }));
    setScores(prev => ({ ...prev, [index]: parsedValue }));
  
    const elapsedTime = 60 - remainingTime;
    if (parsedValue > 0) {
      setCompletedOrder(prev => {
        const exists = prev.some(item => item.index === index);
        return exists ? prev : [...prev, { index, time: elapsedTime }];
      });
      setTaskTimes(prev => ({ ...prev, [index]: elapsedTime }));
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== index));
      setTaskTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[index];
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
  if (!currentMatch) return;
  const timeTaken = 60 - remainingTime; // Calculate total time taken

  Alert.confirm({
    title: 'Submit Final Score?',
    html: `<p>You're about to submit your final score of <strong>${totalScore}</strong> points.</p>`,
    confirmText: 'Confirm Submission',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/vex-go/game/${currentMatch.id}/coop/`,
          {
            score: totalScore,
            task_times: taskTimes // Send task times data
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updateMatch(currentMatch.id, {
          score: totalScore,
          taskTimes: taskTimes, // Use existing taskTimes state
          totalTime: timeTaken // Include calculated total time
        });

        Swal.fire("Success", "Score submitted successfully!", "success");
        onClose();
        EndGame();
      } catch (error) {
        console.error("Submission error:", error);
        Swal.fire("Error", "Failed to submit score", "error");
      }
    },
    onCancel: () => {
      Swal.fire('Cancelled', 'Submission was cancelled', 'info');
    }
  });
};
  
const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18)
      .setTextColor(79, 70, 229)
      .text(`${selectedChallenge === 'ocean' ? 'Ocean' : 'Space'} Science Exploration`, 105, 20, { align: "center" })
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

     useEffect(() => {
    if (remainingTime === 0) {
      playEnd();
    }
     }, [remainingTime, playEnd]);
  
   // تشغيل playMiddle عند الوصول إلى 25 أو 35 ثانية
  useEffect(() => {
    if (gameActive && !gamePaused) {
      if (
        (prevTimeRef.current >= 30 && remainingTime === 30)
      ) {
        playMiddle();
      }
    }
    prevTimeRef.current = remainingTime;
  }, [remainingTime, gameActive, gamePaused, playMiddle]);

  return (
    <div className="relative max-w-5xl mx-auto mt-4 sm:mt-8 p-3 sm:p-6 bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-xl">
       <button
          onClick={onClose}
          className="absolute top-0 left-0 p-2 text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <FaTimes className="text-xl sm:text-2xl" />
      </button>
     
      <div className="text-center mb-4 sm:mb-8">
      <h1 className="text-xl sm:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">
        {sheetType === 'Ocean' ? '🌊 Ocean' : '🚀 Space'} Science Exploration
      </h1>
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
          <span className="text-lg sm:text-xl font-semibold">
            {gamePaused
                ? "Game Paused"
                : timeUp
                ? "Time's Up!"
                : `${remainingTime} seconds`}
          </span>
        </div>

          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                              {!showControls && (
                                <button
                                  onClick={startGame}
                                  disabled={gameActive}
                                 className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"
                                >
                                  <FaPlay className="mr-1 sm:mr-2" /> Start
                                </button>
                              )}
                  
                              {showControls && (
                                <>
                                  <button
                                    onClick={pauseGame}
                                    disabled={!gameActive || gamePaused}
                                                 className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"

                                  >
                                    <FaPause className="mr-1 sm:mr-2"  />Pause
                                  </button>
                                  <button
                                    onClick={resumeGame}
                                    disabled={!gamePaused}
                                      className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"

                                  >
                                    <BsSkipStartFill size={18} />
                                  </button>
                                  <button
                                    onClick={restartGame}
                                    disabled={!gameActive}
                                                      className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"

                                  >
                                  <FaRedo className="mr-1 sm:mr-2" /> Restart
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
                 value={turbines[index] || 0}
                 onChange={(e) => handleTurbineChange(index, e.target.value)}
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