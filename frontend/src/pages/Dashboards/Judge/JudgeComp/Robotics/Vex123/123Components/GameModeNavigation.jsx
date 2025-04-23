

// import axios from "axios";
// import { useState } from "react";
// import Swal from "sweetalert2";
// import { useEventNameContext } from "../../../../../../../context/EventName";

// export default function GameModeNavigation({ 
//   GAME_MODES, 
//   handleGameModeSelect, 
//   currentMode, 
//   completedModes,
//   selectedTeam 
// }) {
//   const { currentCompetition } = useEventNameContext();
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem("access_token");

//   const handleModeSelection = async (mode) => {
//     if (!selectedTeam?.id) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Team Required',
//         text: 'Please select a team before choosing a game mode',
//         confirmButtonColor: '#6366f1'
//       });
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/vex-123/${currentCompetition}/game/create/`,
//         {
//           team1: selectedTeam.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Verify the response structure matches your API
//       if (!response.data?.id) {
//         throw new Error("Invalid game creation response");
//       }

//       handleGameModeSelect({
//         mode,
//         gameId: response.data.id,
//         teamId: selectedTeam.id,
//         gameData: response.data // Pass full response if needed
//       });

//     } catch (error) {
//       console.error("Game creation error:", error);
//       console.error("Game creation error:", error.response?.data);

//       Swal.fire({
//         icon: 'error',
//         title: 'Game Creation Failed',
//         text: error.response?.data?.message || 'Could not create game session',
//         confirmButtonColor: '#6366f1'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-3 rounded-lg overflow-x-auto">
//       <h2 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">
//         Game Mode Progress {loading && "(Processing...)"}
//       </h2>
//       <div className="flex space-x-2 min-w-max">
//         {GAME_MODES.map((mode) => (
//           <div key={mode.name} className="flex flex-col items-center min-w-[100px]">
//             <button
//               onClick={() => handleModeSelection(mode)}
//               disabled={loading || completedModes.includes(mode.name)}
//               className={`w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
//                 completedModes.includes(mode.name)
//                   ? "bg-green-600 text-white shadow-md cursor-default"
//                   : currentMode?.name === mode.name
//                   ? "bg-indigo-600 text-white shadow-md"
//                   : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
//               } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
//             >
//               {mode.name}
//             </button>
//             {completedModes.includes(mode.name) && (
//               <span className="text-[10px] sm:text-xs mt-1 text-green-600">
//                 ✓ Completed
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useEventNameContext } from "../../../../../../../context/EventName";

export default function GameModeNavigation({ 
  GAME_MODES, 
  handleGameModeSelect, 
  currentMode, 
  completedModes,
  selectedTeam 
}) {
  const { currentCompetition } = useEventNameContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const formatTimeForAPI = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleModeSelection = async (mode) => {
    if (!selectedTeam?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Team Required',
        text: 'Please select a team before choosing a game mode',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/vex-123/${currentCompetition}/game/create/`,
        {
          team1: selectedTeam.id,
          time: formatTimeForAPI()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data?.id) {
        throw new Error("Invalid game creation response");
      }

      handleGameModeSelect({
        mode,
        gameId: response.data.id,
        teamId: selectedTeam.id,
        gameData: response.data
      });

    } catch (error) {
      console.error("Game creation error:", error);
      console.error("Game creation error details:", error.response?.data);

      Swal.fire({
        icon: 'error',
        title: 'Game Creation Failed',
        text: error.response?.data?.message || 
             error.response?.data?.time?.[0] || 
             'Could not create game session',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 sm:mb-6 bg-indigo-50 p-2 sm:p-3 rounded-lg overflow-x-auto">
      <h2 className="text-sm sm:text-base font-semibold text-indigo-700 mb-2">
        Game Mode Progress {loading && "(Processing...)"}
      </h2>
      <div className="flex space-x-2 min-w-max">
        {GAME_MODES.map((mode) => (
          <div key={mode.name} className="flex flex-col items-center min-w-[100px]">
            <button
              onClick={() => handleModeSelection(mode)}
              disabled={loading || completedModes.includes(mode.name)}
              className={`w-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                completedModes.includes(mode.name)
                  ? "bg-green-600 text-white shadow-md cursor-default"
                  : currentMode?.name === mode.name
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {mode.name}
            </button>
            {completedModes.includes(mode.name) && (
              <span className="text-[10px] sm:text-xs mt-1 text-green-600">
                ✓ Completed
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}