

import React from "react";
import { useNavigate } from "react-router-dom";
import robotics from "../../../assets/imgs/vexComp/robot.jpg";
import AI from "../../../assets/imgs/vexComp/AI.jpg";
import mobile from "../../../assets/imgs/vexComp/mobile.jpg";
import OpenSource from "../../../assets/imgs/vexComp/open.jpg";
import Web from "../../../assets/imgs/vexComp/web.jpeg";
import programming from "../../../assets/imgs/vexComp/programming.webp";
import fablab from "../../../assets/imgs/vexComp/OIP.jpeg";
import graphic from "../../../assets/imgs/vexComp/graphic.jpeg";
import math from "../../../assets/imgs/vexComp/ST-math.jpeg";

const ListCompetitions = () => {
  const navigate = useNavigate();

  const competitions = [
    { name: "Robotics ", apiName: "robotics", image: robotics },
    { name: "Open Source", apiName: "OpenSource", image: OpenSource },
    { name: "Web Design", apiName: "web_development", image: Web },
    { name: "Programming", apiName: "python_programming", image: programming },
    { name: "Artificial Intelligence", apiName: "ai_ml", image: AI },
    { name: "Mobile Application", apiName: "mobile_development", image: mobile},
    { name: "FabLab competitions", apiName: "fabLab", image: fablab },
    { name: "Graphic Design competitions", apiName: "graphic_design", image: graphic },
    { name: "ST egy Math competitions", apiName: "ST-math", image: math },
  ];

  const handleCompetitionClick = (apiName) => {
    console.log("Navigating to:", `/Dashboard/Competitions/${apiName}`);
    navigate(`/Dashboard/Competitions/${apiName}`);
  };

    return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 pt-4 pb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-3xl sm:text-4xl md:text-5xl font-black">
        ALL COMPETITIONS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition.apiName}
            onClick={() => handleCompetitionClick(competition.apiName)}
            className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              className="h-56 sm:h-64 w-full object-cover"
              src={competition.image}
              alt={competition.name}
            />
            <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center">
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
