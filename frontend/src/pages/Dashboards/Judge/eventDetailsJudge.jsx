import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaListAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CompetitionEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!startDate || !endDate) return 'TBD';
    
    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Ongoing';
    return 'Completed';
  };

  const fetchJudgeEvent = async () => {
    if (!token) {
      setError("You are not authorized. Please log in.");
      setLoading(false);
      return;
    }

    const myURL = `${process.env.REACT_APP_API_URL}/event/judge-event-list/`;
  
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(myURL, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        timeout: 10000
      });
      
      setEvents(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection.";
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Your session has expired. Please log in again.";
            break;
          case 403:
            errorMessage = "You don't have permission to access these events.";
            break;
          case 404:
            errorMessage = "Events resource not found.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchJudgeEvent();
  }, [token]);

 const handleCompetitionClick = (competitionName, eventName) => {
  navigate(`/Dashboard/Competitions/${competitionName}/${eventName}`);
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center mt-8" role="alert">
        {error}
      </div>
    );
  }
  return (
   <div className="container mx-auto px-4 ">
      <h2 className="py-4 mb-3 text-center text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
        Judge EVENTS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {events.length > 0 ? (
  events.map((event, index) => { // Add index here
    const status = getEventStatus(event.competition_event.start_date, event.competition_event.end_date);
    const statusColors = {
      Upcoming: 'bg-cyan-100 text-cyan-800',
      Ongoing: 'bg-orange-100 text-orange-800',
      Completed: 'bg-green-100 text-green-800',
      TBD: 'bg-gray-100 text-gray-800'
    };

    return (
      <div key={event.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg">
                    <FaListAlt className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{event.competition_event.name || "N/A"}</h3>
                    <span className="text-sm text-cyan-600 font-medium">Event #{index + 1}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {event.competition_event.start_date || "TBD"} - {event.competition_event.end_date || "TBD"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{event.competition_event.location || "Location not specified"}</span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-3">{event.competition_event.description}</p>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {status}
                    </span>
                   <button 
                  className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
                  onClick={() => handleCompetitionClick(
                    event.competition_event.competition_name,
                    event.competition_event.name
                  )}
                >
                  View Details
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                </div>
              </div>
            </div>
         );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No events found</div>
            <svg
              className="w-24 h-24 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionEvents;
