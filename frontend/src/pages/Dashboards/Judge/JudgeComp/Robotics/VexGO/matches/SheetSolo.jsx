import { useState, useEffect, useRef } from "react";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { sortBy } from 'lodash';
import { useMatchContext } from './MatchContext';
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "../../../../../../../components/Alert/Alert";
import useSound from 'use-sound';
import { tasks as oceanTasks } from './SheetOcean';
import { tasks as spaceTasks } from './SheetSpace';



export default function SheetSolo({ selectedMatch, onClose, eventName, challengeType,sheetType }) {
  const { updateMatch, currentMatch } = useMatchContext();
  const [scores, setScores] = useState({});
  const [turbines, setTurbines] = useState({});
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedOrder, setCompletedOrder] = useState([]);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [tasks, setTasks] = useState(oceanTasks);
  const socketRef = useRef(null);
    const [timeUp, setTimeUp] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
    const [playStart] = useSound('/sounds/Start.MP3', { volume: 1 });
    const [playEnd] = useSound('/sounds/End.mp3', { volume: 1 });
  const [playMiddle] = useSound('/sounds/Middle.MP3', { volume: 1 });
  
  const gameId = currentMatch?.id
   const maxTime = challengeType === 'Driving Challenge' ? 120 : 60;
  const remainingTime = maxTime - timer;
  const prevRemainingTime = useRef(remainingTime);
  // WebSocket connection management

  
  useEffect(() => {
    setTasks(sheetType === 'Ocean' ? oceanTasks : spaceTasks);
  }, [sheetType]);


  useEffect(() => {
    if (!eventName || !gameId) {
         Alert.error({
      title: "Missing Information",
      text: "Event name or Match ID is missing. Please check your configuration.",
    });
    return;
    }

    const connectWebSocket = () => {
      setSocketStatus('connecting');
      const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/competition_event/${eventName}/game/${gameId}/`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        setSocketStatus('connected');
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.remaining_time !== undefined) {
            const elapsedTime = maxTime - Math.round(data.remaining_time);
            setTimer(elapsedTime);
            if (data.remaining_time <= 0) {
              setIsRunning(false);
            }
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setSocketStatus('error');
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        setSocketStatus('disconnected');
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [gameId, eventName]);

  useEffect(() => {
    if (!currentMatch) {
      onClose();
    }
  }, [currentMatch, navigate, onClose]);

  useEffect(() => {
    let interval;
    if (isRunning && timer < maxTime) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else if (timer >= maxTime) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, maxTime]);

  const sendSocketCommand = (action) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Unable to connect to server. Please try again.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    try {
      socketRef.current.send(JSON.stringify({
        action,
        eventName,
        game_id: currentMatch.id
      }));
      return true;
    } catch (error) {
      console.error(`Error sending ${action} command:`, error);
      return false;
    }
  };

   const EndGame = () => {
      setTimeUp(true);
  
      // Send a message to start the game via WebSocket
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ action: "end_game", event_name: eventName, game_id: gameId })
        );
      }
    };
  const handleStart = () => {
    if (sendSocketCommand("start_game")) {
      setIsRunning(true);
      playStart(); // تشغيل الصوت هنا
    }
  };

  const handlePause = () => {
    if (sendSocketCommand("pause_game")) {
      setIsRunning(false);
    }
  };

const handleReset = () => {
  Alert.confirm({
    title: 'Reset Match?',
    html: 'Are you sure you want to reset this match? All scores and timer will be reset.',
    confirmText: 'Reset',
    cancelText: 'Cancel',
    onConfirm: () => {
      if (sendSocketCommand("restart_game")) {
        setTimer(0);
        setIsRunning(false);
        setScores({});
        setTurbines(0);
        setCompletedOrder([]);
      }
    },
    onCancel: () => {
      Swal.fire('Cancelled', 'Match reset was cancelled', 'info');
    }
  });
}
  const handleCheckboxChange = (index, value) => {
    setScores(prev => ({ ...prev, [index]: value ? tasks[index].points : 0 }));
    
    if (value) {
      setCompletedOrder(prev => [...prev, { index, time: timer }]);
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== index));
    }
  };

  const handleTurbineChange = (index, value) => {
    let parsedValue = parseInt(value, 10) || 0;
    
    if (parsedValue > 5) parsedValue = 5;
    if (parsedValue < 0) parsedValue = 0;
  
    setTurbines(prev => ({ ...prev, [index]: parsedValue }));
    setScores(prev => ({ ...prev, [index]: parsedValue }));
  
    if (parsedValue > 0) {
      setCompletedOrder(prev => {
        const exists = prev.some(item => item.index === index);
        return exists ? prev : [...prev, { index, time: timer }];
      });
    } else {
      setCompletedOrder(prev => prev.filter(item => item.index !== index));
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

  Alert.confirm({
    title: 'Submit Final Score?',
    html: `<p>You're about to submit your final score of <strong>${totalScore}</strong> points.</p>`,
    confirmText: 'Submit',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/vex-go/game/${currentMatch.id}/skills/`,
          {
            score: totalScore || 0,
            time_taken: timer
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updateMatch(currentMatch.id, {
          score: totalScore || 0,
          taskTimes: completedOrder.reduce((acc, { index, time }) => ({ 
  ...acc, 
  [index]: time 
}), {}), 
          totalTime: timer
        });

        Swal.fire("Success", "Score has been submitted successfully", "success");
        onClose();
        EndGame();
      } catch (error) {
        console.error("Submission error:", error);
        console.log(error);
        
        Swal.fire("Error", "Failed to submit the score", "error");
      }
    },
    onCancel: () => {
      Swal.fire('Cancelled', 'Score submission was cancelled', 'info');
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
    doc.setFontSize(18).setTextColor(79, 70, 229)
      .text("Ocean Science Exploration", 105, 20, { align: "center" })
      .setFontSize(14)
      .text(`${currentMatch?.challengeType || 'Solo Challenge'}`, 105, 30, { align: "center" });

    doc.setFontSize(14).setTextColor(0)
      .text(`Match ID: ${gameId || ''}`, 20, 40)
      .text(`Teams: ${currentMatch?.team || ''}`, 20, 50)
.text(`Total Time: ${formatTime(timer)} / ${formatTime(maxTime)}`, 20, 60)
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
    doc.save(`Match_${gameId || ''}_Score.pdf`);
  };

    useEffect(() => {
    if (remainingTime === 0) {
      playEnd();
    }
  }, [remainingTime, playEnd]);

  useEffect(() => {
    if (isRunning) {
      const current = remainingTime;
      const prev = prevRemainingTime.current;

      // Play sound when reaching 25 or 35 seconds remaining
      if (prev >= 60 && current === 60 && challengeType === 'Driving Challenge') {
        playMiddle();
      }

      prevRemainingTime.current = current;
    }
  }, [remainingTime, isRunning, playMiddle]);


  // ###
  const getSocketStatusColor = (status) => {
  switch (status) {
    case 'connected': return 'text-green-600';
    case 'connecting': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getProgressBarColor = (remaining, max) => {
  const percentage = (remaining / max) * 100;
  if (percentage <= 25) return 'bg-red-500';
  if (percentage <= 50) return 'bg-yellow-500';
  return 'bg-teal-500';
};


  return (
    <div className="relative max-w-5xl mx-auto mt-4 sm:mt-8 p-3 sm:p-6 bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-xl">
      {/* Header */}
       <button
    onClick={onClose}
    className="absolute top-0 left-0 p-2 text-gray-400 hover:text-teal-600 transition-colors"
  >
    <FaTimes className="text-xl sm:text-2xl" />
  </button>

      <div className="text-center mb-4 sm:mb-8">
      <h1 className="text-xl sm:text-3xl font-bold text-teal-700 mb-1 sm:mb-2">
        {sheetType === 'Ocean' ? '🌊 Ocean' : '🚀 Space'} Science Exploration
      </h1>
        <p className="text-sm sm:text-lg text-gray-600">{currentMatch?.challengeType || 'Solo Challenge'}</p>
        <p className="text-sm sm:text-lg font-bold text-teal-700">Round {currentMatch?.round}</p>
      </div>

      {/* Match Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 bg-teal-50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-teal-700 mb-1">Match ID</h3>
          <p className="text-base sm:text-xl font-bold">{gameId || ''}</p>
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-teal-700 mb-1">Team</h3>
          <p className="text-base sm:text-xl font-bold">{currentMatch?.team || ''}</p>
        </div>
      </div>

    

      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-2 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-center mb-2 sm:mb-0">
          <FaClock className="text-teal-600 mr-2 text-lg sm:text-xl" />
          <span className="text-lg sm:text-xl font-semibold">
              {!isRunning && !timeUp ? "Match Paused" : 
              timeUp ? "Time's Up!" : 
              formatTime(maxTime - timer)}
              
              <span className={`ml-2 text-xs font-normal ${
                socketStatus === 'connected' ? 'text-green-600' : 
                socketStatus === 'connecting' ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                ({socketStatus})
              </span>
            </span>
        </div>
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={isRunning ? handlePause : handleStart}
            disabled={socketStatus !== 'connected'}
            className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center text-sm sm:text-base ${
              isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isRunning ? <FaPause className="mr-1 sm:mr-2" /> : <FaPlay className="mr-1 sm:mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            disabled={socketStatus !== 'connected'}
            className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-sm sm:text-base"
          >
            <FaRedo className="mr-1 sm:mr-2" /> Reset
          </button>
        </div>
      </div>
      


      {/* Score Table */}
      <div className="overflow-x-auto mb-4 sm:mb-8">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm sm:shadow-md">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Task</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Points</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm hidden sm:table-cell">Score</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm hidden sm:table-cell">Time</th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}`}>
                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{task.title}</td>
                <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium">{task.points}</td>
                <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm font-bold hidden sm:table-cell">
                  {task.isDynamic ? (scores[4] || 0) : (scores[index] || 0)}
                </td>
                <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm hidden sm:table-cell">
                  {getTimeDifference(index)}
                </td>
                <td className="px-2 sm:px-4 py-2 text-center">
                  {task.isDynamic ? (
                    <input
                    type="number"
                    min="0"
                    max="5"
                    value={turbines[index] || 0}
                    onChange={(e) => handleTurbineChange(index, e.target.value)}
                    className="w-12 sm:w-16 px-1 sm:px-2 py-1 border rounded text-center focus:ring-2 focus:ring-teal-400 text-xs sm:text-sm"
                    disabled={!isRunning || timer >= maxTime}
                  />
                  ) : (
                    <input
                      type="checkbox"
                      checked={!!scores[index]}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer"
                      disabled={!isRunning || timer >= maxTime}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Score */}
      <div className="bg-teal-50 p-2 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="text-center sm:text-left">
          <h3 className="text-xs sm:text-sm font-medium text-teal-700">Total Score</h3>
          <p className="text-2xl sm:text-3xl font-bold text-teal-600">{totalScore}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleSubmit}
            className="px-3 py-2 sm:px-5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center 
                     shadow-md hover:shadow-lg transition-all text-xs sm:text-base"
            
          >
            <FaCheckCircle className="mr-1 sm:mr-2" /> 
            Submit Score
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-2 sm:px-5 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg flex items-center justify-center 
                     shadow-md hover:shadow-lg transition-all text-xs sm:text-base"
            
          >
            <FaDownload className="mr-1 sm:mr-2" /> 
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}