import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { FiSearch } from "react-icons/fi";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import { FiPlusCircle, FiTrash2, FiUserX } from "react-icons/fi";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiCalendar } from "react-icons/fi";

export default function ListJudges() {
    const [searchQuery, setSearchQuery] = useState("");
    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedJudge, setSelectedJudge] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [formEvents, setFormEvents] = useState({
        competition_event: "",
        user: ""
    });
    const [eventName, setEventName] = useState(""); // State for dynamic event_name input
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
const [debouncedQuery, setDebouncedQuery] = useState("");

useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
}, [searchQuery]);
    const generatePDF = () => {
     if (!selectedDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Select Date',
      text: 'Please choose a date first!',
    });
    return;
  }
    const doc = new jsPDF();
    const filterDate = new Date(selectedDate);


  // إعدادات التنسيق
  const primaryColor = "#06b6d4";
  const headerColor = "#0e7490";
  const accentColor = "#ecfeff";
  
  // عنوان التقرير
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  doc.text("Judges Report", 15, 25);
  
        
        

  // إعداد بيانات الجدول
  const tableData = judges.flatMap((judge) => {
    const validEvents = judge.judging_events?.filter(event => {
      const start = new Date(event.competition_event.start_date);
      const end = new Date(event.competition_event.end_date);
      return start <= filterDate && filterDate <= end;
    }) || [];

    if (validEvents.length === 0) return [];

    return validEvents.map((event, index) => ({
      judge: index === 0 ? judge.username : "",
      event: event.competition_event.name,
      dates: `${event.competition_event.start_date} - ${event.competition_event.end_date}`,
      location: event.competition_event.location
    }));
  });

  // إنشاء الجدول
  doc.autoTable({
    startY: 45,
    head: [["Judge", "Event", "Dates", "Location"]],
    body: tableData.map(row => [row.judge, row.event, row.dates, row.location]),
    styles: {
      fontSize: 12, // حجم خط أكبر
      cellPadding: 4,
      valign: "top", // محاذاة علوية للنص
      fillColor: accentColor,
      textColor: 40,
      lineColor: 200,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: headerColor,
      textColor: 255,
      fontSize: 14, // حجم خط أكبر للعناوين
      fontStyle: "bold",
      valign: "middle"
    },
    bodyStyles: {
      minCellHeight: 15, // ارتفاع الصف الأدنى
    },
    columnStyles: {
      0: { 
        cellWidth: 35,
        fontStyle: "bold",
        halign: "left"
      },
      1: { cellWidth: 60 },
      2: { cellWidth: 50 },
      3: { cellWidth: 40 }
    },
    didParseCell: (data) => {
      if (data.column.index === 0 && data.cell.raw === "") {
        data.cell.styles.fillColor = 255; 
        data.cell.styles.lineColor = 200; 
      }
    }
  });

  doc.save(`judges-report-${selectedDate}.pdf`);
};

    // Fetch judges and their events
    const fetchJudgeEvent = async () => {
        if (!token) {
            setError("Authentication Error");
            setResponseMessage("You are not authorized. Please log in.");
            setAlertType("error");
            setLoading(false);
            return;
        }

        const myAPI = `${process.env.REACT_APP_API_URL}/admin/judges/`;
        try {
            setLoading(true);
            setError(null);
            setResponseMessage(null);

            const response = await axios.get(myAPI, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000 // 10-second timeout
            });

            setJudges(response.data);
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
                            err.response?.data?.message || "Failed to fetch events. Please try again."
                        );
                }
            } else {
                setResponseMessage("An unexpected error occurred. Please try again.");
            }
            setAlertType("error");
        }
    };

    const fetchEvents = async () => {
        if (!token || !eventName) return; 
                  const apiUrl = `${process.env.REACT_APP_API_URL}/competition/${eventName}/event/`;

        try {
            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data);
        } catch (err) {
            setError("Failed to fetch events. Please try again.");
        }
    };

    // Handle event assignment to judge
    const addEventJudge = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResponseMessage(null);
        setAlertType("");

        const eventData = {
            user: selectedJudge,
            competition_event: formEvents.competition_event
        };

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/admin/${eventData.competition_event}/judge-event/`,
                eventData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAlertType("success");
            setResponseMessage("Event assigned successfully!");
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Event assigned successfully!",
                showConfirmButton: false,
                timer: 1500
            });

            setFormEvents({ competition_event: "", user: "" });
            setShowModal(false);
            fetchJudgeEvent(); // Refresh the list
        } catch (err) {
            setAlertType("error");
            setResponseMessage(
                err.response?.data?.detail || "Failed to assign the event. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle judge deletion
    const handleDeleteJudge = async (judgeUsername) => {
        if (!token) {
            setError("Authentication Error");
            setResponseMessage("You are not authorized. Please log in.");
            setAlertType("error");
            return;
        }

        try {
            const myAPI = `${process.env.REACT_APP_API_URL}/admin/judge/${encodeURIComponent(judgeUsername)}/delete/`;
            await axios.delete(myAPI, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });

            setResponseMessage("Judge deleted successfully");
            setAlertType("success");
            fetchJudgeEvent(); // Refresh the list
        } catch (err) {
            setResponseMessage("Failed to delete the judge");
            setAlertType("error");
        }
    };

    // Handle event selection change
    const handleEventChange = (e) => {
        setFormEvents({
            ...formEvents,
            [e.target.name]: e.target.value
        });
    };

    // Handle event_name input change
    const handleEventNameChange = (e) => {
        setEventName(e.target.value);
    };

    // Fetch judges and events on component mount or when eventName changes
    useEffect(() => {
        fetchJudgeEvent();
    }, [token]);

    useEffect(() => {
        if (eventName) {
            fetchEvents();
        }
    }, [eventName, token]);

    const filteredJudges = judges.filter(judge => {
    const matchesName = judge.username.toLowerCase().includes(searchQuery);
    const matchesEvent = judge.judging_events?.some(event => 
        event.competition_event.name.toLowerCase().includes(searchQuery)
    );
    return matchesName || matchesEvent;
    });
    
   
    return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
            <h2 className="mb-12 text-center">
                <span className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                    All Judges
                </span>
                <div className="mt-2 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 w-24 mx-auto rounded-full" />
            </h2>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:max-w-xs">
                 <input
                    type="text"
                    placeholder="Search by judge name or event..."
                    className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                />
                </div>
                <div className="flex gap-4">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                    </div>
                <div className="flex gap-4">
                      {/* <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    /> */}
                    <button 
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white rounded-full hover:from-cyan-700 hover:to-cyan-500 transition-all shadow-sm hover:shadow-md"
                    onClick={() => navigate('/Dashboard/Admin/CreateStaff')}
                    >
                    Add New Judge +
                    </button>
                    <button 
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-full hover:from-emerald-700 hover:to-emerald-500 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                onClick={generatePDF}
                >
                <FiCalendar size={18} />
                Download PDF
                </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading judges...</p>
                </div>
            ) : error ? (
                <Alert severity="error" className="mb-4 rounded-lg">
                    <AlertTitle>Error</AlertTitle>
                    {responseMessage}
                </Alert>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Mobile View */}
                    <div className="block md:hidden space-y-4 p-4">
                        {filteredJudges.map((judge) => (
                            <motion.div 
                                key={judge.username}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-cyan-800">
                                        {judge.username}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedJudge(judge.username);
                                                setShowModal(true);
                                            }}
                                            className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                                        >
                                            <FiPlusCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJudge(judge.username)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {judge.judging_events?.length > 0 ? (
                                    <div className="space-y-3">
                                        {judge.judging_events.map((event) => (
                                            <div key={event.id} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="font-medium text-gray-500">Event:</div>
                                                    <div className="text-cyan-700">{event.competition_event.name}</div>
                                                    <div className="font-medium text-gray-500">Dates:</div>
                                                    <div className="text-gray-600">
                                                        {event.competition_event.start_date} - {event.competition_event.end_date}
                                                    </div>
                                                    <div className="font-medium text-gray-500">Location:</div>
                                                    <div className="text-gray-600">{event.competition_event.location}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3 text-gray-400 bg-gray-50 rounded-lg">
                                        No assigned events
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700">Judge</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700">Event</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700">Dates</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-700">Location</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredJudges.map((judge) => (
                                    <motion.tr 
                                        key={judge.username}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-cyan-900">{judge.username}</td>
                                        <td className="px-6 py-4">
                                            {judge.judging_events?.length > 0 ? (
                                                judge.judging_events.map((event) => (
                                                    <div key={event.id} className="text-sm text-gray-700">
                                                        {event.competition_event.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">No events</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {judge.judging_events?.map((event) => (
                                                <div key={event.id} className="text-sm text-gray-600">
                                                    {event.competition_event.start_date} - {event.competition_event.end_date}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4">
                                            {judge.judging_events?.map((event) => (
                                                <div key={event.id} className="text-sm text-gray-600">
                                                    {event.competition_event.location}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedJudge(judge.username);
                                                        setShowModal(true);
                                                    }}
                                                    className="text-cyan-600 hover:text-cyan-800 p-2 rounded-full hover:bg-cyan-50 transition-colors"
                                                >
                                                    <FiPlusCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteJudge(judge.username)}
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    <FiTrash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                   {filteredJudges.length === 0 && !loading && (
    <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
            <FiSearch size={48} className="mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-500 mb-2">
            No matching judges found
        </h3>
        <p className="text-gray-400">
            Try searching with different keywords
        </p>
    </div>
)}
                </div>
            )}

            {/* Enhanced Add Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                    >
                        {/* Modal content remains similar but with improved styling */}
                        <form onSubmit={addEventJudge} className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-cyan-800">Assign Event</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Enter Competition Name
                                        </label>
                                    <select type="text"
                                            value={eventName}
                                            onChange={handleEventNameChange}
                                            placeholder="e.g., vex_iq"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                    >
                                        <option value="">Select an Competition</option>
                                        <option value="vex_iq">Vex IQ</option>
                                        <option value="vex_go">Vex GO</option>
                                        <option value="vex_123">Vex 123</option>

                                        

                                    </select>
                                    </div>
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
                    </motion.div>
                </div>
            )}
        </div>
    );

}