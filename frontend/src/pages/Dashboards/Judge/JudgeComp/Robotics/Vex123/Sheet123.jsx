

import { useState, useEffect, useCallback, useMemo } from "react";
import { FaClock, FaPlay, FaPause, FaRedo, FaDownload, FaCheckCircle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Back from "../../../../../../components/Back/Back";
import Alert from "../../../../../../components/Alert/Alert";
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

// Helper functions
const getModeKey = (modeName) => modeName.toLowerCase().replace(/\s+/g, '');
const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function CompetitionSheet() {
  // State
    const { currentCompetition } = useEventNameContext();
  const [completedOrder, setCompletedOrder] = useState([]);
  const [taskStartTime, setTaskStartTime] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [timer, setTimer] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);
  const [completedModes, setCompletedModes] = useState([]);
  
  // Data structure for all modes
  const [allData, setAllData] = useState(() => {
    const initialData = {};
    GAME_MODES.forEach(mode => {
      initialData[getModeKey(mode.name)] = {
        times: {},
        done: {},
        timeDiffs: {}
      };
    });
    return initialData;
  });

  useEffect(() => {
    const newAllData = { ...allData };
    
    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeCompleted = completedOrder
        .filter(item => item.modeKey === modeKey)
        .sort((a, b) => a.time - b.time);

      // حساب الفروق الزمنية وتخزينها
      newAllData[modeKey].timeDiffs = calculateTimeDiffs(modeCompleted);
    });

    setAllData(newAllData);
  }, [completedOrder]);

  // Derived state
  const currentModeKey = currentMode ? getModeKey(currentMode.name) : null;
  const currentModeData = currentModeKey ? allData[currentModeKey] : null;
  
  useEffect(() => {
    if (isRunning && currentMode) {
      setTaskStartTime(INITIAL_TIME - timer);
    }
  }, [currentMode, isRunning]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Calculate scores
  const { totalScore, totalPossible, totalTime } = useMemo(() => {
    let totalScore = 0;
    let totalPossible = 0;
    let totalTime = 0;

    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { done: {}, times: {} };

      const modeCompleted = completedOrder
        .filter(item => item.modeKey === modeKey)
        .sort((a, b) => a.time - b.time);
      
      if (modeCompleted.length > 0) {
        // الوقت الأول: من بداية الوضع إلى أول مهمة
        totalTime += modeCompleted[0].time;
        
        // الفروق بين المهام اللاحقة
        for (let i = 1; i < modeCompleted.length; i++) {
          totalTime += (modeCompleted[i].time - modeCompleted[i-1].time);
        }
      }  
      
      const modeScore = mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
      
      totalScore += modeScore;
      totalPossible += mode.missions.reduce((sum, m) => sum + m.points, 0);
    });

    return { totalScore, totalPossible, totalTime };
  }, [allData, completedOrder]);

  const calculateTimeDiffs = (modeCompleted) => {
    const diffs = {};
    modeCompleted.forEach((task, idx) => {
      if (idx === 0) {
        diffs[task.taskIndex] = task.time; // الوقت من البداية
      } else {
        diffs[task.taskIndex] = task.time - modeCompleted[idx - 1].time;
      }
    });
    return diffs;
  };

  // Handlers
  const handleGameModeSelect = useCallback((mode) => {
    // إعادة تعيين المؤقت لـ 5 دقائق عند تغيير الوضع
    setTimer(INITIAL_TIME);
    setIsRunning(false); // إيقاف أي تشغيل سابق
    setCurrentMode(mode);
  }, []);

  const handleModeComplete = useCallback(() => {
    if (!currentMode || !isRunning || completedModes.includes(currentMode.name)) return;

    Alert.confirm({
      title: `Complete ${currentMode.name} Mode?`,
      html: `<p>You're about to mark <strong>${currentMode.name}</strong> mode as completed.</p>`,
      confirmText: 'Yes, Complete',
      onConfirm: () => {
        setCompletedModes(prev => [...prev, currentMode.name]);
        setIsRunning(false);
        Alert.success({
          title: 'Mode Completed!',
          text: `${currentMode.name} mode has been marked as completed.`
        });
      }
    });
  }, [currentMode, completedModes, isRunning]);

  const handleMissionComplete = useCallback((index) => {
    if (!currentModeKey || !isRunning) return;

    const newDoneStatus = !currentModeData?.done[index];
    const completionTime = INITIAL_TIME - timer;

    setAllData(prev => ({
      ...prev,
      [currentModeKey]: {
        ...prev[currentModeKey],
        done: { ...prev[currentModeKey].done, [index]: newDoneStatus },
        times: { ...prev[currentModeKey].times, [index]: completionTime }
      }
    }));

    // Update completed order مع إضافة معلومات الوضع
    if (newDoneStatus) {
      setCompletedOrder(prev => [
        ...prev,
        {
          modeKey: currentModeKey,
          taskIndex: index,
          time: completionTime
        }
      ]);
    } else {
      setCompletedOrder(prev =>
        prev.filter(item =>
          !(item.modeKey === currentModeKey && item.taskIndex === index)
        )
      );
    }
  }, [currentModeKey, isRunning, timer, currentModeData]);

  const getTimeDifference = (index) => {
    if (!currentModeKey) return '-';
    
    // الحصول على جميع المهام المكتملة لهذا الوضع مرتبة زمنيًا
    const modeCompleted = completedOrder.filter(
      item => item.modeKey === currentModeKey
    ).sort((a, b) => a.time - b.time);
    
    // البحث عن الوقت الحالي للمهمة
    const currentTask = modeCompleted.find(t => t.taskIndex === index);
    if (!currentTask) return '-';
    
    // إيجاد الفهرس الحالي في المصفوفة المرتبة
    const taskIndex = modeCompleted.findIndex(t => t.taskIndex === index);
    
    // إذا كانت المهمة الأولى: الوقت منذ بداية الوضع
    if (taskIndex === 0) {
      return formatTime(currentTask.time);
    }
    
    // حساب الفرق عن المهمة السابقة
    const prevTime = modeCompleted[taskIndex - 1].time;
    return formatTime(currentTask.time - prevTime);
  };

  const resetTimer = useCallback(() => {
    if (!currentMode) return; // لا تفعل شيئًا إذا لم يكن هناك وضع محدد

    const modeKey = getModeKey(currentMode.name);
    
    // إعادة تعيين بيانات الوضع الحالي فقط
    setAllData(prev => ({
      ...prev,
      [modeKey]: {
        times: {},
        done: {},
        timeDiffs: {},
        startTime: INITIAL_TIME
      }
    }));

    // إزالة الوضع الحالي من قائمة المكتملين إن كان موجودًا
    setCompletedModes(prev => prev.filter(mode => mode !== currentMode.name));
    
    // إعادة تعيين المؤقت و الحالة
    setIsRunning(false);
    setTimer(INITIAL_TIME);
    setCompletedOrder(prev =>
      prev.filter(item => item.modeKey !== modeKey)
    );
  }, [currentMode]);

  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX123 Competition Score Sheet", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${teamName}`, 20, 30);
    doc.text(`Time Remaining: ${formatTime(totalTime)}`, 20, 40);

    let finalY = 50;
    let totalMissionTime = 0;
    
    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { timeDiffs: {} };
      const missionDiffs = Object.values(modeData.timeDiffs);
      totalMissionTime += missionDiffs.reduce((sum, diff) => sum + diff, 0);
    });
    
    GAME_MODES.forEach(mode => {
      const modeKey = getModeKey(mode.name);
      const modeData = allData[modeKey] || { times: {}, done: {}, timeDiffs: {} };
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${mode.name} Mode`, 20, finalY);
      finalY += 10;
      
      const tableData = mode.missions.map((mission, index) => [
        mission.step,
        mission.description,
        mission.points,
        modeData.timeDiffs && modeData.timeDiffs[index] !== undefined ?
        `${formatTime(modeData.timeDiffs[index])}` : "N/A",
        modeData.done[index] ? "✔️" : "❌",
      ]);

      doc.autoTable({
        startY: finalY,
        head: [["Step", "Description", "Points", "Time", "Completed"]],
        body: tableData,
        theme: "striped",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [240, 240, 255]
        },
        margin: { left: 10, right: 10 }
      });
      
      const modeScore = mode.missions.reduce((sum, mission, index) => {
        return sum + (modeData.done[index] ? mission.points : 0);
      }, 0);
      
      const totalPossible = mode.missions.reduce((sum, m) => sum + m.points, 0);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${mode.name} Score: ${modeScore}/${totalPossible}`,
        20, doc.autoTable.previous.finalY + 10);
      
      finalY = doc.autoTable.previous.finalY + 20;
    });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Final Score: ${totalScore}/${totalPossible}`, 20, finalY);
    
    doc.save(`Team_${teamName}_Score_Sheet.pdf`);
  }, [teamName, allData, totalScore, totalPossible]);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 bg-white shadow-xl rounded-xl border border-gray-200">
      {/* Header */}
      <Back />
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">🤖 VEX123 Robotics</h1>
        <p className="text-sm sm:text-base md:text-xl text-gray-600">Performance Score Sheet</p>
      </div>
      
      {/* Team Info */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
          <label className="block text-sm sm:text-base font-semibold text-indigo-700 mb-1">👥 Team Name</label>
          <input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white text-sm sm:text-base"
          />
        </div>

        {/* Timer Controls */}
        <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <FaClock className="text-indigo-600 mr-2 text-lg sm:text-xl" />
              <span className={`text-base sm:text-xl font-semibold ${
                timer <= 60 ? 'text-red-600' : 'text-gray-700'
              }`}>
                {formatTime(timer)}
              </span>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  // منع التشغيل إذا كان الوضع مكتملًا
                  if (!completedModes.includes(currentMode?.name)) {
                    setIsRunning(!isRunning);
                  }
                }}
                disabled={timer === 0 || completedModes.includes(currentMode?.name)}
                className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-lg flex items-center justify-center ${
                  isRunning
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                } ${timer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRunning ? <FaPause className="mr-1 sm:mr-2" /> : <FaPlay className="mr-1 sm:mr-2" />}
                <span className="text-xs sm:text-sm">{isRunning ? "Pause" : "Start"}</span>
              </button>
              <button
                onClick={resetTimer}
                className="flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center"
                disabled={!currentMode} // تعطيل الزر إذا لم يكن هناك وضع محدد
              >
                <FaRedo className="mr-1 sm:mr-2" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Navigation */}
      <div className="mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-3 rounded-lg overflow-x-auto">
        <h2 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">Game Mode Progress</h2>
        <div className="flex space-x-2 min-w-max">
          {GAME_MODES.map((mode) => (
            <div key={mode.name} className="flex flex-col items-center min-w-[100px]">
              <button
                onClick={() => handleGameModeSelect(mode)}
                className={`w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  completedModes.includes(mode.name)
                    ? "bg-green-600 text-white shadow-md"
                    : currentMode?.name === mode.name
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
                }`}
              >
                {mode.name}
              </button>
              {completedModes.includes(mode.name) && (
                <span className="text-[10px] sm:text-xs mt-1 text-green-600">Completed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Mode Missions */}
      {currentMode && (
        <div className="mb-4 sm:mb-6 bg-white p-2 sm:p-3 rounded-lg border border-indigo-100 overflow-x-auto">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-indigo-700 mb-2 sm:mb-3">
            {currentMode.name} Missions
          </h2>
          <div className="min-w-[400px] sm:min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Mission</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-left text-xs sm:text-sm">Description</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Points</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Time</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">Done</th>
                </tr>
              </thead>
              <tbody>
                {currentMode.missions.map((mission, index) => (
                  <tr key={index} className="border-b border-indigo-50">
                    <td className="px-2 py-1 sm:px-3 sm:py-2 font-medium text-gray-800 text-xs sm:text-sm">
                      {mission.step}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-gray-700 text-xs sm:text-sm">
                      {mission.description}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                      {mission.points}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-center font-semibold text-xs sm:text-sm">
                      {getTimeDifference(index)}
                    </td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-center">
                      <input
                        type="checkbox"
                        onChange={() => handleMissionComplete(index)}
                        checked={!!currentModeData?.done[index] || false}
                        className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isRunning || completedModes.includes(currentMode.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 sm:mt-3 flex justify-end">
            <button
              onClick={handleModeComplete}
              disabled={!isRunning || completedModes.includes(currentMode.name)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${
                !isRunning || completedModes.includes(currentMode.name)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {completedModes.includes(currentMode.name) ? "Completed" : "Mark Complete"}
            </button>
          </div>
        </div>
      )}

      {/* Summary and Actions */}
      <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Score</h3>
            <p className="text-xl sm:text-2xl font-bold">
              {totalScore} / {totalPossible} points
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Time</h3>
            <p className="text-xl sm:text-2xl font-bold">
              {formatTime(totalTime)}
            </p>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
            disabled={!teamName}
          >
            <FaDownload className="mr-1 sm:mr-2" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}