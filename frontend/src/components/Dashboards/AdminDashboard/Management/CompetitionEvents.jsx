
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const CompetitionEvents = () => {

  const { competition_name } = useParams();


  const [events, setEvents] = useState([]);


  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const token = localStorage.getItem("access_token");

// my edit starts here to solve the issue on navigation ...
  useEffect(() => {
    console.log("Competition Name from URL:", competition_name);
  }, [competition_name]);
  const fetchEvents = async () => {
    const apiUrl = `http://147.93.56.71:8000/api/admin/competition-event-list/${competition_name}/`;
    console.log("Fetching events from:", apiUrl);
  
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setResponseMessage("Events fetched successfully!");
      setAlertType("success");
    } catch (err) {
      console.error("Error fetching events:", err);
      setAlertType("error");
      setResponseMessage("Failed to fetch events. Please try again.");
    }
  };
////////////////////////////////////////////////////////////////////  


  if (!token) {
    return (
      <div className="text-red-600 text-center mt-8">{responseMessage}</div>
    );
  }

  if (!competition_name) {
    return (
      <div className="text-red-600 text-center mt-8">
        Competition name is missing. Please go back and select a competition.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* عنوان الصفحة */}
      <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 text-5xl font-black">
        {competition_name.toUpperCase()} EVENTS
      </h2>

      {/* رسالة التنبيه */}
      {responseMessage && (
        <div className="mb-4">
          <Alert severity={alertType}>
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </div>
      )}

      {/* عرض الأحداث */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Location: {event.location}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Start Date: {event.start_date}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                End Date: {event.end_date}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Category: {event.category}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Fees: ${event.fees}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitionEvents;
