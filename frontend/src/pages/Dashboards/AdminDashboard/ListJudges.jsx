import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

export default function ListJudges() {

    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deletionError, setDeletionError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedJudge, setSelectedJudge] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const [formEvents, setFormEvents] = useState({
        competition_event: "",
        user: ""
    });
    const event_name= 'vex_iq'
    const formattedEventName = event_name ? event_name.replace(/_/g, " ").toUpperCase() : "UNKNOWN EVENT";
      const [events, setEvents] = useState([]);

    const fetchJudgeEvent = async () => {
        if (!token) {
            setError("Authentication Error");
            setResponseMessage("You are not authorized. Please log in.");
            setAlertType("error");
            setLoading(false);
            return;
        }

        const myAPI = `${process.env.REACT_APP_API_URL}/admin/judges/`    
        try {
            setLoading(true);
            setError(null);
            setResponseMessage(null);
            
            const response = await axios.get(myAPI, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000 // 10 second timeout
            });
            
            setJudges(response.data);
            // console.log(response.data);
            
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);

            if (err.code === "ECONNABORTED") {
                setResponseMessage("Request timed out. Please check your connection and try again.");
            } else if (axios.isAxiosError(err)) {
                switch (err.response?.status) {
                    case 401:
                        setResponseMessage("Your session has expired. Please log in again.");
                        break;
                    case 403:
                        setResponseMessage("You don't have permission to access these events.");
                        break;
                    case 404:
                        setResponseMessage("The events resource was not found. Please try again later.");
                        break;
                    case 500:
                        setResponseMessage("Server error. Please try again later.");
                        break;
                    default:
                        setResponseMessage(
                            err.response?.data?.message || 
                            "Failed to fetch events. Please try again."
                        );
                }
            } else {
                setResponseMessage("An unexpected error occurred. Please try again.");
            }
            setAlertType("error");
        }
    };

    useEffect(() => {
        fetchJudgeEvent();
    }, [token]); // Added token as dependency

    const handleDeleteJudge = async (judgeUsername) => {
        if (!token) {
            setError("Authentication Error");
            setResponseMessage("You are not authorized. Please log in.");
            setAlertType("error");
            return;
        }

        try {
            const myAPI = `${process.env.REACT_APP_API_URL}/admin/judge/${judgeUsername}/delete/`;
            console.log('Deleting judge at URL:', myAPI); // For debugging
            
            await axios.delete(
                myAPI,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            setResponseMessage("Judge deleted successfully");
            setAlertType("success");
            fetchJudgeEvent(); // Refresh the list after deletion
        } catch (err) {
            console.error('Delete error:', err.response || err);
            setDeletionError("Failed to delete the judge.");
            setResponseMessage("Failed to delete the judge");
            setAlertType("error");
        }
    };

    const handleEventChange = (e) => {
        setFormEvents({
            ...formEvents,
            [e.target.name]: e.target.value
        });
    };

    const addEventJudge = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResponseMessage(null);
        setAlertType("");

         const eventData = {
            user: selectedJudge,
            competition_event: formEvents.competition_event  // Send the event name directly
        };

        console.log('Sending data:', eventData); // For debugging

        try {
            const eventJudge = await axios.post(
                `${process.env.REACT_APP_API_URL}/admin/judge-event/`,
                eventData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAlertType("success");
            setResponseMessage("Judge and event created successfully!");
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Event assigned successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            
            setFormEvents({
                competition_event: "",
                user: ""
            });
            setShowModal(false);
            fetchJudgeEvent(); // Refresh the list
        } catch (err) {
            console.error("Error Response:", err.response);
            setAlertType("error");
            setResponseMessage(
                err.response?.data?.detail || "Failed to create the judge and event. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

     useEffect(() => {
    const fetchEvents = async () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/admin/${event_name}/event-list/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
        setLoading(false);
        console.log(response.data);
        
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      setLoading(false);
    }
  };


    fetchEvents();
  }, [event_name, token]);


    return (
        <div className="container mx-auto px-4 py-4">
            <div className="text-center">
                <h2 className="mb-4 py-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-950 to-cyan-500 text-4xl md:text-5xl font-black">
                    All Judges
                </h2>
            </div>
            
            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 mx-auto"></div>
                </div>
            ) : error ? (
                <Alert severity="error" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    {responseMessage}
                </Alert>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    {/* Mobile view */}
                    <div className="block md:hidden">
                        {judges.map((judge, index) => (
                            <div key={index} className="p-4 border-b">
                                <div className="font-medium text-lg mb-2">{judge.username}</div>
                                {judge.judging_events && judge.judging_events.length > 0 ? (
                                    judge.judging_events.map((event, eventIndex) => (
                                        <div key={`${index}-${eventIndex}`} className="mb-4 bg-gray-50 p-3 rounded">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="font-medium">Event:</div>
                                                <div>{event.competition_event.name}</div>
                                                <div className="font-medium">Start:</div>
                                                <div>{event.competition_event.start_date}</div>
                                                <div className="font-medium">End:</div>
                                                <div>{event.competition_event.end_date}</div>
                                                <div className="font-medium">Location:</div>
                                                <div>{event.competition_event.location}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-sm mb-2">No events assigned</div>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <button 
                                        onClick={() => {
                                            setSelectedJudge(judge.username);
                                            setShowModal(true);
                                        }}
                                        className="text-cyan-600 hover:text-cyan-900 text-sm bg-cyan-50 px-3 py-1 rounded-full"
                                    >
                                        Add Event
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteJudge(judge.username)}
                                        className="text-red-600 hover:text-red-900 text-sm bg-red-50 px-3 py-1 rounded-full"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Desktop view */}
                    <div className="hidden md:block min-w-full align-middle">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">Username</th>
                                        <th scope="col" colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">Assigned Events</th>
                                        <th scope="col" rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">Actions</th>
                                    </tr>
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">Event Name</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">Start Date</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">End Date</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {judges.map((judge, index) => (
                                        <React.Fragment key={index}>
                                            {judge.judging_events && judge.judging_events.length > 0 ? (
                                                judge.judging_events.map((event, eventIndex) => (
                                                    <tr key={`${index}-${eventIndex}`} className={`hover:bg-gray-50 ${eventIndex > 0 ? 'border-t border-gray-200' : ''}`}>
                                                        {eventIndex === 0 && (
                                                            <td className="px-6 py-4 whitespace-nowrap border border-gray-200" rowSpan={judge.judging_events.length}>
                                                                <div className="text-sm text-center font-medium text-gray-900">{judge.username}</div>
                                                            </td>
                                                        )}
                                                        <td className="px-6 py-4 border border-gray-200">
                                                            <div className="text-sm text-center text-gray-900">
                                                                {event.competition_event.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 border border-gray-200">
                                                            <div className="text-sm text-center text-gray-900">
                                                                {event.competition_event.start_date}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 border border-gray-200">
                                                            <div className="text-sm text-center text-gray-900">
                                                                {event.competition_event.end_date}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 border border-gray-200">
                                                            <div className="text-sm text-center text-gray-900">
                                                                {event.competition_event.location}
                                                            </div>
                                                        </td>
                                                        {eventIndex === 0 && (
                                                            <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200" rowSpan={judge.judging_events.length}>
                                                                <button 
                                                                    onClick={() => {
                                                                        setSelectedJudge(judge.username);
                                                                        setShowModal(true);
                                                                    }}
                                                                    className="text-cyan-600 hover:text-cyan-900 px-2 py-1 mx-1 rounded"
                                                                >
                                                                    AddEvent
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteJudge(judge.username)}
                                                                    className="text-red-600 hover:text-red-900 px-2 py-1 mx-1 rounded"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                                                        <div className="text-sm text-center font-medium text-gray-900">{judge.username}</div>
                                                    </td>
                                                    <td colSpan={4} className="px-6 py-4 text-center border border-gray-200">
                                                        <div className="text-sm text-gray-500">No events assigned</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-200">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedJudge(judge.username);
                                                                setShowModal(true);
                                                            }}
                                                            className="text-cyan-600 hover:text-cyan-900 px-2 py-1 mx-1 rounded"
                                                        >
                                                            AddEvent
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteJudge(judge.username)}
                                                            className="text-red-600 hover:text-red-900 px-2 py-1 mx-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                            {judges.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    No judges found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div
                    id="addEventModal"
                    className="fixed top-0 left-0 right-0 h-screen w-full z-50 bg-[rgba(0,0,0,0.45)] flex items-center justify-center px-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">Add Event</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={addEventJudge} className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Event
                                    </label>
                                    <select
                                        name="competition_event"
                                        value={formEvents.competition_event}
                                        onChange={handleEventChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                        required
                                    >
                                        <option value="">Select an event</option>
                                        {events.map((event) => (
                                            <option key={event.id} value={event.name}>
                                                {event.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md disabled:opacity-50"
                                >
                                    {isSubmitting ? "Adding..." : "Add Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
