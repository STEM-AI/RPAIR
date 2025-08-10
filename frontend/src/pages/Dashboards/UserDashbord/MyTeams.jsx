import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import { Icon } from "@mui/material";
import { Groups, Engineering, School, Person, Phone, SmartToy, Search, Done } from "@mui/icons-material";
import { motion } from "framer-motion";
import ButtonLive from "../../../components/EventLive/ButtonLive";
const MyTeams = () => {
  const { id } = useParams();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [teamDetails, setTeamDetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState({});
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  
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
      navigate(`/login`);
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
  }, [token, id]);

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
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-teal-500 leading-tight">
          My Teams
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage your registered teams, view certificates, and track progress
        </p>
      </div>

      {responseMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Alert severity={alertType} className="rounded-lg shadow-sm">
            <AlertTitle className="font-semibold">
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            <span className="text-sm">{responseMessage}</span>
          </Alert>
        </motion.div>
      )}

      <div className="mb-8 max-w-2xl mx-auto animate-fade-in">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by team name, robot name, or event..."
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
          className="bg-white shadow-sm"
        />
      </div>

      {filteredTeams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const completedEvents = Array.isArray(team.is_completed) 
              ? team.is_completed.filter(event => event.is_completed)
              : [];
            
            const defaultEventId = completedEvents[0]?.id;
            const selectedEventId = selectedEvent[team.id] || defaultEventId;
            
            return (
              <motion.div 
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-5">
                  <div className="flex items-start mb-4">
                    <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-3 rounded-xl mr-4 shadow-inner">
                      <Groups className="text-cyan-700 text-2xl" />
                    </div>
                    <div className="flex min-w-0 justify-between  w-full">
                      <h3 className="text-xl font-bold text-gray-800 truncate">
                        {team.name || "Unnamed Team"}
                      </h3>

                      <ButtonLive team_id={team.id} />
                     
                    </div>
                  </div>
                  
                  {hasCompletedEvents(team) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center mb-2">
                        <div className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center">
                          <Done className="text-xs mr-1" />
                          {completedEvents.length} event{completedEvents.length > 1 ? 's' : ''} completed
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Certificate for:
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={selectedEventId}
                            onChange={(e) => handleEventChange(team.id, parseInt(e.target.value))}
                            className="flex-grow appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                          >
                            {completedEvents.map(event => (
                              <option key={event.id} value={event.id}>
                                {event.name}
                              </option>
                            ))}
                          </select>
                          <Link 
                            to={`/Dashboard/User/Certificate/${team.id}?event=${encodeURIComponent(selectedEventId)}`}
                            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-3 py-2 rounded-lg flex items-center whitespace-nowrap text-sm shadow-sm hover:shadow-md transition-all"
                          >
                            <Done className="mr-1 text-sm" /> Get
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/Dashboard/Teams/User/${team.id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium rounded-lg transition-all hover:from-cyan-700 hover:to-teal-600 shadow-sm hover:shadow-md"
                    >
                      <span>View Team Details</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {filteredTeams.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200"
        >
          <div className="inline-block p-4 bg-cyan-100 rounded-full mb-4">
            <Groups className="text-4xl text-cyan-700" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No teams found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery 
              ? "No teams match your search. Try different keywords." 
              : (
                <>
                  Try adjusting your search terms or create a new team to get started.
                  <br />
                  <Link to="/Dashboard/User/CreateTeam" className="text-cyan-600 hover:text-cyan-700">
                    Create a new team
                  </Link>
                </>
              )}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MyTeams;