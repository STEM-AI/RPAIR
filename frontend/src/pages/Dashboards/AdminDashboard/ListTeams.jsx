



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";

const ListTeams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setAlertType("error");
      setResponseMessage("You are not authorized. Please log in.");
      return;
    }

    const fetchTeams = async () => {
      try {
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
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent mb-2">
          All Teams
        </h2>
        <div className="h-1 bg-gradient-to-r from-cyan-500 to-cyan-700 w-24 mx-auto rounded-full" />
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
        <TextField
          label="Search teams..."
          placeholder="Search by name..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <SearchIcon className="text-gray-400 mr-2" />
            ),
          }}
          sx={{
            maxWidth: 500,
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover fieldset": { borderColor: "#06b6d4" },
              "&.Mui-focused fieldset": { 
                borderColor: "#06b6d4",
                borderWidth: "2px" 
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#06b6d4"
            }
          }}
        />
      </motion.div>

      {filteredTeams.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-xl text-gray-500 mb-4">
            No teams found matching your search
          </p>
          <p className="text-sm text-gray-400">
            Try adjusting your search terms or create a new team
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-cyan-500 hover:border-cyan-600"
            >
              <div className="px-6 py-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {team.name || "Unnamed Team"}
                </h3>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-xl font-bold">
                    {team.name?.charAt(0) || "T"}
                  </div>
                </div>
                <Link
                  to={`/Dashboard/Teams/${team.name || ''}`}
                  className="inline-block w-full py-2 px-4 text-center font-medium text-white bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-lg hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-block px-4 py-2 bg-gray-100 rounded-full">
          <p className="text-sm text-gray-600">
            Showing {filteredTeams.length} of {teams.length} teams
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ListTeams;