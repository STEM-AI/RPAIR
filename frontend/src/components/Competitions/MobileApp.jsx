import React from "react";
import img1 from "../../assets/cards/mobile.jpg";

import JoinTeams from "../CometitionsComponent/Rules/JoinTeams/JoinTeams";
import Rules from "../CometitionsComponent/Rules/RulesMobileApp";
import FlutterAwardsList from "../Awards/FlutterAwards";
import { Helmet } from "react-helmet-async";
const MobileApp = () => {
  return (
    <>
      <Helmet>
        <title>MobileApp</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center bg-gray-50  py-12  px-4">
        {/* Section Container */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-start gap-8">
          {/* Text Section */}
          <div className="md:w-2/5">
            <h2 className=" tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
              MobileApp Competitions
            </h2>

            <p className="text-gray-800 text-lg mb-8 leading-relaxed">
              The Mobile App Competition aims to inspire creativity and hands-on learning
              through the development of interactive mobile applications.
              Participants will work in teams to design and build their apps using
              standardized tools and technologies, and present demonstrations showcasing
              their app's functionality. The competition is divided into levels based on age group,
              with increasing complexity and logic requirements.
            </p>
          </div>

          <div className="md:w-3/5 flex justify-center">
            <img
              src={img1} 
              alt="Mobile App Competition"
              className="w-[800px] h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <Rules />
      <FlutterAwardsList />
      <JoinTeams />
    </>
  );
};

export default MobileApp;
