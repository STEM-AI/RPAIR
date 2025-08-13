import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

export default function AddScore({ onClose, eventName, competition_name, selectedTeam, selectedTeamName, onScoreAdded, eventID }) {
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState("");
  const token = localStorage.getItem("access_token");

  // Effect to handle response messages
  useEffect(() => {
    if (responseMessage && alertType) {
      if (alertType === "error") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseMessage,
          showConfirmButton: true,
        });
      }
      // Success is already handled in the addScore function
    }
  }, [responseMessage, alertType]);

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const addScore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);
    setAlertType("");

    if (!score || !selectedTeam) {
      setAlertType("error");
      setResponseMessage("Please enter a valid score");
      setIsSubmitting(false);
      return;
    }

    const scoreData = {
      team: selectedTeam,
      score: parseInt(score)
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/${competition_name}/${eventID}/score/${selectedTeam}/`,
        scoreData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertType("success");
      setResponseMessage("Score added successfully!");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Score added successfully!",
        showConfirmButton: false,
        timer: 1500
      });
      onClose();
      if (onScoreAdded) onScoreAdded(); // Refresh the team list
    } catch (err) {
      setAlertType("error");
      setResponseMessage(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        "Failed to add score. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-cyan-100"
      >
        <div className="bg-gradient-to-r from-cyan-600 to-teal-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Add Score</h3>
              <p className="text-sm opacity-90 mt-1 flex items-center">
                <span className="bg-white/20 rounded-full px-2.5 py-1 mr-2 text-xs">
                  {selectedTeam}
                </span>
                {selectedTeamName}
              </p>
            </div>
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full transition-colors"
              aria-label="Close"
            >
              <IoClose size={24} />
            </motion.button>
          </div>
        </div>

        <form onSubmit={addScore} className="p-6">
          <div className="mb-6">
            <label htmlFor="score" className="block text-sm font-medium text-slate-700 mb-3">
              Score Value
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="score"
              type="number"
              value={score}
              onChange={handleScoreChange}
              className="w-full px-5 py-3.5 border-2 border-cyan-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all text-lg font-medium"
              placeholder="0"
              min="0"
              max="100"
              required
              autoFocus
            />
            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Min: 0</span>
              <span>Max: 100</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ backgroundColor: "#f1f5f9" }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-500 rounded-xl hover:from-cyan-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300 disabled:opacity-70 transition-all shadow-md flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Score"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}