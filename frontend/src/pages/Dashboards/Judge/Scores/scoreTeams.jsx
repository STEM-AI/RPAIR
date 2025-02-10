

import { useState, useMemo } from "react";
import { FaRedo, FaBullseye, FaTimes } from "react-icons/fa";
import { GiThreeBurningBalls } from "react-icons/gi";

const PassCalculator = ({ onCalculate, onClose }) => {
  const [switchCount, setSwitchCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [passCount, setPassCount] = useState(0);

  // حساب نقاط التمريرات حسب عدد المفاتيح الممسوحة
  const getPassPoints = (switches) => {
    switch (switches) {
      case 4: return 12;
      case 3: return 10;
      case 2: return 8;
      case 1: return 4;
      default: return 1; // تمريرة بدون مفاتيح ممسوحة
    }
  };

  // حساب النقاط الكلية
  const score = useMemo(() => {
    return (
      goalCount * 1 + // كل هدف = 1 نقطة
      switchCount * 1 + // كل مفتاح ممسوح = 1 نقطة
      passCount * getPassPoints(switchCount) // حساب نقاط التمريرات
    );
  }, [switchCount, goalCount, passCount]);

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
          { label: "Switch", count: switchCount, setCount: setSwitchCount, icon: <FaRedo size={20} className="text-blue-500" />, max: 4 },
          { label: "Goal", count: goalCount, setCount: setGoalCount, icon: <FaBullseye size={20} className="text-green-500" /> },
          { label: "Pass", count: passCount, setCount: setPassCount, icon: <GiThreeBurningBalls size={20} className="text-orange-500" /> }
        ].map(({ label, count, setCount, icon, max }) => (
          <div key={label} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-semibold text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCount(max ? Math.min(max, count + 1) : count + 1)}
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

export default PassCalculator;
