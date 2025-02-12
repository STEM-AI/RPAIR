

import { useState, useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes } from "react-icons/fa";

const CalculatorSkills = ({ onCalculate, onClose, mode }) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);

  const getGoalPoints = (clearSwitch, goals) => {
    let goalValue = mode === "auto" ? 6 : 4; 

    if (clearSwitch === 4) goalValue = mode === "auto" ? 18 : 12;
    else if (clearSwitch === 3) goalValue = mode === "auto" ? 14 : 10;
    else if (clearSwitch === 2) goalValue = mode === "auto" ? 10 : 8;
    
    return goalValue * goals;
  };


  const score = useMemo(() => {
    return switchCount * (mode === "auto" ? 2 : 1) + getGoalPoints(switchCount, goalCount);
  }, [switchCount, goalCount, mode]);

  const handleCalculate = () => {
    onCalculate(score || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-2xl max-w-md mx-auto relative">

        <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        


        <div className="text-center text-xl font-bold text-gray-700 bg-gray-200 p-3 rounded-lg shadow-md mb-4">
          Current Score: <span className="text-green-600">{score}</span>
        </div>

        {[
          { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" /> },
          { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> }
        ].map(({ label, count, setCount, icon }) => (
          <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-semibold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCount(label === "Switch" ? Math.min(4, count + 1) : count + 1)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
              >
                +
              </button>
              <span className="text-lg font-bold">{count}</span>
              <button
                onClick={() => setCount(Math.max(0, count - 1))}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                -
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleCalculate}
          className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition text-lg font-semibold shadow-md"
        >
          Calculate Score
        </button>
      </div>
    </div>
  );
};

export default CalculatorSkills;
