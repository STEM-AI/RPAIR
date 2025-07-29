import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar, FaUsers, FaChevronDown } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";

export default function Rank({ eventName, eventCategory, eventId }) {
    const [skillsRank, setSkillsRank] = useState([]);
    const [teamworkRank, setTeamworkRank] = useState([]);
    const [coopRank, setCoopRank] = useState([]);
    const [gameRank, setGameRank] = useState([]);
    const [interviewRank, setInterviewRank] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoints = [];
                switch (eventCategory) {
                    case 'vex_iq':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/event/${eventId}/skills-rank/`,
                            `${process.env.REACT_APP_API_URL}/event/${eventId}/teamwork-rank/`,
                            `${process.env.REACT_APP_API_URL}/event/${eventId}/teams-interview-rank/`,
                        ];
                        break;
                    case 'vex_go':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/vex-go/${eventId}/coop/rank/`,
                            `${process.env.REACT_APP_API_URL}/vex-go/${eventId}/skills/rank/`,
                            `${process.env.REACT_APP_API_URL}/vex-go/${eventId}/team/interview/rank/`
                        ];
                        break;
                    case 'vex_123':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/vex-123/${eventId}/rank/`,
                            `${process.env.REACT_APP_API_URL}/vex-123/${eventId}/team/interview/rank/`
                        ];
                        break;
                    case 'programming':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/programming/rank/${eventId}/`,
                        ];
                        break;
                    case 'arduino':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/arduino/${eventId}/rank/`,
                        ];
                        break;
                    case 'flutter':
                        endpoints = [
                            `${process.env.REACT_APP_API_URL}/flutter/${eventId}/rank/`,
                        ];
                        break;
                    default:
                        endpoints = [];
                }

                const responses = await Promise.all(
                    endpoints.map(url => axios.get(url))
                );

                // Clear previous state
                setSkillsRank([]);
                setTeamworkRank([]);
                setCoopRank([]);
                setGameRank([]);
                setInterviewRank([]);

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
                } else if (
                    eventCategory === 'arduino' ||
                    eventCategory === 'flutter' ||
                    eventCategory === 'programming'
                ) {
                    setGameRank(responses[0].data);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch rankings. Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, [eventName, eventCategory, eventId]);

    const getTeamName = (teamId) => {
        let team;
        switch (eventCategory) {
            case 'vex_123':
                team = gameRank.find(t => t.team === teamId);
                break;
            case 'vex_go':
                team = skillsRank.find(t => t.team === teamId);
                break;
            case 'arduino':
            case 'flutter':
            case 'programming':
                team = gameRank.find(t => t.id === teamId);
                break;
            default:
                team = null;
        }
        return team ? team.team_name || team.team__name || team.name : 'Unknown Team';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-gray-700 text-xl font-medium">Loading rankings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Rankings</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* VEX IQ Rankings */}
                    {eventCategory === 'vex_iq' && (
                        <>
                            <RankingSection
                                title="Skills Rankings"
                                data={skillsRank}
                                icon={<FaStar className="text-yellow-500" />}
                                scoreField="total_score"
                                isExpanded={expandedSections.skills}
                                toggleExpanded={() => toggleSection('skills')}
                            />
                            <RankingSection
                                title="Teamwork Rankings"
                                data={teamworkRank}
                                icon={<FaUsers className="text-blue-500" />}
                                scoreField="avg_score"
                                isExpanded={expandedSections.teamwork}
                                toggleExpanded={() => toggleSection('teamwork')}
                            />
                            <div className="lg:col-span-2">
                                <RankingSection
                                    title="Interview Rankings"
                                    data={interviewRank}
                                    icon={<IoPersonOutline className="text-purple-500" />}
                                    scoreField="interview_score"
                                    isExpanded={expandedSections.interview}
                                    toggleExpanded={() => toggleSection('interview')}
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
                                icon={<FaUsers className="text-green-600" />}
                                scoreField="avg_score"
                                isExpanded={expandedSections.coop}
                                toggleExpanded={() => toggleSection('coop')}
                            />
                            <RankingSection
                                title="Skills Rankings"
                                data={skillsRank}
                                icon={<FaStar className="text-yellow-500" />}
                                scoreField="total_score"
                                timeField="skills_time"
                                isExpanded={expandedSections.skills}
                                toggleExpanded={() => toggleSection('skills')}
                            />
                            <div className="lg:col-span-2">
                                <RankingSection
                                    title="Interview Rankings"
                                    data={interviewRank}
                                    icon={<IoPersonOutline className="text-green-600" />}
                                    scoreField="interview_score"
                                    isExpanded={expandedSections.interview}
                                    toggleExpanded={() => toggleSection('interview')}
                                />
                            </div>
                        </>
                    )}

                    {/* VEX 123 Rankings */}
                    {eventCategory === 'vex_123' && (
                        <>
                            <RankingSection
                                title="Game Rankings"
                                data={gameRank}
                                icon={<FaStar className="text-yellow-500" />}
                                scoreField="total_score"
                                timeField="total_time_taken"
                                isExpanded={expandedSections.game}
                                toggleExpanded={() => toggleSection('game')}
                            />
                            <RankingSection
                                title="Interview Rankings"
                                data={interviewRank}
                                icon={<IoPersonOutline className="text-green-600" />}
                                scoreField="interview_score"
                                isExpanded={expandedSections.interview}
                                toggleExpanded={() => toggleSection('interview')}
                            />
                        </>
                    )}

                    {/* Arduino/Flutter/Programming Rankings */}
                    {(eventCategory === 'arduino' || eventCategory === 'flutter' || eventCategory === 'programming') && (
                        <div className="lg:col-span-2">
                            <RankingSection
                                title={`${eventCategory.charAt(0).toUpperCase() + eventCategory.slice(1)} Rankings`}
                                data={gameRank}
                                icon={<FaStar className="text-yellow-500" />}
                                scoreField="score"
                                timeField={gameRank.length > 0 && gameRank[0].total_time ? "total_time" : null}
                                isExpanded={expandedSections.game}
                                toggleExpanded={() => toggleSection('game')}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const RankingSection = ({ title, data, icon, scoreField, timeField, isExpanded, toggleExpanded }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
            <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={toggleExpanded}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        {React.cloneElement(icon, { className: `${icon.props.className} text-xl` })}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        {data.length} teams
                    </span>
                </div>
                <FaChevronDown
                    className={`text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </div>
            
            {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {data.length > 0 ? (
                        data.map((team, index) => (
                            <div key={team.id || index} className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            index < 3 ? 
                                                index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                                                index === 1 ? 'bg-gray-200 text-gray-600' : 
                                                'bg-amber-100 text-amber-600' : 
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                            <span className="font-bold">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {team.name || team.team_name || team.team__name}
                                            </h3>
                                            <div className="text-sm text-gray-500">
                                                Team ID: {team.team || team.id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-800">{team[scoreField]} pts</p>
                                        {timeField && team[timeField] && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Time: <span className="font-medium">{team[timeField]}s</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No ranking data available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};