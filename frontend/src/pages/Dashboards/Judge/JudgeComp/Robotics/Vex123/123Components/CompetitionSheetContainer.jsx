import { useState, useEffect, useCallback, useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Alert from "../../../../../../../components/Alert/Alert";
import {
  INITIAL_TIME,
  GAME_MODES,
  getModeKey,
  formatTime
} from "./constants";
import Header from "./Header";
import TeamInput from "./TeamInput";
import TimerControls from "./TimerControls";
import GameModeNavigation from "./GameModeNavigation";
import MissionTable from "./MissionTable";
import SummarySection from "./SummarySection";
import SetSchedule from "./SetSchedule";

export default function CompetitionSheetContainer() {
  // State
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

      newAllData[modeKey].timeDiffs = calculateTimeDiffs(modeCompleted);
    });

    setAllData(newAllData);
  }, [completedOrder]);

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
        totalTime += modeCompleted[0].time;
        
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
        diffs[task.taskIndex] = task.time;
      } else {
        diffs[task.taskIndex] = task.time - modeCompleted[idx - 1].time;
      }
    });
    return diffs;
  };

  // Handlers
  const handleGameModeSelect = useCallback((mode) => {
    setTimer(INITIAL_TIME);
    setIsRunning(false);
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
    
    const modeCompleted = completedOrder.filter(
      item => item.modeKey === currentModeKey
    ).sort((a, b) => a.time - b.time);
    
    const currentTask = modeCompleted.find(t => t.taskIndex === index);
    if (!currentTask) return '-';
    
    const taskIndex = modeCompleted.findIndex(t => t.taskIndex === index);
    
    if (taskIndex === 0) {
      return formatTime(currentTask.time);
    }
    
    const prevTime = modeCompleted[taskIndex - 1].time;
    return formatTime(currentTask.time - prevTime);
  };

  const resetTimer = useCallback(() => {
    if (!currentMode) return;

    const modeKey = getModeKey(currentMode.name);
    
    setAllData(prev => ({
      ...prev,
      [modeKey]: {
        times: {},
        done: {},
        timeDiffs: {},
        startTime: INITIAL_TIME
      }
    }));

    setCompletedModes(prev => prev.filter(mode => mode !== currentMode.name));
    setIsRunning(false);
    setTimer(INITIAL_TIME);
    setCompletedOrder(prev =>
      prev.filter(item => item.modeKey !== modeKey)
    );
  }, [currentMode]);

  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();
    
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
      <Header />
      <SetSchedule event_name="vex_123" />

      
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <TeamInput teamName={teamName} setTeamName={setTeamName} />
        <TimerControls 
          timer={timer}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          resetTimer={resetTimer}
          currentMode={currentMode}
          completedModes={completedModes}
        />
      </div>

      <GameModeNavigation 
        GAME_MODES={GAME_MODES}
        handleGameModeSelect={handleGameModeSelect}
        currentMode={currentMode}
        completedModes={completedModes}
      />

      <MissionTable
        currentMode={currentMode}
        currentModeData={currentModeData}
        isRunning={isRunning}
        completedModes={completedModes}
        handleMissionComplete={handleMissionComplete}
        handleModeComplete={handleModeComplete}
        getTimeDifference={getTimeDifference}
      />

      <SummarySection 
        totalScore={totalScore}
        totalPossible={totalPossible}
        totalTime={totalTime}
        handleDownloadPDF={handleDownloadPDF}
        teamName={teamName}
      />
    </div>
  );
}