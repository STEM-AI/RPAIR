import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar, FaUsers,FaChevronDown } from "react-icons/fa"; // <-- التعديل هنا
import { IoPersonOutline } from "react-icons/io5";


export default function Rank({ eventName, eventCategory }) {
    const [skillsRank, setSkillsRank] = useState([]);
    const [teamworkRank, setTeamworkRank] = useState([]);
    const [coopRank, setCoopRank] = useState([]);
    const [gameRank, setGameRank] = useState([]);
    const [interviewRank, setInterviewRank] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoints = [];
                switch(eventCategory) {
                    case 'vex_iq':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/event/${eventName}/skills-rank/`,
                            `${process.env.REACT_APP_API_URL}/event/${eventName}/teamwork-rank/`,
                            `${process.env.REACT_APP_API_URL}/event/${eventName}/teams-interview-rank/`,
                        ];
                        break;
                    case 'vex_go':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/vex-go/${eventName}/coop/rank/`,
                            `${process.env.REACT_APP_API_URL}/vex-go/${eventName}/skills/rank/`,
                            `${process.env.REACT_APP_API_URL}/vex-go/${eventName}/team/interview/rank/`
                        ];
                        break;
                    case 'vex_123':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/vex-123/${eventName}/rank/`,
                            `${process.env.REACT_APP_API_URL}/vex-123/${eventName}/team/interview/rank/`
                        ];
                        break;
                    default:
                        endpoints = [];
                }

                const responses = await Promise.all(
                    endpoints.map(url => axios.get(url))
                );

                if (eventCategory === 'vex_iq') {
                    setSkillsRank(responses[0].data);
                    setTeamworkRank(responses[1].data);
                    setInterviewRank(responses[2].data);
                } else if (eventCategory === 'vex_go') {
                    setCoopRank(responses[0].data);
                    setSkillsRank(responses[1].data);
                    setInterviewRank(responses[2].data);
                } else if (eventCategory === 'vex_123') {
                    setGameRank(responses[0].data);
                    setInterviewRank(responses[1].data);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch rankings. Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, [eventName, eventCategory]);

    // const getTeamName = (teamId) => {
    //     const team = gameRank.find(t => t.team === teamId);
    //     return team ? team.team_name || team.team__name  : 'Unknown Team';
    // };
    const getTeamName = (teamId) => {
        let team;
        switch(eventCategory) {
            case 'vex_123':
                team = gameRank.find(t => t.team === teamId);
                break;
            case 'vex_go':
                team = skillsRank.find(t => t.team === teamId);
                break;
            default:
                team = null;
        }
        return team ? team.team_name || team.team__name || team.name : 'Unknown Team';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg font-medium">Loading rankings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* VEX IQ Rankings */}
                    {eventCategory === 'vex_iq' && (
                        <>
                            <RankingSection 
                                title="Skills Rankings" 
                                data={skillsRank} 
                                icon={<FaStar className="text-yellow-400" />}
                                scoreField="total_score"
                            />
                            <RankingSection 
                                title="Teamwork Rankings" 
                                data={teamworkRank} 
                                icon={<FaUsers className="text-blue-500" />}
                                scoreField="avg_score"
                            />
                            <div className="lg:col-span-2">
                                <RankingSection 
                                    title="Interview Rankings" 
                                    data={interviewRank} 
                                    icon={<IoPersonOutline className="text-purple-500" />}
                                    scoreField="interview_score"
                                />
                            </div>
                        </>
                    )}

                    {/* VEX GO Rankings */}
                    {eventCategory === 'vex_go' && (
                        <>
                            <RankingSection 
                                title="Coop Rankings" 
                                data={coopRank} 
                                icon={<FaUsers className="text-green-500" />}
                                scoreField="avg_score"
                            />
                            <RankingSection 
                                title="Skills Rankings" 
                                data={skillsRank} 
                                icon={<FaStar className="text-yellow-400" />}
                                scoreField="total_score"
                                timeField="skills_time"
                            />
                            <div className="lg:col-span-2">
                            <div className="bg-white shadow-xl rounded-2xl p-6">
                                
                                <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold  flex items-center gap-2">
                                    <IoPersonOutline className="text-green-500" />
                                    Interview Rankings
                                     </h2>
                                    </div>
                                    <FaChevronDown 
                                        className={`text-gray-500 transition-transform duration-200 ${
                                            isExpanded ? 'rotate-180' : ''
                                        }`}
                                    />
                                </div>
                                {isExpanded && (
                                <div className="space-y-4">
                                    {interviewRank.map((interview, index) => (
                                        <div key={interview.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-blue-600">#{index + 1}</span>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">
                                                            {getTeamName(interview.id)}
                                                        </h3>
                                                        <div className="text-sm text-gray-500">
                                                            Team ID: {interview.id}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-xl">{interview.interview_score} pts</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                            </div>
                        </>
                        )}

                    {/* VEX 123 Rankings */}
                    {eventCategory === 'vex_123' && (
                        <>
                            <RankingSection 
                                title="Game Rankings" 
                                data={gameRank} 
                                icon={<FaStar className="text-yellow-400" />}
                                scoreField="total_score"
                                timeField="total_time_taken"
                            />
                            
                            <div className="bg-white shadow-xl rounded-2xl p-6">
                                
                                <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold  flex items-center gap-2">
                                    <IoPersonOutline className="text-green-500" />
                                    Interview Rankings
                                     </h2>
                                    </div>
                                    <FaChevronDown 
                                        className={`text-gray-500 transition-transform duration-200 ${
                                            isExpanded ? 'rotate-180' : ''
                                        }`}
                                    />
                                </div>
                                {isExpanded && (
                                <div className="space-y-4">
                                    {interviewRank.map((interview, index) => (
                                        <div key={interview.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-blue-600">#{index + 1}</span>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">
                                                            {getTeamName(interview.id)}
                                                        </h3>
                                                        <div className="text-sm text-gray-500">
                                                            Team ID: {interview.id}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-xl">{interview.interview_score} pts</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const RankingSection = ({ title, data, icon, scoreField, timeField }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="bg-white shadow-xl rounded-2xl p-6">
         <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>
                <FaChevronDown 
                    className={`text-gray-500 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                    }`}
                />
            </div>
            {isExpanded && (
        <div className="space-y-4">
          {data.map((team, index) => (
            <div key={team.id || index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-600">#{index + 1}</span>
                  <div>
                    {/* التعديل هنا: استخدام team.name أولًا */}
                    <h3 className="font-semibold text-lg">{team.name || team.team_name || team.team__name}</h3>
                    <div className="text-sm text-gray-500">
                      Team ID: {team.team || team.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">{team[scoreField]} pts</p>
                  {timeField && <p className="text-sm text-gray-500">{team[timeField]}s</p>}
                </div>
              </div>
            </div>
          ))}
                </div>
            )}
      </div>
    );
  };