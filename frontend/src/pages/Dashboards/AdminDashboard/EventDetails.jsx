import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineDateRange } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";





export default function EventDetails() {
    const { event_name } = useParams()
    const formattedEventName = event_name ? event_name.replace(/_/g, " ").toUpperCase() : "UNKNOWN EVENT";
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("access_token");
    console.log("event_name", event_name);
    



    useEffect(() => {
    const fetchEvents = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/event/${event_name}/profile/`;
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
          setEvents(response.data);
          console.log("API Response:", response.data);
          
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
        setLoading(false);
      }
    };

    fetchEvents();
    }, [event_name, token]);
    
    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mx-auto text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Event</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!events || Object.keys(events).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-400">📭</div>
          <h2 className="text-xl font-semibold text-gray-600">No Event Data Found</h2>
          <p className="text-gray-500 mt-2">We couldn't find any details for this event.</p>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {formattedEventName}
          </h1>
          <div className="mt-2 flex justify-center items-center space-x-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            <FaStar className="mr-1" />
              
              {events.category}
            </span>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              {events.fees === 0 ? 'FREE ENTRY' : `${events.fees} EGP`}
            </span>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl">
          <div className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Event Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                  Event Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <HiOutlineLocationMarker className="mr-1 text-gray-500 text-2xl" />
                                      
                    <div className="ml-3">
                      <p className="text-lg font-medium text-gray-900">{events.location}</p>
                      <p className="text-gray-500">Location</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MdOutlineDateRange className="mr-1 text-gray-500 text-2xl" />
                    <div className="ml-3">
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(events.start_date).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                      <p className="text-gray-500">Start Date</p>
                    </div>
                  </div>

                  {/* Similar blocks for other details */}
                </div>
              </div>

              {/* Participating Teams */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                  Participating Teams
                </h2>

                {events.teams?.length > 0 ? (
                  <div className="space-y-4">
                    {events.teams.map((team, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {team.type}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Robot:</span> {team.robot_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Leader:</span> {team.team_leader_name}
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center text-sm text-gray-500">
                                 <IoPersonOutline className="mr-1 text-gray-600 text-base" />
                              {team.members?.length || 0} members
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    
                        <FaPeopleGroup className="mx-auto text-6xl text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No teams have registered yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

