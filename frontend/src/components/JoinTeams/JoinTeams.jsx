

import React from 'react';
import img from '../../assets/imgs/aboutus/IMG_4376.JPG';

const JoinTeams = () => {
  return (
    <>
    <div className="">
    <div className="relative flex flex-col items-center mx-auto lg:flex-row lg:max-w-5xl lg:mt-12 xl:max-w-6xl mb-24">

      {/* Image Column */}
      <div className="w-full h-64 lg:w-1/2 lg:h-auto">
        <img
          className="h-full w-full object-cover"
          src={img}
          alt="Winding mountain road"
        />
      </div>

      {/* Text Column */}
      <div className="max-w-lg bg-gray-50 md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:right-0 lg:mt-20 lg:mr-20 xl:mt-24 xl:mr-12">

        {/* Text Wrapper */}
        <div className="flex flex-col p-12 md:px-16">
        <h3 className="mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-teal-500 text-5xl font-black">
        Join Now!
            </h3>
          <p className="mt-1 font-normal text-xl text-gray-700">
          Dream big, work together, and achieve greatness! At <span className='font-bold  bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-teal-500 text-xl'>RPAIR</span> , we believe that teams can solve the toughest challenges—join now and bring your ideas to life with the support of like-minded changemakers!
          </p>

          {/* Button Container */}
          <div className="mt-8">
            <a
              href="#"
              className="flex py-2 w-full text-center text-lg font-medium text-gray-100 hover:bg-cyan-600 bg-cyan-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center  hover:shadow-md md:w-48"
            >
               REGISTER A TEAM
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default JoinTeams;
