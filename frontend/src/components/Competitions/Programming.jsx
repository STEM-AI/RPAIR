import React from "react";
import img1 from "../../assets/cards/programmingCover.webp";

import JoinTeams from "../CometitionsComponent/Rules/JoinTeams/JoinTeams";
import Rules from "../CometitionsComponent/Rules/RulesProgramming";

import { Helmet } from "react-helmet-async";
import AwardsList from "../../components/Awards/awards";

const ProgrammingComp = () => {
  // const images = [img1];

  return (
    <>
       <Helmet>
        <title>Programming</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center bg-gray-50  py-12  px-4">
        {/* Section Container */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-start gap-8">
          {/* Text Section */}
          <div className="md:w-2/5">
            <h2 className=" tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
              Programming Competitions
            </h2>

            <p className="text-gray-800 text-lg mb-8 leading-relaxed">
            This coding competition tests your programming skills under time pressure. You'll solve multiple technical problems within a fixed time limit, showing how well you can think logically and solve challenges quickly. The contest evaluates both your knowledge and your ability to work efficiently when time matters most.

Each question checks different programming skills, from basic concepts to more advanced problem-solving. Since time is limited, you'll need to think carefully but also work fast - just like real-world coding situations where speed and accuracy are both important.
            </p>
          </div>

          {/* Gallery Section */}
          <div className="md:w-3/5 flex justify-center">
            <img
              src={img1} // Change this to your desired image
              alt="Programming Competition"
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

export default ProgrammingComp;