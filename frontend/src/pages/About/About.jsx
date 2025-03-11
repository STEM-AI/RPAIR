import React from "react";
import MissionVision from "../../components/AboutComp/Mission/Mission";
// import imageSrc2 from '../../assets/imgs/aboutus/IMG_4376.jpg';
// import imageSrc1 from '../../assets/imgs/aboutus/IMG_3929.jpg';
// import imageSrc3 from '../../assets/imgs/aboutus/IMG_4396.jpg';
// import imageSrc4 from '../../assets/imgs/aboutus/IMG_3937.jpg';
import bgImage from '../../assets/imgs/aboutus/bgleft.png'; 
import CardSlider from "../../components/CardSlider/cardSlider";


function About() {
  return (
    <>
      <section id="about" className="relative bg-white">

        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2, 
          }}
        ></div>

        <div className="gap-8 py-4 px-4 mx-auto max-w-screen-xl flex flex-col lg:grid lg:grid-cols-2 lg:py-16 lg:px-6 relative z-10">
          {/* Text Content */}
          <div className="sm:text-lg mt-4 lg:mt-8">
            <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-3xl md:text-4xl lg:text-5xl font-black">
              About RPAIR
            </h2>
            <h3 className="font-bold mb-4 text-gray-700 relative text-xl md:text-2xl">
              Who We Are
              {/* Line Under "Who" */}
              <span className="absolute bottom-0 left-0 w-12 md:w-16 border-b-4 border-cyan-600"></span>
            </h3>
            <p className="text-gray-600 font-normal text-sm md:text-base">
              The RPAIR Platform is dedicated to driving progress and preparing
              individuals for the future through unique competitions and educational
              initiatives in advanced technology fields. Our platform bridges the gap
              between education and the demands of the digital age, empowering participants
              with the skills and knowledge needed to excel in tomorrow’s workforce. We
              believe in the power of collaboration, creativity, and practical learning
              to inspire a new generation of digital pioneers. By offering a wide range
              of exclusive competitions and hands-on training opportunities, we aim to
              create a vibrant community of learners who are passionate about shaping the future.
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-6 mt-8 lg:mt-0">
            {/* Image 1 */}
            <div className="transition-transform transform rotate-3 duration-300 ease-in-out aspect-square hover:scale-105 hover:rotate-0 relative z-10">
              {/* <img
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src={imageSrc1}
                alt="office content 1"
                loading="lazy"
              /> */}
            </div>

            {/* Image 2 */}
            <div className="transition-transform transform rotate-3 duration-300 ease-in-out aspect-square hover:scale-105 hover:rotate-0 relative z-10">
              {/* <img
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src={imageSrc2}
                alt="office content 2"
                loading="lazy"
              /> */}
            </div>

            {/* Image 3 */}
            <div className="transition-transform transform rotate-3 duration-300 ease-in-out aspect-square hover:scale-105 hover:rotate-0 relative z-10">
              {/* <img
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src={imageSrc3}
                alt="office content 3"
                loading="lazy"
              /> */}
            </div>

            {/* Image 4 */}
            <div className="transition-transform transform rotate-3 duration-300 ease-in-out aspect-square hover:scale-105 hover:rotate-0 relative z-10">
              {/* <img
                className="w-full h-full object-cover rounded-lg shadow-lg"
                src={imageSrc4}
                alt="office content 4"
                loading="lazy"
              /> */}
            </div>
          </div>
        </div>
      </section>
      <MissionVision/>

      <CardSlider/>
    </>
  );
}

export default About;
