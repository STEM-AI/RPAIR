import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import { Icon } from "@mui/material";
import { Groups, Engineering, School, Person, Phone, SmartToy, Search, Done } from "@mui/icons-material";
const MyTeams = () => {
  const { team_name } = useParams();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [teamDetails, setTeamDetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState({});
  const token = localStorage.getItem("access_token");

  
  const handleEventChange = (teamId, eventId) => {
    setSelectedEvent(prev => ({
      ...prev,
      [teamId]: eventId
    }));
  };

  const hasCompletedEvents = (team) => {
    return Array.isArray(team.is_completed) && 
           team.is_completed.length > 0 && 
           team.is_completed.some(event => event.is_completed);
  };



  useEffect(() => {
    if (!token) {
      setResponseMessage("You are not authorized. Please log in.");
      setAlertType("error");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const teamsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!Array.isArray(teamsResponse.data)) {
          throw new Error("Invalid data format received from server");
        }

        setTeams(teamsResponse.data);
        setFilteredTeams(teamsResponse.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleApiError = (error) => {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Failed to fetch data. Please try again later.";
      
      setAlertType("error");
      setResponseMessage(errorMessage);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");

      }
    };

    fetchData();
  }, [token, team_name]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTeams(
      teams.filter(team => 
        team.name?.toLowerCase().includes(query) ||
        team.robot_name?.toLowerCase().includes(query) ||
        team.competition_event?.toLowerCase().includes(query)
      )
    );
  };

  if (!token) {
    return (
      <div className="text-center py-12">
        <Alert severity="error" className="max-w-md mx-auto">
          {responseMessage}
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="animate-pulse">
          <Groups className="text-4xl text-gray-300 mb-4" />
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-teal-500 leading-tight">
          My Teams
        </h2>
        <p className="text-gray-600 text-lg">Explore and manage your registered teams</p>
      </div>

      {responseMessage && (
        <div className="mb-8 animate-slide-down">
          <Alert severity={alertType} className="rounded-lg shadow-sm">
            <AlertTitle className="font-semibold">
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            <span className="text-sm">{responseMessage}</span>
          </Alert>
        </div>
      )}

      <div className="mb-8 max-w-2xl mx-auto animate-fade-in">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search className="text-gray-400 mr-2" />,
            sx: {
              borderRadius: '12px',
              '&:focus-within': {
                borderColor: '#0891b2',
                boxShadow: '0 0 0 3px rgba(8, 145, 178, 0.1)'
              }
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTeams.map((team) => {
          // Get completed events for this team
          const completedEvents = Array.isArray(team.is_completed) 
            ? team.is_completed.filter(event => event.is_completed)
            : [];
          
          // Set default selected event
          const defaultEventId = completedEvents[0]?.id;
          const selectedEventId = selectedEvent[team.id] || defaultEventId;
          
          return (
            <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out group hover:-translate-y-1.5 border border-gray-100">
            <div className="px-6 py-5">
              <div className="flex items-start mb-4">
                <div className="bg-cyan-100 p-3 rounded-lg mr-4">
                  <Groups className="text-cyan-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {team.name || "Unnamed Team"}
                  </h3>
                 
                </div>
              </div>
        
              <div className="mt-6 flex flex-wrap gap-2 justify-between border-t border-gray-100 pt-4">
                  {hasCompletedEvents(team) && (
                    <div className="flex flex-col w-full mb-2">
                      <label htmlFor={`event-select-${team.id}`} className="text-sm text-gray-600 mb-1">
                        Select event for certificate:
                      </label>
                      <div className="flex gap-2">
                        <select
                          id={`event-select-${team.id}`}
                          value={selectedEventId}
                          onChange={(e) => handleEventChange(team.id, parseInt(e.target.value))}
                          className="flex-grow appearance-none bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          {completedEvents.map(event => (
                            <option key={event.id} value={event.id}>
                              {event.name}
                            </option>
                          ))}
                        </select>
                        <Link 
                          to={`/Dashboard/User/Certificate/${team.id}?event=${encodeURIComponent(selectedEventId)}`}
                          className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-lg flex items-center whitespace-nowrap"
                        >
                          <Done className="mr-1" /> Certificate
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  <Link
                    to={`/Dashboard/Teams/User/${team.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium rounded-lg transition-all hover:from-cyan-700 hover:to-teal-600 shadow-sm hover:shadow-md"
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeams.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <Groups className="text-4xl text-gray-300 mb-4" />
          <p className="text-lg">No teams found matching your search</p>
        </div>
      )}
    </div>
  );
};



export default MyTeams;