import React, { useState } from "react";
import axios from "axios";

const GameScheduleForm = ({ event_name, token, onSuccess }) => {
  const [selectedStage, setSelectedStage] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [schedule, setSchedule] = useState([]);

  const stagesOptions = [
    "driver_go",
    "driver_iq",
    "teamwork",
    "auto",
    "coop",
    "coding",
    "vex_123",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      stage: selectedStage,
      game_time: gameTime,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/core/event/${event_name}/games/schedule/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Game schedule created:", response.data);
      setSchedule(response.data);
      if (onSuccess) {
        onSuccess(response.data);

      }
    } catch (error) {
      console.error("Error creating game schedule:", error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block font-semibold mb-2">Select Stage:</label>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select a stage --</option>
          {stagesOptions.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>
       <div className="flex justify-center mb-6 gap-4">
            <input
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              required
              className="px-4 py-2 rounded-md border border-indigo-300 focus:ring-2 focus:ring-indigo-200 text-lg"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
            >
              Set Game Schedule
            </button>
        </div>
    </form>
  );
};

export default GameScheduleForm;

