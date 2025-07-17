import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiClock, FiCalendar, FiAward, FiLoader } from "react-icons/fi";

export default function DeleteSchedule() {
 const [selectedStage, setSelectedStage] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [scheduleID, setScheduleID] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState("");
    const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  const token = localStorage.getItem("access_token");

  const stagesOptions = [
    "driver_go",
    "driver_iq",
    "teamwork",
    "auto",
    "coop",
    "coding",
    "vex_123",
    "programming",
  ];

  const competitionOptions = [
    { value: "vex_iq", label: "Vex IQ" },
    { value: "vex_go", label: "Vex GO" },
    { value: "vex_123", label: "Vex 123" },
    { value: "programming", label: "Programming" },
  ];

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


 const fetchSchedules = async () => {
  setIsLoading(true);
  setError("");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/core/event/${selectedEvent}/schedule/`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          ordering: 'id',
          stage: selectedStage 
        },
      }
    );
    setSchedules(response.data);
  } catch (err) {
    setError("Failed to fetch schedules. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  if (selectedEvent && selectedStage) {
    fetchSchedules();
  }
}, [selectedEvent, selectedStage]);
    
    const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (selectedScheduleIds.length === 0) {
        setError("Please select at least one schedule to delete");
        return;
    }

    try {
        const deletePromises = selectedScheduleIds.map(id => 
        axios.delete(
            `${process.env.REACT_APP_API_URL}/core/event/schedule/${id}/`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            }
            }
        )
        );

        const results = await Promise.allSettled(deletePromises);
        
        // التحقق من النتائج
        const failedDeletions = results
        .filter(result => result.status === 'rejected')
        .map((result, index) => ({
            id: selectedScheduleIds[index],
            reason: result.reason.response?.data?.message || 'Unknown error'
        }));

        if (failedDeletions.length === 0) {
        setSuccessMessage(`${selectedScheduleIds.length} schedules deleted successfully!`);
        setSchedules(schedules.filter(s => !selectedScheduleIds.includes(s.id.toString())));
        setSelectedScheduleIds([]);
        } else {
        const errorMessages = failedDeletions
            .map(f => `ID ${f.id}: ${f.reason}`)
            .join('\n');
        setError(`Some deletions failed:\n${errorMessages}`);
        }

        setTimeout(() => {
        setSuccessMessage("");
        setError("");
        }, 5000);

    } catch (error) {
        setError("Error processing deletions: " + error.message);
    }
    };

  return (
     <form onSubmit={handleDelete} className="max-w-lg mx-auto p-8  transition-all duration-200 ">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <FiCalendar className="text-red-600" />
        Delete Game Schedule
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
        <label className=" text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
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
        <label className=" text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
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
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
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
        <label className=" text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
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

   {/* Schedule Selection */}
    <div className="mb-6">
    <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
        <FiClock className="text-cyan-600" />
        Select Schedules to Delete (Multiple selection)
    </label>
    <div className="relative">
        <select
        multiple
        value={selectedScheduleIds}
        onChange={(e) => setSelectedScheduleIds(Array.from(e.target.selectedOptions, option => option.value))}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all h-32"
        disabled={!schedules.length || isLoading}
        >
        {schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
            ID: {schedule.id} - {new Date(schedule.time).toLocaleString()}
            </option>
        ))}
        </select>
        {isLoading && (
        <FiLoader className="absolute right-4 top-4 animate-spin text-gray-400" />
        )}
    </div>
    </div>

      {/* Submit Button */}
    <button
            type="submit"
            disabled={isLoading || selectedScheduleIds.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
            {isLoading ? (
                <>
                <FiLoader className="animate-spin" />
                Deleting...
                </>
            ) : (
                <>
                <FiCalendar />
                Delete Selected Schedules ({selectedScheduleIds.length})
                </>
            )}
            </button>
    </form>
  );
};

