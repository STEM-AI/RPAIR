

import React, { useState, useEffect } from "react";
import { FaTimes, FaRedo } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Join = ({ event_id, eventName, onClose }) => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formEvents, setFormEvents] = useState({ competition_event: "" });

    const token = localStorage.getItem("access_token");

    const fetchTeam = async () => {
        if (!token) return;
        const apiUrl = `${process.env.REACT_APP_API_URL}/team/user/`;

        try {
            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeams(response.data);
        } catch (err) {
            setError("Failed to fetch events. Please try again.");
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setFormEvents(prev => ({ ...prev, [name]: value }));
    };

    const addEventJudge = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const eventData = {
            competition_event: event_id
        };

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/team/user/${formEvents.competition_event}/competition-event/`,
                eventData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Event assigned successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            onClose();
        } catch (err) {
            console.log(err);
            
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Failed to assign the event. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                    <form onSubmit={addEventJudge} className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-cyan-800">Join Event: {eventName}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Team
                                </label>
                                <select
                                    name="competition_event"
                                    value={formEvents.competition_event}
                                    onChange={handleEventChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                    required
                                >
                                    <option value="">Select a Team</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md disabled:opacity-50"
                            >
                                {isSubmitting ? "Joining..." : "Join Event"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Join;