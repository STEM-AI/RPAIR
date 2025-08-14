import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiClock, FiCalendar, FiAward, FiLoader } from "react-icons/fi";

const GameScheduleForm = () => {
  const [selectedStage, setSelectedStage] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const competitionOptions = [
    { value: "vex_iq", label: "Vex IQ" },
    { value: "vex_go", label: "Vex GO" },
    { value: "vex_123", label: "Vex 123" },
    { value: "programming", label: "Programming" },
  ];

  const getStagesOptions = () => {
    if (eventName === "vex_iq") {
      return ["driver_iq", "teamwork", "auto"];
    } else if (eventName === "vex_go") {
      return ["driver_go", "coop", "coding"];
    } else if (eventName === "vex_123") {
      return ["vex_123"];
    } else if (eventName === "programming") {
      return ["programming"];
    } else {
      return ["No stages available"];
    }
  };

  const stagesOptions = getStagesOptions();

  useEffect(() => {
    if (eventName) {
      fetchEvents();
    }
  }, [eventName]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/competition/${eventName}/event/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!selectedEvent) {
      setError("Please select an event");
      return;
    }

    const formData = {
      stage: selectedStage,
      game_time: gameTime,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/core/event/${selectedEvent}/games/schedule/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSuccessMessage("Game schedule created successfully!");
      setGameTime("");
      setSelectedStage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating schedule");
    }
  };

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const upcomingCompetitions = events.filter(
    (comp) => comp.end_date >= today
  );


  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 duration-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <FiCalendar className="text-cyan-600" />
        Create Game Schedule
      </h2>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-lg flex items-center gap-2">
          <FiAward className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 text-green-700 bg-green-50 rounded-lg flex items-center gap-2">
          <FiAward className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Competition Type */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
          <FiAward className="text-cyan-600" />
          Competition Type
        </label>
        <select
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          disabled={isLoading}
        >
          <option value="">Select Competition Type</option>
          {competitionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Event Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
          <FiCalendar className="text-cyan-600" />
          Event
        </label>
        <div className="relative">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none"
            disabled={!eventName || isLoading}
          >
            <option value="">{isLoading ? 'Loading events...' : 'Select Event'}</option>
            {upcomingCompetitions.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} - <span>{new Date(event.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
              </option>
            ))}
          </select>
          {isLoading && (
            <FiLoader className="absolute right-4 top-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Stage Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
          <FiAward className="text-cyan-600" />
          Stage
        </label>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          required
        >
          <option value="">Select Stage</option>
          {stagesOptions.map((stage) => (
            <option key={stage} value={stage}>
              {stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Game Time */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
          <FiClock className="text-cyan-600" />
          Game Time
        </label>
        <div className="relative">
          <input
            type="time"
            value={gameTime}
            onChange={(e) => setGameTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all pr-12"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <FiLoader className="animate-spin" />
            Creating Schedule...
          </>
        ) : (
          <>
            <FiCalendar />
            Create Schedule
          </>
        )}
      </button>
    </form>
  );
};

export default GameScheduleForm;