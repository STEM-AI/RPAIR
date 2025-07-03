import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaDownload, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import InterviewRankings from "../../../../../../components/IntervIQNotbookIQInspection/InterviewRankings";
import { useSearchParams } from "react-router-dom";

const questions = [
  "1 - Presentation Skills",
  "2 - Poster",
  "3 - Creativity",
  "4 - Team Work",
];

const scoreOptions = [1, 2, 3, 4, 5];

export default function InterviewSheet() {
  const [judge, setJudge] = useState("");
  const [scores, setScores] = useState(Array(questions.length).fill(""));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
      const [searchParams] = useSearchParams();
  const eventName = searchParams.get('eventName');
  const eventId = searchParams.get('eventId');
  console.log("eventName", eventName);
  

  useEffect(() => {
    const fetchJudge = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/data/profile/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJudge(`${res.data.first_name} ${res.data.last_name}`);
      } catch {
        setError("Failed to load judge data");
      }
    };

    fetchJudge();
  }, [token]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/list/`,
          {
            params: { competition_event__id: eventId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeams(res.data);
        console.log("Teams:", res.data);
        
      } catch (err) {
        setError("Failed to fetch teams");
      }
    };

    fetchTeams();
  }, [token]);

  const fetchTeamData = (teamId) => {
    const team = teams.find((t) => t.id === parseInt(teamId));
    setSelectedTeam(teamId);
    setTeamData(team);
  };

  const handleSubmit = async () => {
    if (!teamData?.id) {
      return Swal.fire("Error", "Please select a team first!", "error");
    }

    const totalScore = scores.reduce((sum, val) => sum + (parseInt(val) || 0), 0);

    try {
      setLoading(true);
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/vex-123/team/${teamData.id}/interview/`,
        { interview_score: totalScore },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("Success", "Scores submitted successfully!", "success");
      setScores(Array(questions.length).fill(""));
      setNotes("");
      setSelectedTeam("");
      setTeamData(null);
    } catch (err) {
      Swal.fire("Error", "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

 

  const handleDownloadPDF = () => {
    if (!teamData) {
      return Swal.fire("Error", "Please select a team first!", "error");
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text("VEX123 Interview", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Team: ${teamData.name}`, 20, 30);
    doc.text(`Judge: ${judge}`, 20, 40);

    const tableData = questions.map((q, i) => [q, scores[i] || "N/A"]);

    doc.autoTable({
      startY: 50,
      head: [["Category", "Score (1-5)"]],
      body: tableData,
    });

    doc.text(`Total Score: ${scores.reduce((sum, v) => sum + (parseInt(v) || 0), 0)}/20`, 20, doc.lastAutoTable.finalY + 10);
    doc.text(`Notes: ${notes}`, 20, doc.lastAutoTable.finalY + 20);
    doc.save(`Team_${teamData.name}_Interview_Score.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">🧩 VEX123 Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-indigo-700">Team Name</label>
          <select
            value={selectedTeam}
            onChange={(e) => fetchTeamData(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-700">Judge</label>
          <div className="p-3 border rounded bg-gray-50">{judge || "Loading..."}</div>
        </div>
      </div>

      <table className="w-full border mb-6">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-3">Category</th>
            <th className="p-3">Score (1-5)</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{q}</td>
              <td className="p-3">
                <select
                  value={scores[i]}
                  onChange={(e) => {
                    const newScores = [...scores];
                    newScores[i] = e.target.value;
                    setScores(newScores);
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  {scoreOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <textarea
        placeholder="Notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows="4"
        className="w-full p-3 border rounded mb-6"
      />

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button onClick={handleDownloadPDF} className="bg-indigo-600 text-white px-5 py-3 rounded">
          <FaDownload className="inline mr-2" /> Download PDF
        </button>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-5 py-3 rounded">
          <FaCheckCircle className="inline mr-2" /> Submit Evaluation
        </button>
       
      </div>

      <div className="text-center text-gray-600">
        <p>Total Score: {scores.reduce((sum, v) => sum + (parseInt(v) || 0), 0)} / 20</p>
      </div>

      
        <InterviewRankings
  apiUrl={`${process.env.REACT_APP_API_URL}/vex-123/${eventId}/team/interview/rank/`} 
/>
    </div>
  );
}
