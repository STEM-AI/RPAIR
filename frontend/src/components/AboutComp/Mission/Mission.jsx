

import React from "react";
import { TbTargetArrow } from "react-icons/tb";
import { PiBinocularsBold } from "react-icons/pi";
import bgImage from "../../../assets/Static/bg.png"; 

const MissionVision = () => {
  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }}
    >
      {/* Overlay to darken background for better readability */}
      <div className="absolute inset-0  bg-opacity-50 z-0"></div>

      <div className="relative z-10 w-full max-w-6xl px-4 py-10">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
            MISSION AND VISION
          </h2>
        </div>

        {/* Vision Section */}
        <div className="bg-gray-50 shadow-lg rounded-lg flex items-center p-8 w-full mb-12 border-l-8 border-cyan-500 transition-transform transform hover:translate-x-4 duration-300">
          <div className="bg-cyan-500 rounded-md w-20 h-20 flex items-center justify-center mr-6">
            <PiBinocularsBold className="text-white text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-cyan-900">Vision</h2>
            <p className="text-gray-700 mt-3">
              Innovation in organizing competitions that prepare participants for future jobs.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-50 shadow-lg rounded-lg flex items-center p-8 w-full ml-auto border-r-8 border-teal-500 transition-transform transform hover:-translate-x-4 duration-300">
          <div>
            <h2 className="text-2xl font-semibold text-teal-900">Mission</h2>
            <p className="text-gray-700 mt-3">
              Achieving innovation and leadership in establishing a national digital generation equipped with the latest sciences in Programming, Robotics, and Artificial Intelligence competitions.
            </p>
          </div>
          <div className="bg-teal-500 rounded-md w-20 h-20 flex items-center justify-center ml-6">
            <TbTargetArrow className="text-white text-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
