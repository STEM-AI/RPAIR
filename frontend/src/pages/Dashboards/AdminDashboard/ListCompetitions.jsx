import React from "react";
import { useNavigate } from "react-router-dom";
import robotics from "../../../assets/cards/robot.jpg";
import AI from "../../../assets/cards/AI.jpg";
import mobile from "../../../assets/cards/mobile.jpg";
import OpenSource from "../../../assets/cards/open.jpg";
import Web from "../../../assets/cards/web.jpeg";
import programming from "../../../assets/cards/programming.webp";
import fablab from "../../../assets/cards/OIP.jpeg";
import graphic from "../../../assets/cards/graphic.jpeg";
import math from "../../../assets/cards/STMATH.png";

const ListCompetitions = () => {
  const navigate = useNavigate();

  const competitions = [
    { name: "Robotics ", apiName: "robotics", image: robotics },
    { name: "Open Source", apiName: "OpenSource", image: OpenSource },
    { name: "Web Design", apiName: "web_development", image: Web },
    { name: "Programming", apiName: "programming", image: programming },
    { name: "Artificial Intelligence", apiName: "ai_ml", image: AI },
    { name: "Mobile Application", apiName: "mobile_development", image: mobile},
    { name: "FabLab competitions", apiName: "fabLab", image: fablab },
    { name: "Graphic Design competitions", apiName: "graphic_design", image: graphic },
    { name: "ST egy Math competitions", apiName: "ST-math", image: math },
  ];

  const handleCompetitionClick = (apiName) => {
    // console.log("Navigating to:", `/Dashboard/Competitions/${apiName}`);
    navigate(`/Dashboard/Competitions/${apiName}`);
  };

    return (
    <div className="px-4 sm:px-6 lg:px-8">
     
          <h2 className="mb-12 text-center">
        <span className="md:text-5xl text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
          ALL COMPETITIONS
        </span>
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
