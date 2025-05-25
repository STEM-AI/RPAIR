import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { HashLink } from 'react-router-hash-link';
import { useLoading } from '../../../context/LoadingContext';
import { useParams } from 'react-router-dom';

const RoboticsGallery = () => {
  const { VexType } = useParams();
  const { setIsLoading } = useLoading();
  const [expandedFolders, setExpandedFolders] = useState({});
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState({
    src: null,
    index: null,
    folder: null
  });

  // Memoized data structures
  const events = useMemo(() => ({
    eventTitles: {
      VexIQ: "Vex IQ Robotics Championship",
      Vex123: "Vex 123 Robotics Championship",
      VexGO: "Vex GO Robotics Championship",
      VexV5: "Vex V5 Robotics Championship"
    },
    subEvents: {
      VexIQ: ["FutureComp-sadat", "MiniEvent-DSA", "NationalComp","MiniEvent-Elsadat"],
      Vex123: ["FutureComp-sadat" ,"MiniEvent-Elsadat"],
      VexGO: ["FutureComp-sadat","MiniEvent-Elsadat"],
    }
  }), []);

  const contextMap = useMemo(() => ({
    Vex123: require.context('../../../assets/gallery/Robotics/Vex123/', true, /\.(jpe?g|png|JPG|PNG|CR2)$/i),
    VexGO: require.context('../../../assets/gallery/Robotics/VexGO/', true, /\.(jpe?g|png|JPG|PNG|CR2)$/i), 
    VexIQ: require.context('../../../assets/gallery/Robotics/VexIQ/', true, /\.(jpe?g|png|JPG|PNG|CR2)$/i),
  }), []);

  // Image handling
  const imageContext = useMemo(() => contextMap[VexType], [VexType]);
  const getEventImages = useCallback((folderName) => {
    setIsLoading(true);
    try {
      const images = imageContext.keys()
        .filter(path => path.split('/')[1] === folderName)
        .sort((a, b) => parseInt(a.match(/(\d+)\./)[1], 10) - parseInt(b.match(/(\d+)\./)[1], 10))
        .map(imageContext);
      setIsLoading(false);
      return images;
    } catch (error) {
      console.error('Error loading images:', error);
      setIsLoading(false);
      return [];
    }
  }, [imageContext, setIsLoading]);

  // Interactive elements
  const toggleFolderExpansion = (folderName) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const navigateImage = (direction) => {
    const currentImages = getEventImages(selectedImage.folder);
    const newIndex = (selectedImage.index + direction + currentImages.length) % currentImages.length;
    setSelectedImage(prev => ({
      ...prev,
      src: currentImages[newIndex],
      index: newIndex
    }));
  };

  // Enhanced Image Card Component
  const ImageCard = ({ img, folderName, index }) => (
    <div 
      role="button"
      aria-label={`View ${folderName} image ${index + 1}`}
      className="group relative bg-white  rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer"
      onClick={() => setSelectedImage({ src: img, index, folder: folderName })}
      onKeyPress={(e) => e.key === 'Enter' && setSelectedImage({ src: img, index, folder: folderName })}
      tabIndex="0"
    >
      <div className="aspect-[4/3] bg-gray-100  overflow-hidden">
        <img
          src={img}
          alt={`${folderName} competition - ${index + 1}`}
          width={400}
          height={300}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white">
          <h3 className="font-semibold text-lg mb-2">{folderName}</h3>
          <p className="text-sm opacity-90">Photo #{index + 1}</p>
        </div>
      </div>
    </div>
  );

  // Enhanced Event Navigation
  const EventNavigation = ({ subEvents }) => (
    <div className="flex flex-wrap gap-3 mb-8">
      {subEvents.map((subEvent) => (
        <HashLink
          key={subEvent.folder}
          to={`#${subEvent.folder}`}
          smooth
          className={`px-6 py-3 rounded-full transition-all duration-300 ${
            activeFolder === subEvent.folder 
              ? 'bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-lg scale-105'
              : 'bg-white  border-2 border-gray-200  hover:border-cyan-300 hover:shadow-md hover:scale-[1.02]'
          }`}
          onClick={() => setActiveFolder(subEvent.folder)}
        >
          <span className="font-medium text-sm md:text-base ">
            {subEvent.folder}
          </span>
        </HashLink>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50   py-8 sm:py-12 lg:py-16">
      <Helmet>
        <title>Gallary-Robotics</title>
      </Helmet>

      {/* Enhanced Lightbox Modal */}
      {selectedImage.src && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage({ src: null, index: null, folder: null })}
        >
          <div className="relative max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-8 right-0 text-white hover:text-cyan-400 transition-colors z-50"
              onClick={() => setSelectedImage({ src: null, index: null, folder: null })}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between z-50">
              <button 
                className="text-white hover:text-cyan-400"
                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="text-white hover:text-cyan-400"
                onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <img
              src={selectedImage.src}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-lg">
              {selectedImage.index + 1} / {getEventImages(selectedImage.folder).length}
            </div>
          </div>
        </div>
      )}

      <header className="text-center mb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-cyan-400 mb-4 drop-shadow-md ">
            ROBOTICS CHALLENGE
          </h1>
          <p className="text-lg md:text-xl text-gray-600  font-medium max-w-3xl mx-auto">
            Witness Innovation in Motion - Where Future Engineers Shine
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8">
        {events.subEvents[VexType]?.map((subEvent) => {
          const images = getEventImages(subEvent);
          return (
            <section key={subEvent} className="mb-20 last:mb-0">
              <div 
                id={subEvent}
                className="mb-16 scroll-mt-24"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-8 bg-cyan-500 rounded-full" />
                    <h3 className="text-2xl font-bold text-gray-900 ">
                      {subEvent}
                    </h3>
                  </div>
                  <span className="text-gray-500  font-medium">
                    {images.length} Captured Moments
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {images.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500 ">
                      <p className="text-xl">No images available for this event</p>
                    </div>
                  ) : (
                    images
                      .slice(0, expandedFolders[subEvent] ? images.length : 3)
                      .map((img, idx) => (
                        <ImageCard 
                          key={idx}
                          img={img}
                          folderName={subEvent}
                          index={idx}
                        />
                      ))
                  )}
                </div>

                {images.length > 3 && (
                  <div className="mt-10 text-center">
                    <button 
                      onClick={() => toggleFolderExpansion(subEvent)}
                      className="px-8 py-3 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto hover:scale-[1.02]"
                    >
                      {expandedFolders[subEvent] ? (
                        <>
                          <span>Show Less</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>View Full Gallery</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default RoboticsGallery;