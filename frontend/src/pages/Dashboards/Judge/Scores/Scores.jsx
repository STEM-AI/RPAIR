

import { useState } from "react";
import { FaRedo, FaBullseye, FaTimes } from "react-icons/fa";

const Calculator = ({ onCalculate, onClose }) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [score, setScore] = useState(0);

  const calculateScore = () => {
    const result = switchCount * 1 + goalCount * 4; // تعديل الحساب
    setScore(result);
    onCalculate(result);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-2xl max-w-md mx-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Score Calculator
        </h2>

        {/* Inputs */}
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
                onClick={() => setCount(count + 1)}
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

        {/* Buttons */}
        <button
          onClick={calculateScore}
          className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition text-lg font-semibold shadow-md"
        >
          Calculate Score
        </button>

        {score !== 0 && (
          <div className="mt-4 text-center text-xl font-bold text-gray-700 bg-gray-200 p-3 rounded-lg shadow-md">
            Total Score: <span className="text-green-600">{score}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
