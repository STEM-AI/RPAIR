

import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";



export default function JudgeEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  


  const token = localStorage.getItem("access_token");
  

  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      return;
    }
    const fetchJudgeEvent = async () => {
      const myURL= `${process.env.REACT_APP_API_URL}/event/judge-event-list/`
      
      try {
        const response = await axios.get(myURL,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(response.data);
        console.log(response.data);
        
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setAlertType("error");
          setResponseMessage("Unauthorized access. Please check your token.");
        } else {
          setAlertType("error");
          setResponseMessage("Failed to fetch Judge's event. Please try again.");
        }
      }
      
    }
    fetchJudgeEvent();
 }, [token]);
 





  return (
    <div className="mx-auto text-center flex flex-col justify-center items-center">
      <h2 className="mb-10 py-4  bg-clip-text text-blue-950
        text-3xl sm:text-4xl lg:text-5xl font-black">
        Events
      </h2>
       {responseMessage && (
              <div className="mb-6">
                <Alert severity={alertType}>
                  <AlertTitle>
                    {alertType === "success" ? "Success" : "Error"}
                  </AlertTitle>
                  {responseMessage}
                </Alert>
              </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full ">
        {events.map((event, index) => (
        <div key={index}>
          <h2>{event.competition_event.name}</h2>
          <p>Start Date: {event.competition_event.start_date}</p>
          <p>End Date: {event.competition_event.end_date}</p>
          <p>Location: {event.competition_event.location}</p>
        </div>
      ))}
      </div>
    </div>
  );
}



