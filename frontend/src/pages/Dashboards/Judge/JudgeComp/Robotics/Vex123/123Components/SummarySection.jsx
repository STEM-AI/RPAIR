
import { FaDownload, FaTrophy } from "react-icons/fa";
import { formatTime } from "./constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useEventNameContext } from "../../../../../../../context/EventName";
import Swal from "sweetalert2";

export default function SummarySection({ 
  totalScore, 
  totalPossible, 
  totalTime, 
  handleDownloadPDF, 
  teamName 
}) {
  const { currentCompetition } = useEventNameContext();
  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [teamRank, setTeamRank] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchRankings = async () => {
      if (!currentCompetition || !teamName) return;
      
      try {
        setLoadingRankings(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/vex-123/${currentCompetition}/rank/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRankings(response.data);
        
        // Find current team's rank
        const currentTeamRank = response.data.find(
          (team) => team.team_name === teamName
        );
        setTeamRank(currentTeamRank);
      } catch (error) {
        console.error("Failed to fetch rankings:", error);
        Swal.fire({
          icon: 'error',
          title: 'Rankings Unavailable',
          text: 'Could not load team rankings',
          confirmButtonColor: '#6366f1'
        });
      } finally {
        setLoadingRankings(false);
      }
    };

    fetchRankings();
  }, [currentCompetition, teamName, token]);

  return (
    <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg space-y-4">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Score</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {totalScore} / {totalPossible} points
          </p>
        </div>
        
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Total Time</h3>
          <p className="text-xl sm:text-2xl font-bold">
            {formatTime(totalTime)}
          </p>
        </div>
        
        <div className="text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700">Team Rank</h3>
          <p className="text-xl sm:text-2xl font-bold flex items-center justify-center">
            {loadingRankings ? (
              <span className="text-sm">Loading...</span>
            ) : teamRank ? (
              <>
                <FaTrophy className="mr-1 text-yellow-500" />
                #{teamRank.rank || 'N/A'}
              </>
            ) : (
              'N/A'
            )}
          </p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center transition-colors shadow-md"
          disabled={!teamName}
        >
          <FaDownload className="mr-1 sm:mr-2" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Rankings Table */}
      {rankings.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">
            Leaderboard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700">
                  <th className="px-2 py-1 text-left text-xs sm:text-sm">Rank</th>
                  <th className="px-2 py-1 text-left text-xs sm:text-sm">Team</th>
                  <th className="px-2 py-1 text-xs sm:text-sm">Score</th>
                  <th className="px-2 py-1 text-xs sm:text-sm">Time</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((team, index) => (
                  <tr 
                    key={team.team} 
                    className={`border-b border-indigo-50 ${
                      team.team_name === teamName ? 'bg-indigo-100 font-semibold' : ''
                    }`}
                  >
                    <td className="px-2 py-1 text-xs sm:text-sm">{index + 1}</td>
                    <td className="px-2 py-1 text-xs sm:text-sm">
                      {team.team_name}
                      {team.team_name === teamName && (
                        <span className="ml-1 text-xs text-indigo-500">(Your Team)</span>
                      )}
                    </td>
                    <td className="px-2 py-1 text-center text-xs sm:text-sm">{team.total_score}</td>
                    <td className="px-2 py-1 text-center text-xs sm:text-sm">{formatTime(team.total_time_taken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}