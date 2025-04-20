import React, { useState } from "react";
import axios from "axios";

const GameScheduleForm = ({ event_name, token, onSuccess }) => {
  const [selectedStage, setSelectedStage] = useState("");
  const [gameTime, setGameTime] = useState("");

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

      <div>
        <label className="block font-semibold mb-2">Game Time:</label>
        <input
          type="time"
          value={gameTime}
          onChange={(e) => setGameTime(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 "
      >
        Submit Game Schedule
      </button>
    </form>
  );
};

export default GameScheduleForm;
