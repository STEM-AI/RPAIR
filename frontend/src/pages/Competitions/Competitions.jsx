 import React from "react";
import img1 from "../../assets/imgs/aboutus/IMG_3964.JPG";
import img2 from "../../assets/imgs/aboutus/IMG_3937.JPG";
import img3 from "../../assets/imgs/aboutus/IMG_3888.JPG";
import img4 from "../../assets/imgs/aboutus/IMG_3929.JPG";
import img5 from "../../assets/imgs/aboutus/IMG_3876.JPG";
import img6 from "../../assets/imgs/aboutus/IMG_4353.JPG";
import img7 from "../../assets/imgs/aboutus/IMG_4344.JPG";
import img8 from "../../assets/imgs/aboutus/IMG_3929.JPG";
import img9 from "../../assets/imgs/aboutus/IMG_3929.JPG";
import Rules from "../../components/Rules/Rules";

const Competitions = () => {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  return (
    <>
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-8 px-4">
      {/* Section Container */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-start gap-8">
        {/* Text Section */}
        <div className="md:w-2/5">
        <h2 className="mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-teal-500 text-5xl font-black">
        VEX IQ Competitions
            </h2>
          
          <p className="text-gray-800 text-lg mb-8 leading-relaxed">
          The VEX Robotics Competition attracts thousands of students from around the world, providing hands-on experience in STEM fields. With over 25,000 teams participating annually, the event serves as a hub of innovation and collaboration. Teams compete in various events, showcasing their robots' capabilities in different challenges.
VEX Robotics holds the distinction of being the largest robotics competition globally, as recognized by the Guinness Book of World Records. Organized by the Foundation for Robotics Education and Competition, this program challenges student teams to design and build robots to compete against one another in an engineering-based game.

          </p>

        </div>

        {/* Gallery Section */}
        <div className="md:w-3/5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg ${
                index % 2 === 0 ? "row-span-2" : "row-span-1"
              }`}
            >
              <img
                src={src}
                alt={`Gallery item ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    <Rules/>
    </>

  );
};

export default Competitions;
