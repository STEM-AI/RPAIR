import React from "react";
import img1 from "../../../assets/gallery/Robotics/VexIQ/MiniEvent-DSA/IMG_1974.JPG";

import Rules from "../../../components/CometitionsComponent/Rules/RulesIQ";
import JoinTeams from "../../../components/CometitionsComponent/Rules/JoinTeams/JoinTeams";
import AwardsList from "../../../components/Awards/awards";
import { Helmet } from "react-helmet-async";

const VexV5About = () => {
  const images = [img1];

  return (
    <>
        <Helmet>
        <title>VEX V5</title>
      </Helmet>
    <div className="flex flex-col items-center justify-center bg-gray-50  py-12  px-4">
      {/* Section Container */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-start gap-8">
        {/* Text Section */}
        <div className="md:w-2/5">
        <h2 className=" tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
        VEX V5 Competitions
            </h2>
          
          <p className="text-gray-800 text-lg mb-8 leading-relaxed">
          The VEX Robotics Competition attracts thousands of students from around the world, providing hands-on experience in STEM fields. With over 25,000 teams participating annually, the event serves as a hub of innovation and collaboration. Teams compete in various events, showcasing their robots' capabilities in different challenges.
          VEX Robotics holds the distinction of being the largest robotics competition globally, as recognized by the Guinness Book of World Records. Organized by the Foundation for Robotics Education and Competition, this program challenges student teams to design and build robots to compete against one another in an engineering-based game.

          </p>

        </div>

        {/* Gallery Section */}
<div className="md:w-3/5 flex justify-center">
<img
  src={img1}  // Change this to your desired image
  alt="VEX IQ Competition"
  className="w-[800px] h-[400px] object-cover rounded-lg shadow-lg"
/>
</div>





      </div>
    </div>
    <Rules/>
    <AwardsList/>
    <JoinTeams/>
    </>

  );
};

export default VexV5About;