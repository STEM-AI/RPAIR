
import React from "react";
import { useNavigate } from "react-router-dom";

const ListCompetitions = () => {
  const navigate = useNavigate();

  const competitions = [
    { name: "VEX IQ", apiName: "vex_iq" },
    { name: "Mobile App", apiName: "mobile_app" },
    { name: "Web Development", apiName: "web_development" },
    { name: "Python Programming", apiName: "python_programming" },
    { name: "Robotics", apiName: "robotics" },
    { name: "AI & ML", apiName: "ai_ml" },
    { name: "Game Development", apiName: "game_development" },
  ];

  const handleCompetitionClick = (apiName) => {
    navigate(`/Dashboard/Admin/Competitions/${apiName}`);
    console.log(apiName);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 text-5xl font-black">
        ALL COMPETITIONS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition.apiName}
            onClick={() => handleCompetitionClick(competition.apiName)}
            className="cursor-pointer bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {competition.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                API Name: {competition.apiName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCompetitions;
