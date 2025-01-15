import React, { useEffect }  from "react";
import CardSlider from '../CardSlider/cardSlider';
import { Carousel, Ripple, initTWE } from "tw-elements";
import { NavLink } from "react-router-dom";
import vi from "../../assets/videos/heroVideo.mp4"

const Home = () => {
  useEffect(() => {
    // Initialize TW Elements
    initTWE({ Carousel, Ripple });
  }, []);

  return (
    <>
      <div></div>
      <div id="home-section">
        
      <div
        id="carouselExampleCaptionsFull"
        className="relative"
        data-twe-carousel-init
        data-twe-ride="carousel"
      >
        <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
          <div
            className="relative float-left -mr-[100%] w-full !transform-none bg-cover bg-center bg-no-repeat opacity-100 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
            data-twe-carousel-fade
            data-twe-carousel-item
            data-twe-carousel-active
          >

                  {/* <img
        className="h-screen w-full object-cover"
        src="https://your-online-image-link.com/your-image.jpg"
        alt="Hero Background"
      /> */}<video
            className="h-screen w-full object-cover"
            playsInline
            autoPlay
            muted
            loop
          >
            <source
              src={vi}
              type="video/mp4"
            />
        </video>
            <div
              className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black opacity-60"
            />
          </div>


          <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full flex items-center justify-center px-14 text-center text-white">
            <div className="animate__animated animate__fadeIn">
              <h2 className="mb-4 text-5xl font-bold text-cyan-500 hover:text-cyan-200 transition duration-500 ease-in-out">
                Ultimate Competition RPAIR for Aspiring Innovators
              </h2>
              <h5 className="mb-6 text-xl font-semibold text-gray-300">
                Join us for an exciting challenge in robotics, programming, and technology. Showcase your skills in VEX Robotics, coding, and innovation, and compete for prizes and recognition.
              </h5>



          <div className="md:space-x-2">
            <NavLink
              className="inline-block border-2 border-cyan-600 px-8 py-4 text-lg font-semibold uppercase leading-tight text-cyan-300 bg-transparent transition-all duration-300 ease-in-out transform hover:bg-cyan-600 hover:text-white hover:scale-105 hover:opacity-80 focus:outline-none focus:ring-0 shadow-lg hover:shadow-2xl hover:animate-bounce"
              to="/register"
              role="button"
            >
              Get Started
            </NavLink>
          </div>


              
            </div>
          </div>
        </div>
        </div>

      </div>
      <CardSlider/>




    </>
  );
};

export default Home;

