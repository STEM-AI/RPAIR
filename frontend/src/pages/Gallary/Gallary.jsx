import React from 'react'
import Robotics from '../../assets/gallery/Robotics/VexIQ/NationalComp/12.JPG'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const Gallery = () => {
  const galleryItems = [
    { 
      src: Robotics, 
      alt: "Robotics team during competition", 
      label: "Robotics Competition",
      path: '/gallery/Robotics',
      featured: true
    },
    { 
      src: '', 
      alt: "Team training session", 
      label: "Training Sessions",
      path: '/gallery/training'
    },
    { 
      src: "", 
      alt: "Award ceremony", 
      label: "Awards Ceremony",
      path: '/gallery/awards'
    },
  ];

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <Helmet>
        <title>Our Gallery</title>
      </Helmet>
      
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-teal-500 mb-4">
          Our Gallery
        </h2>
        <p className="text-gray-700 md:text-lg/relaxed max-w-2xl mx-auto">
          Discover our journey through key moments
        </p>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {galleryItems.map((item, index) => (
            <div 
              key={index}
              className={`
                relative group overflow-hidden rounded-2xl shadow-lg 
                hover:shadow-xl transition-all duration-300 ease-out 
                ${item.featured ? 
                  "lg:col-span-2 lg:row-span-2 lg:h-[600px]" : 
                  "h-[300px] hover:-translate-y-1"
                }`
              }
            >
              <div className={`w-full h-full bg-gray-100 ${!item.featured && "aspect-[3/2]"}`}>
                <img 
                  src={item.src} 
                  loading="lazy"
                  alt={item.alt}
                  className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-102"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 flex items-end p-5">
                <h3 className="text-white text-xl font-semibold drop-shadow-2xl tracking-wide">
                  {item.label}
                </h3>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm">
                <Link 
                  to={item.path} 
                  className="px-8 py-2.5 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors transform translate-y-2 group-hover:translate-y-0 shadow-md hover:shadow-lg"
                >
                  View More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;