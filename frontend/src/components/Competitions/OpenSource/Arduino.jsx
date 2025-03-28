
import React from "react";
import img1 from "../../../assets/cards/arduinoCO.webp";

import Rules from "../../../components/CometitionsComponent/Rules/RulesArduino";
import JoinTeams from "../../../components/CometitionsComponent/Rules/JoinTeams/JoinTeams";
import AwardsList from "../../../components/Awards/awardsArduino";
import { Helmet } from "react-helmet-async";
const Arduino = () => {
  const images = [img1];

  return (
    <>
       <Helmet>
        <title>Arduino</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center bg-gray-50  py-12  px-4">
        {/* Section Container */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-start gap-8">
          {/* Text Section */}
          <div className="md:w-2/5">
            <h2 className=" tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
              Arduino Competitions
            </h2>

            <p className="text-gray-800 text-lg mb-8 leading-relaxed">
                          The Arduino competition is designed to inspire creativity and hands-on learning through Arduino-based electronics projects.
                          Participants will work in teams using a standardized kit of components to build and present interactive projects.
                          The competition is divided into two levels based on age group, with increasing complexity and logic requirements
            </p>
          </div>

          {/* Gallery Section */}
          <div className="md:w-3/5 flex justify-center">
            <img
              src={img1} // Change this to your desired image
              alt="VEX IQ Competition"
              className="w-[800px] h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <Rules />
      <AwardsList />
      <JoinTeams />
    </>
  );
};

export default Arduino;
