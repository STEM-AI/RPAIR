import React from 'react'
import Vexgo from '../../assets/imgs/vexComp/vexiq.jpg'
import VexIQ from '../../assets/imgs/vexComp/vexgo.jpg'
import arduino from '../../assets/imgs/vexComp/arduino.jpg'
import web from '../../assets/imgs/vexComp/web.jpeg'

const Gallery = () => {
    return (
      <div className="bg-white h-screen  py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
            <div className="flex items-center gap-12">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">Gallery</h2>
              <p className="hidden max-w-screen-sm text-gray-500 dark:text-gray-300 md:block">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget est eget nunc luctus.
              </p>
            </div>
            <a href="#" className="inline-block rounded-lg border bg-white dark:bg-gray-700 dark:border-none px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base">
              More
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
            {[
              { src: Vexgo, alt: "Photo by Minh Pham", label: "VEX IQ" },
              { src: VexIQ, alt: "Photo by Magicle", label: "VEX GO", span: "md:col-span-2" },
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
  