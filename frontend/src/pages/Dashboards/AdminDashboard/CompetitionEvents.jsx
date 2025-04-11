

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";



const CompetitionEvents = () => {
const { event_name } = useParams() || {};  // Ensure destructuring doesn't break
  const formattedEventName = event_name ? event_name.replace(/_/g, " ").toUpperCase() : "UNKNOWN EVENT";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchEvents = async () => {
  const apiUrl = `${process.env.REACT_APP_API_URL}/admin/${event_name}/event-list/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      setLoading(false);
    }
  };


    fetchEvents();
  }, [event_name, token]);

  if (loading) {
    return <div className="text-center ">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl font-black">
        {formattedEventName} EVENTS
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={index}
              className="bg-white shadow overflow-hidden sm:rounded-lg p-4"
            >
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Event {index + 1}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Event Name: {event.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Start Date: {event.start_date || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                End Date: {event.end_date || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Location: {event.location || "N/A"}
              </p>

              {event.top3_teams?.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700">Top 3 Teams:</h4>
                  <ul className="list-disc list-inside">
                    {event.top3_teams.map((team, teamIndex) => (
                      <li key={teamIndex} className="text-sm text-gray-600">
                        {Object.entries(team).map(([key, value]) => (
                          <div key={key}>{key}: {value}</div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">
                  No top teams available.
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default CompetitionEvents;
