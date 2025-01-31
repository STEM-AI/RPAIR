
import React from "react";
import { useNavigate } from "react-router-dom";
import VexIq from "../../../../assets/imgs/vexComp/vexiq.jpg";
import AI from "../../../../assets/imgs/vexComp/AI.jpg";
import aurdoino from "../../../../assets/imgs/vexComp/aurdoino.jpg";
import mobile from "../../../../assets/imgs/vexComp/mobile.jpg";
import OpenSource from "../../../../assets/imgs/vexComp/open.jpg";
import Web from "../../../../assets/imgs/vexComp/web.webp";
import programming from "../../../../assets/imgs/vexComp/programming.webp";

const ListCompetitions = () => {
  const navigate = useNavigate();

  const competitions = [
    { name: "VEX ", apiName: "vex_iq", image: VexIq },
    { name: "Open Source", apiName: "mobile_app", image: OpenSource },
    { name: "Web Design", apiName: "web_development", image: Web },
    { name: "Programming", apiName: "python_programming", image: programming },
    { name: "Aurdoino", apiName: "robotics", image: aurdoino },
    { name: "Artificial Intelligence", apiName: "ai_ml", image: AI },
    { name: "Mobile Application", apiName: "game_development", image: mobile},
  ];

  const handleCompetitionClick = (apiName) => {
    console.log("Navigating to:", `/Dashboard/Admin/Competitions/${apiName}`);
    navigate(`/Dashboard/Admin/Competitions/${apiName}`);
  };

  return (
    <div className="container mx-auto mt-24 p-4">
      <h2 className="mb-4 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-cyan-500 text-5xl font-black">
        ALL COMPETITIONS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition.apiName}
            onClick={() => handleCompetitionClick(competition.apiName)}
            className="relative max-w-xl mx-auto mt-20 cursor-pointer"
          >
            <img
              className="h-64 w-full object-cover rounded-md"
              src={competition.image}
              alt={competition.name}
            />
            <div className="absolute inset-0 bg-gray-700 opacity-60 rounded-md"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold">
                {competition.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCompetitions;
