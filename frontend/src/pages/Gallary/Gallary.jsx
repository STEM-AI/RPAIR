import React from 'react'
import Vexgo from '../../assets/gallery/Robotics/VexGO/FutureComp/FutureComp-sadat/1W2A9713.jpg'
import VexIQ from '../../assets/gallery/Robotics/VexIQ/NationalComp/IMG_4376.JPG'
import arduino from '../../assets/cards/arduino.jpg'
import web from '../../assets/cards/web.jpeg'

const Gallery = () => {
    return (
      <div className="bg-white  py-6 sm:py-8 lg:py-12">
                <div className="text-center mb-10">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
           OUR GALLERY
          </h2>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
            {[
              { src: Vexgo, alt: "Photo by Minh Pham", label: "VEX GO" },
              { src: VexIQ, alt: "Photo by Magicle", label: "VEX IQ", span: "md:col-span-2" },
              { src: arduino, alt: "Photo by Martin Sanchez", label: "ARDUINO", span: "md:col-span-2" },
              { src:web , alt: "Photo by Lorenzo Herrera", label: "wWEB DESIGN" }
            ].map((item, index) => (
              <a key={index} href="#" className={`group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80 ${item.span || ''}`}>
                <img src={item.src} loading="lazy" alt={item.alt} className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Gallery;
  