// src/services/apiService.js
import axios from "axios";
import Swal from "sweetalert2";

export const fetchJudgeData = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/data/profile/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return `${response.data.first_name} ${response.data.last_name}`;
  } catch (error) {
    Swal.fire("Error", "Failed to fetch judge data", "error");
    return "";
  }
};

export const fetchTeams = async (token, competition) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/team/list/`,
      {
        params: { competition_event__id: competition },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire("Error", "Failed to fetch teams", "error");
    return [];
  }
};


export const submitScore = async (token, competition, teamId, scoreField, totalScore) => {
 
  try {
    await axios.patch(
      `${process.env.REACT_APP_API_URL}/team_event/${competition}/non-tech-score/${teamId}/`,
      { [scoreField]: totalScore },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    Swal.fire(`Success ${scoreField}!${totalScore}`, "Scores saved successfully", `total score: ${totalScore}`, "success");
  } catch (error) {
    Swal.fire("Error", "Submission failed", "error");
  }
};