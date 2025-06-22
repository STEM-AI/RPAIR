import { useState, useEffect } from "react";
import { FaTrophy, FaCheck, FaPlay, FaFlagCheckered, FaChevronLeft, FaChevronRight, FaClock, FaPause, FaRedo, FaChevronDown, FaTimes } from "react-icons/fa";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculatorSkills from "../Scores/ScoresSkills";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "../../../../../../../components/Alert/Alert";
import { useSearchParams } from "react-router-dom";
import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
import useSchedule from "../../../../../../../hooks/Schedule/Schedule"

const Skills = () => {
  const [expandedRounds, setExpandedRounds] = useState({ 1: true, 2: false, 3: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scores, setScores] = useState({});
    const [rankings, setRankings] = useState([]);
  const [confirmed, setConfirmed] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRound, setSelectedRound] = useState(1);
  const [scoreType, setScoreType] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [gameTime, setGameTime] = useState("");
  const [activeTab, setActiveTab] = useState('driver_iq');

  const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');
  const token = localStorage.getItem("access_token");

  const tabs = [
    { id: 'driver_iq', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
    { id: 'auto', label: 'Autonomous Challenge', icon: '🤖', color: 'blue' },
  ];

  const { 
    schedules: eventSchedules, 
    loading: schedulesLoading, 
    error: schedulesError, 
    refetch: refetchSchedules 
  } = useEventSchedules(event_name, tabs.find(tab => tab.id === activeTab)?.id, "-id"); // Order by descending ID

  const lastScheduleId = eventSchedules[0]?.id; // أول عنصر بعد الترتيب التنازلي
  const { 
    schedule: scheduleDetails, 
    loading: scheduleLoading, 
    error: scheduleError,
    refetch: refetchScheduleDetails 
  } = useSchedule(lastScheduleId);

  const fetchRankings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/event/${event_name}/skills-rank/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRankings(response.data);
    } catch (error) {
      console.error("Error fetching rankings:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRanking = () => {
    setShowRanking(prev => {
      const newState = !prev;
      if (newState) {
        fetchRankings(); 
      }
      return newState;
    });
  };
  // Fetch schedule


  


  const openCalculator = (team, round, type) => {
    if (confirmed[round]?.[team.id]) return;

    setSelectedTeam(team);
    setSelectedRound(round);
    setScoreType(type);
    setShowCalculator(true);

    setScores(prev => ({
      ...prev,
      [round]: {
        ...prev[round],
        [team.id]: {
          ...prev[round]?.[team.id],
          [type]: prev[round]?.[team.id]?.[type] || 0
        }
      }
    }));
  };

  // Score calculation handler
  const handleScoreCalculated = (calculatedScore) => {
    if (!selectedTeam || !selectedRound || !scoreType) return;

    setScores(prev => ({
      ...prev,
      [selectedRound]: {
        ...prev[selectedRound],
        [selectedTeam.id]: {
          ...prev[selectedRound]?.[selectedTeam.id],
          [scoreType]: calculatedScore || 0
        }
      }
    }));
    setShowCalculator(false);
  };
    const Th = ({ children, className }) => (
  <th className={`px-2.5 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider text-center ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className }) => (
  <td className={`px-2.5 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 text-center ${className}`}>
    {children}
  </td>
);

  // Ranking calculation

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header and Tabs */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🏆 Skills Challenge</h1>
        
        <div className="flex justify-center gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              {['Match', 'Team 1', 'Score', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-sm font-semibold text-white text-center uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(scheduleDetails?.games || []).map((match) => (
              <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center font-medium text-blue-600">#{match.id}</td>
                
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-gray-800">{match.team1_name}</span>
                    <span className="text-xs text-gray-500">#{match.team1}</span>
                  </div>
                </td>
                
               
                
                
                <td className="p-4 text-center">
                  {scores[selectedRound]?.[match.id]?.[activeTab === 'driver_iq' ? 'driver' : 'auto'] || 0}
                </td>
                
              

                <td className="p-4 text-center">
                           
                           
                            {!confirmed[selectedRound]?.[match.id] && (
                              <button
                                onClick={() => openCalculator(match, selectedRound, activeTab === 'driver_iq' ? 'driver' : 'auto')}
                                className="ml-2 text-green-600"
                              >
                               <AiOutlineCalculator  className="text-2xl "/>
                              </button>
                            )}
                          </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Loading State */}
        {(schedulesLoading || scheduleLoading) && (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        )}
        
        {/* Error State */}
        {schedulesError && (
          <div className="p-6 text-center bg-red-50 border-t-4 border-red-300">
            <div className="text-red-600 font-medium">⚠️ Error loading schedule: {schedulesError}</div>
          </div>
        )}
      </div>

      {/* Ranking Section */}
       <div className="flex justify-center mt-4 sm:mt-6 mb-4">
        <button
          onClick={handleToggleRanking}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 gap-2"
        >
          <FaTrophy className="shrink-0" />
          <span className="hidden sm:inline">View Ranking</span>
          <span className="sm:hidden">Ranking</span>
        </button>
      </div>

       {showRanking && (
  <div className="overflow-x-auto shadow-lg rounded-xl mt-4 bg-white p-4 border border-gray-200">
    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2">
      <FaTrophy className="text-yellow-500" />
      Team Rankings
      <FaTrophy className="text-yellow-500" />
    </h2>
    
    {isLoading ? (
      <div className="text-center py-8">
        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" 
             xmlns="http://www.w3.org/2000/svg" fill="none" 
             viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" 
                  stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-gray-600">Loading rankings...</p>
      </div>
    ) : error ? (
      <div className="text-center py-4 text-red-500">
        ⚠️ Error loading rankings: {error}
      </div>
    ) : rankings.length === 0 ? (
      <div className="text-center py-4 text-gray-500">
        🏟️ No rankings available yet
      </div>
    ) : (
      <table className="w-full border-collapse" aria-label="Team rankings">
        <thead>
          <tr className="bg-gray-50">
            <Th className="text-center w-20">Rank</Th>
            <Th className="text-left">Team</Th>
            <Th className="text-right pr-6">Total Score</Th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((team, index) => {
            const rank = index + 1;
            return (
              <tr
                key={team.team}
                className={`transition-all duration-150 ${
                  rank <= 3 ? 'bg-gradient-to-r' : 'hover:bg-gray-50'
                } ${
                  rank === 1 ? 'from-yellow-50/50 to-yellow-50' :
                  rank === 2 ? 'from-gray-50/50 to-gray-50' :
                  rank === 3 ? 'from-amber-50/50 to-amber-50' : ''
                }`}
              >
                <Td className="text-center font-semibold">
                  <div className="flex items-center justify-center">
                    {rank <= 3 ? (
                      <span className={` w-6 h-6 rounded-full flex items-center justify-center 
                        ${rank === 1 ? 'bg-yellow-400' : 
                          rank === 2 ? 'bg-gray-400' : 'bg-amber-600'} text-white`}>
                        {rank}
                      </span>
                    ) : (
                      <span className="text-gray-600">{rank}</span>
                    )}
                  </div>
                </Td>
                <Td className="text-left">
                  <div className="flex items-center justify-center ">
                    <span className=" w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2 ">
                      <span className="text-blue-600 font-medium">#{team.team}</span>
                    </span>
                    <span className="font-medium text-gray-800">{team.team__name}</span>
                  </div>
                </Td>
                <Td className="text-right pr-6">
                  <div className="flex items-center justify-end ">
                    <span className="font-semibold text-blue-600">
                      {typeof team.total_score === 'number' 
                        ? team.total_score.toFixed(2) 
                        : 'N/A'}
                    </span>
                    {rank <= 3 && (
                      <span className={`text-sm px-2 py-1 rounded-full 
                        ${rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          rank === 2 ? 'bg-gray-100 text-gray-800' :
                          'bg-amber-100 text-amber-800'}`}>
                        {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
                      </span>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
)}

      {showCalculator && selectedTeam && (
        <CalculatorSkills
          onCalculate={handleScoreCalculated}
          onClose={() => setShowCalculator(false)}
          mode={activeTab}
          gameId={selectedTeam.id}
          eventName ={event_name}
        />
      )}
    </div>
  );
};

export default Skills;



// import { useState, useEffect } from "react";
// import { FaTrophy, FaSync, FaPlay, FaFlagCheckered, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { AiOutlineCalculator } from "react-icons/ai";
// import CalculatorSkills from "../Scores/ScoresSkills";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useSearchParams } from "react-router-dom";
// import useEventSchedules from "../../../../../../../hooks/Schedule/EventSchedule";
// import useSchedule from "../../../../../../../hooks/Schedule/Schedule";

// const Skills = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [scores, setScores] = useState({});
//   const [rankings, setRankings] = useState([]);
//   const [showCalculator, setShowCalculator] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [scoreType, setScoreType] = useState(null);
//   const [showRanking, setShowRanking] = useState(false);
//   const [activeTab, setActiveTab] = useState('driver_iq');
//   const [round, setRound] = useState(1);
//   const [completedRounds, setCompletedRounds] = useState({
//     driver_iq: [],
//     auto: []
//   });
//   const [roundSchedules, setRoundSchedules] = useState([null, null, null]);

//   const [searchParams] = useSearchParams();
//   const event_name = searchParams.get('eventName');
//   const token = localStorage.getItem("access_token");

//   const tabs = [
//     { id: 'driver_iq', label: 'Driving Challenge', icon: '🚗', color: 'blue' },
//     { id: 'auto', label: 'Autonomous Challenge', icon: '🤖', color: 'blue' },
//   ];

//   // Fetch last 3 schedules for active tab
//   const { 
//     schedules: eventSchedules,
//     loading: schedulesLoading,
//     error: schedulesError,
//     refetch: refetchSchedules
//   } = useEventSchedules(event_name, activeTab, "-id");

//   // Get schedule details for each round
//   const round1Schedule = useSchedule(eventSchedules[0]?.id);
//   const round2Schedule = useSchedule(eventSchedules[1]?.id);
//   const round3Schedule = useSchedule(eventSchedules[2]?.id);

//   // Update round schedules
//   useEffect(() => {
//     setRoundSchedules([
//       round1Schedule,
//       round2Schedule,
//       round3Schedule
//     ]);
//   }, [round1Schedule, round2Schedule, round3Schedule]);

//   // Refresh schedules
//   const handleRefreshSchedule = async () => {
//     try {
//       await refetchSchedules();
//     } catch (err) {
//       console.error("Error refreshing schedule:", err);
//     }
//   };

//   // Fetch rankings
//   const fetchRankings = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/event/${event_name}/skills-rank/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setRankings(response.data);
//     } catch (error) {
//       console.error("Error fetching rankings:", error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleToggleRanking = () => {
//     setShowRanking(prev => {
//       const newState = !prev;
//       if (newState) {
//         fetchRankings(); 
//       }
//       return newState;
//     });
//   };

//   // Open calculator
//   const openCalculator = (team, type) => {
//     setSelectedTeam(team);
//     setScoreType(type);
//     setShowCalculator(true);

//     setScores(prev => ({
//       ...prev,
//       [round]: {
//         ...prev[round],
//         [team.id]: {
//           ...prev[round]?.[team.id],
//           [type]: prev[round]?.[team.id]?.[type] || 0
//         }
//       }
//     }));
//   };

//   // Handle score calculation
//   const handleScoreCalculated = (calculatedScore) => {
//     if (!selectedTeam || !scoreType) return;

//     setScores(prev => ({
//       ...prev,
//       [round]: {
//         ...prev[round],
//         [selectedTeam.id]: {
//           ...prev[round]?.[selectedTeam.id],
//           [scoreType]: calculatedScore || 0
//         }
//       }
//     }));
//     setShowCalculator(false);
//   };

//   // Component styling helpers
//   const Th = ({ children, className }) => (
//     <th className={`px-6 py-4 text-left ${className}`}>
//       {children}
//     </th>
//   );

//   const Td = ({ children, className }) => (
//     <td className={`px-6 py-4 ${className}`}>
//       {children}
//     </td>
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//           ⚡ Skills Challenge
//         </h1>
        
//         {/* Challenge Tabs */}
//         <div className="flex justify-center gap-4 mb-8">
//           {tabs.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => {
//                 setActiveTab(tab.id);
//                 setRound(1);
//                 handleRefreshSchedule();
//               }}
//               className={`px-8 py-3 rounded-xl flex items-center gap-3 transition-all ${
//                 activeTab === tab.id 
//                   ? `bg-gradient-to-br ${tab.color === 'blue' ? 'from-blue-600 to-blue-600' : 'from-purple-600 to-pink-600'} shadow-lg`
//                   : 'bg-gray-100 hover:bg-gray-200'
//               }`}
//             >
//               <span className="text-2xl">{tab.icon}</span>
//               <span className={`font-semibold ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}>
//                 {tab.label}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Round Navigation */}
//       <div className="flex justify-center items-center gap-4 mb-6">
//         <button
//           onClick={() => setRound(r => Math.max(1, r - 1))}
//           disabled={round === 1}
//           className={`p-2 rounded-full ${round === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-gray-100'}`}
//         >
//           <FaChevronLeft className="text-xl" />
//         </button>
        
//         <div className="flex gap-1">
//           {[1, 2, 3].map(r => (
//             <button
//               key={r}
//               onClick={() => setRound(r)}
//               className={`w-8 h-8 rounded-full flex items-center justify-center 
//                 ${round === r ? 'bg-blue-600 text-white' : 'bg-gray-200'}
//                 ${completedRounds[activeTab].includes(r) ? '!bg-green-500' : ''}`}
//             >
//               {r}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => setRound(r => Math.min(3, r + 1))}
//           disabled={round === 3}
//           className={`p-2 rounded-full ${round === 3 ? 'text-gray-400' : 'text-blue-600 hover:bg-gray-100'}`}
//         >
//           <FaChevronRight className="text-xl" />
//         </button>
//       </div>

//       {/* Matches Table */}
//       <div className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-blue-600 to-blue-600 text-white">
//               <tr>
//                 <Th className="rounded-tl-xl">Match</Th>
//                 <Th>Team</Th>
//                 <Th>Score</Th>
//                 <Th className="rounded-tr-xl">Actions</Th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {roundSchedules[round - 1]?.schedule?.games?.map(team => (
//                 <tr
//                   key={team.id}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <Td className="font-semibold text-gray-700">#{team.id}</Td>
//                   <Td>
//                     <div className="flex flex-col">
//                       <span className="font-medium">{team.team1_name}</span>
//                       <span className="text-xs text-gray-500 mt-0.5">#{team.team1}</span>
//                     </div>
//                   </Td>
//                   <Td className="font-bold text-blue-600">
//                     {scores[round]?.[team.id]?.[activeTab === 'driver_iq' ? 'driver' : 'auto'] || 0}
//                   </Td>
//                   <Td>
//                     <button
//                       onClick={() => openCalculator(team, activeTab === 'driver_iq' ? 'driver' : 'auto')}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <AiOutlineCalculator className="text-2xl"/>
//                     </button>
//                   </Td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Controls Section */}
//       <div className="flex justify-center gap-4 mb-8">
//         <button
//           onClick={handleToggleRanking}
//           className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2"
//         >
//           <FaTrophy />
//           {showRanking ? "Hide Rankings" : "View Rankings"}
//         </button>
        
//         <button
//           onClick={handleRefreshSchedule}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
//         >
//           <FaSync />
//           Refresh Schedule
//         </button>
//       </div>

//       {/* Rankings Table */}
//       {showRanking && (
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-4 flex items-center gap-3">
//             <FaTrophy className="text-white text-2xl" />
//             <h2 className="text-white text-xl font-bold">Skills Rankings</h2>
//           </div>
//           <div className="overflow-x-auto">
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" 
//                      xmlns="http://www.w3.org/2000/svg" fill="none" 
//                      viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" 
//                           stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" 
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <p className="mt-3 text-gray-600">Loading rankings...</p>
//               </div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">
//                 ⚠️ Error loading rankings: {error}
//               </div>
//             ) : rankings.length === 0 ? (
//               <div className="text-center py-4 text-gray-500">
//                 🏟️ No rankings available yet
//               </div>
//             ) : (
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <Th className="text-center">Rank</Th>
//                     <Th className="text-center">Team</Th>
//                     <Th className="text-center">Total Score</Th>
//                     <Th className="text-center">Medal</Th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {rankings.map((team, index) => {
//                     const rank = index + 1;
//                     return (
//                       <tr
//                         key={team.team}
//                         className={`transition-all duration-150 ${
//                           rank <= 3 ? 'bg-gradient-to-r' : 'hover:bg-gray-50'
//                         } ${
//                           rank === 1 ? 'from-yellow-50/50 to-yellow-50' :
//                           rank === 2 ? 'from-gray-50/50 to-gray-50' :
//                           rank === 3 ? 'from-amber-50/50 to-amber-50' : ''
//                         }`}
//                       >
//                         <Td className="font-medium text-gray-900 text-center">
//                           <div className="flex items-center justify-center">
//                             {rank <= 3 ? (
//                               <span className={`w-6 h-6 rounded-full flex items-center justify-center 
//                                 ${rank === 1 ? 'bg-yellow-400' : 
//                                   rank === 2 ? 'bg-gray-400' : 'bg-amber-600'} text-white`}>
//                                 {rank}
//                               </span>
//                             ) : (
//                               <span className="text-gray-600">{rank}</span>
//                             )}
//                           </div>
//                         </Td>
//                         <Td className="text-center">
//                           <div className="flex items-center justify-center gap-2">
//                             <span className="font-medium text-gray-800">{team.team__name}</span>
//                             <span className="text-sm text-gray-500">#{team.team}</span>
//                           </div>
//                         </Td>
//                         <Td className="font-bold text-blue-600 text-center">
//                           {typeof team.total_score === 'number' 
//                             ? team.total_score.toFixed(2) 
//                             : 'N/A'}
//                         </Td>
//                         <Td className="text-center">
//                           {rank === 1 && <span className="text-yellow-500 text-xl">🥇</span>}
//                           {rank === 2 && <span className="text-gray-400 text-xl">🥈</span>}
//                           {rank === 3 && <span className="text-amber-600 text-xl">🥉</span>}
//                         </Td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Calculator Modal */}
//       {showCalculator && selectedTeam && (
//         <CalculatorSkills
//           onCalculate={handleScoreCalculated}
//           onClose={() => setShowCalculator(false)}
//           mode={activeTab}
//           gameId={selectedTeam.id}
//           eventName={event_name}
//         />
//       )}
//     </div>
//   );
// };

// export default Skills;
                          