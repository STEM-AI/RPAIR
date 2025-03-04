import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { MdEvent, MdAccessTime, MdLocationOn, MdInfo, MdRefresh, MdError, MdPlayArrow, MdLock, MdDone } from 'react-icons/md';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


export default function EventDash() {
  const { competition_name } = useParams()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const token = localStorage.getItem("access_token");

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        status: 'upcoming',
        message: 'Not Started',
        timeLeft: Math.floor((start - now) / (1000 * 60)), // minutes until start
        color: 'bg-yellow-600 hover:bg-yellow-700',
        icon: MdLock
      };
    } else if (now >= start && now <= end) {
      return {
        status: 'in_progress',
        message: 'Start Judging',
        timeLeft: Math.floor((end - now) / (1000 * 60)), // minutes until end
        color: 'bg-green-600 hover:bg-green-700',
        icon: MdPlayArrow
      };
    } else {
      return {
        status: 'ended',
        message: 'Event Ended',
        timeLeft: 0,
        color: 'bg-gray-600 hover:bg-gray-700',
        icon: MdDone
      };
    }
  };

  const formatTimeLeft = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const fetchEventDash = async () => {
    if (!token) {
      setError("Authentication Error");
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      setLoading(false);
      return;
    }

    const myURL = `${process.env.REACT_APP_API_URL}/admin/${competition_name}/event-list/`;
    
    try {
      setLoading(true);
      setError(null);
      setResponseMessage(null);
      
      const response = await axios.get(myURL, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // 10 second timeout
      });
      
      setEvents(response.data);
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
    fetchEventDash();
  }, [token]); // Added token as dependency

  const handleRetry = () => {
    fetchEventDash();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <MdError className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Events</h2>
          <p className="text-gray-600 mb-6">{responseMessage}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
              text-white font-medium rounded-lg transition-colors duration-200"
          >
            <MdRefresh className="h-5 w-5 mr-2" />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        {/* <h2 className="text-center  py-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent
          text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"> */}
                <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-600 text-5xl font-black">

          All Events
        </h2>
        <button
         onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-600 hover:text-cyan-700 
            font-medium rounded-lg transition-colors duration-200"
        >
          <MdRefresh className="h-5 w-5 mr-2 text-cyan-800" />
          Refresh
        </button>
      </div>
      
      {responseMessage && (
        <div className="max-w-2xl mx-auto mb-8">
          <Alert 
            severity={alertType}
            className="rounded-lg shadow-md"
            onClose={() => setResponseMessage(null)}
          >
            <AlertTitle className="font-semibold">
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </div>
      )}
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <MdInfo className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Events Found</h3>
          <p className="mt-2 text-sm text-gray-500">There are currently no events assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event, index) => {
            const eventStatus = getEventStatus(
              event.start_date,
              event.end_date
            );

            return (
              <div key={index} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                  transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                      {event.name}
                    </h3>
                    <span className={`
                      px-2 py-1 text-xs font-semibold rounded-full
                      ${eventStatus.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        eventStatus.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {eventStatus.status === 'upcoming' && eventStatus.timeLeft > 0 && 
                        `Starts in ${formatTimeLeft(eventStatus.timeLeft)}`}
                      {eventStatus.status === 'in_progress' && 
                        `Ends in ${formatTimeLeft(eventStatus.timeLeft)}`}
                      {eventStatus.status === 'ended' && 'Ended'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MdEvent className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Start Date</p>
                        <p className="text-sm">
                          {new Date(event.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MdAccessTime className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">End Date</p>
                        <p className="text-sm">
                          {new Date(event.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MdLocationOn className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm line-clamp-1">
                          {event.location || 'No location specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <Link 
                  to={`/Dashboard/Event/${event.name}`}
                  onClick={() => localStorage.setItem("selected_event_name", event.name)}
                >
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      className={`w-full py-2 px-4 ${eventStatus.color} text-white font-medium rounded-lg 
                        transition-colors duration-200 flex items-center justify-center`}
                      disabled={eventStatus.status === 'ended'}
                    >
                      <eventStatus.icon className="h-5 w-5 mr-2" />
                      {eventStatus.message}
                    </button>
                  </div>
                </Link> */}


<Link 
  to={`/Dashboard/Event/${competition_name}/${event.name}`}
  state={{ eventName: event.name }}
>
  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
    <button 
      className={`w-full py-2 px-4 ${eventStatus.color} text-white font-medium rounded-lg 
        transition-colors duration-200 flex items-center justify-center`}
      disabled={eventStatus.status === 'ended'}
    >
      <eventStatus.icon className="h-5 w-5 mr-2" />
      {eventStatus.message}
    </button>
  </div>
</Link>


              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



