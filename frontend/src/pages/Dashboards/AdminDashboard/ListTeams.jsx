
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import GroupsIcon from "@mui/icons-material/Groups";

const ListTeams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (!token) {
      setAlertType("error");
      setResponseMessage("You are not authorized. Please log in.");
      return;
    }

    const fetchTeams = async () => {
      try {
          setIsLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/team/list/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTeams(response.data);
        setFilteredTeams(response.data);
        setResponseMessage(null);
      } catch (err) {
        const errorMessage = err.response?.status === 401 
          ? "Unauthorized access. Please check your token."
          : "Failed to fetch teams. Please try again.";
        setAlertType("error");
        setResponseMessage(errorMessage);
        setTeams([]);
        setFilteredTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [token]);

  const handleSearchChange = (event) => {
    const query = event.target.value.trim().toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredTeams(teams);
      return;
    }

    const filtered = teams.filter(team => 
      team.name?.toLowerCase().includes(query)
    );

    setFilteredTeams(filtered);
  };

  if (!token) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Alert severity="error" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          You are not authorized. Please log in.
        </Alert>
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <CircularProgress size={60} thickness={4} className="text-cyan-500" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
     <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <div className="inline-block bg-cyan-100/20 p-6 rounded-2xl mb-8">
          <GroupsIcon className="text-cyan-500 w-16 h-16 mb-4" />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent mb-2">
            Team Directory
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Explore and manage all registered teams
          </p>
        </div>
      </motion.div>

      {responseMessage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Alert severity={alertType} className="rounded-lg">
            <AlertTitle>
              {alertType === "success" ? "Success" : "Error"}
            </AlertTitle>
            {responseMessage}
          </Alert>
        </motion.div>
      )}

<motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 flex justify-center"
      >
        <div className="w-full max-w-2xl">
          <TextField
            label="Search teams..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon className="text-gray-400 mr-2" />
              ),
              classes: {
                input: "py-3",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                "&:hover fieldset": { borderColor: "#0891b2" },
                "&.Mui-focused fieldset": { 
                  borderColor: "#0891b2",
                  borderWidth: "2px" 
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0891b2"
              }
            }}
          />
        </div>
      </motion.div>

      {filteredTeams.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-cyan-50/30 rounded-xl"
        >
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <GroupsIcon className="text-gray-400 w-12 h-12" />
          </div>
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            No teams found
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search terms or create a new team to get started
          </p>
        </motion.div>
      )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team, index) => (
          <motion.div
            key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-8 border-cyan-500 hover:border-cyan-600 relative "
          >

            
            <div className="absolute inset-0 bg-gradient-to-br from-white to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative px-6 py-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-800 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                  {team.name?.charAt(0) || "T"}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  {team.name || "Unnamed Team"}
                </h3>
               
              </div>

              <div className="flex flex-col gap-3">
                {team.is_completed && (
                  <Link 
                    to={`/Dashboard/User/Certificate/${team.id}`} 
                    className="w-full py-2 px-4 text-center font-medium text-white bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-lg hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Certificate
                  </Link>
                )}
                <Link
                  to={`/Dashboard/Teams/${team.name || ''}`}
                  className="w-full py-2 px-4 text-center font-medium text-cyan-700 bg-transparent rounded-lg border-2 border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center bg-gradient-to-r from-cyan-50 to-cyan-100 px-6 py-3 rounded-full shadow-sm">
          <span className="text-sm font-medium text-cyan-700">
            Displaying <span className="font-bold">{filteredTeams.length}</span> of{" "}
            <span className="font-bold">{teams.length}</span> teams
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ListTeams;