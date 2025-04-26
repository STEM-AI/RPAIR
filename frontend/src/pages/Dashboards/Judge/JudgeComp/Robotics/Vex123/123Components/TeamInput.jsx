
import { useState, useEffect } from "react";
import axios from "axios";
import { useEventNameContext } from "../../../../../../../context/EventName";
import Swal from "sweetalert2";

export default function TeamInput({ selectedTeam, setSelectedTeam }) {
  const { currentCompetition } = useEventNameContext();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/list/`,
          {
            params: { competition_event__name: currentCompetition },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeams(res.data);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch teams", "error");
      } finally {
        setLoading(false);
      }
    };

    if (currentCompetition) {
      fetchTeams();
    }
  }, [token, currentCompetition]);

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    const team = teams.find((t) => t.id === parseInt(teamId));
    setSelectedTeam(team || null); // تمرير كائن الفريق كاملًا أو null
  };

  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
      <label className="block text-sm sm:text-base font-semibold text-indigo-700 mb-1">
        👥 Team Name
      </label>
      {loading ? (
        <div className="w-full p-2 sm:p-3 border rounded-lg bg-white text-sm sm:text-base">
          Loading teams...
        </div>
      ) : (
        <select
          value={selectedTeam?.id || ""}
          onChange={handleTeamChange}
          className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white text-sm sm:text-base"
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}