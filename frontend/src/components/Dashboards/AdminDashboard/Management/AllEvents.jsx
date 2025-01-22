
import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");

  // Fetch events on component mount
  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://147.93.56.71:8000/api/admin/competition-event-list/vex_iq/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setAlertType("error");
        setResponseMessage("Failed to fetch events. Please try again.");
      }
    };

    fetchEvents();
  }, [token]); // Hook runs once when component mounts

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter events based on the search query
    const filtered = events.filter(
      (event) =>
        event.competition_name.toLowerCase().includes(query.toLowerCase()) ||
        event.start_date.includes(query) ||
        event.end_date.includes(query) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  if (!token) {
    return (
      <div className="text-red-600 text-center mt-8">
        {responseMessage}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 tracking-tight text-3xl font-bold text-center">
        Events List
      </h2>

      {responseMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity={alertType}>
            <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
            {responseMessage}
          </Alert>
        </Stack>
      )}

      <div className="mb-4 flex justify-center">
        <TextField
          label="Search Events"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          sx={{ maxWidth: 400 }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 className="text-xl font-semibold">{event.competition_name}</h3>
            <p><strong>Start Date:</strong> {event.start_date}</p>
            <p><strong>End Date:</strong> {event.end_date}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;






