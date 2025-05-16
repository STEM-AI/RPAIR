import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { HashLink } from 'react-router-hash-link';
import { useLoading } from '../../../context/LoadingContext';
import { useParams } from 'react-router-dom'; 


const RoboticsGallery = () => {
const { VexType } = useParams(); // استخدام اسم بارامتر متوافق مع المسارات
  const { setIsLoading } = useLoading();
  const [expandedFolders, setExpandedFolders] = useState({});
  const [activeFolder, setActiveFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState({
    src: null,
    index: null,
    folder: null
  });

  const events = useMemo(() => {
    const eventTitles = {
      VexIQ: "Vex IQ Robotics Championship",
      Vex123: "Vex 123 Robotics Championship",
      VexGO: "Vex GO Robotics Championship",
      VexV5: "Vex V5 Robotics Championship"
    };

    const subEvents = {
      VexIQ: ["FutureComp-sadat", "MiniEvent-DSA", "NationalComp"],
      Vex123: ["FutureComp-sadat" ,"MiniEvent-Elsadat"],
      VexGo: ["FutureComp-sadat"], 
      // VexV5: [] 
    };

    return [{
      folderName: VexType,
      title: eventTitles[VexType],
      subEvents: subEvents[VexType].map(folder => ({ folder }))
    }];
  }, [VexType]);

  const contextMap = useMemo(() => ({
  Vex123: require.context('../../../assets/gallery/Robotics/Vex123/', true, /\.(jpe?g|png|JPG|PNG)$/i),
  VexGo: require.context('../../../assets/gallery/Robotics/VexGO/', true, /\.(jpe?g|png|JPG|PNG)$/i), 
  VexIQ: require.context('../../../assets/gallery/Robotics/VexIQ/', true, /\.(jpe?g|png|JPG|PNG)$/i),
  // VexV5: require.context('../../../assets/gallery/Robotics/VexV5/', true, /\.(jpe?g|png|JPG|PNG)$/i),
}), []);

const imageContext = useMemo(() => contextMap[VexType], [VexType]);
    const getEventImages = useCallback((folderName) => {
    setIsLoading(true); // بدء التحميل
    try {
      const images = imageContext.keys()
        .filter(path => path.split('/')[1] === folderName)
        .sort((a, b) => {
          const getNum = str => parseInt(str.match(/(\d+)\./)[1], 10);
          return getNum(a) - getNum(b);
        })
        .map(imageContext);
      setIsLoading(false); // إيقاف التحميل عند النجاح
      return images;
    } catch (error) {
      console.error('Error loading images:', error);
      setIsLoading(false); // إيقاف التحميل في حالة الخطأ
      return [];
    }
  }, [imageContext, setIsLoading]);

  const toggleFolderExpansion = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const targetFolder = events[0].subEvents.find(
      sub => sub.folder.toLowerCase() === hash.toLowerCase()
    );
    if (targetFolder) {
      setActiveFolder(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage.src) {
        if (e.key === 'Escape') {
          setSelectedImage({ src: null, index: null, folder: null });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage.src]);

  const ImageCard = ({ img, folderName, index }) => (
    <div 
      className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer"
      onClick={() => setSelectedImage({ src: img, index, folder: folderName })}
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={img}
          alt={`${folderName} competition - ${index + 1}`}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
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

  const EventNavigation = ({ subEvents }) => (
    <div className="flex flex-wrap gap-3 mb-8">
      {subEvents.map((subEvent) => (
        <HashLink
          key={subEvent.folder}
          to={`#${subEvent.folder}`}
          smooth
          className={`px-6 py-3 rounded-xl transition-all duration-300 ${
            activeFolder === subEvent.folder 
              ? 'bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-lg'
              : 'bg-white border-2 border-gray-200 hover:border-cyan-300 hover:shadow-md'
          }`}
          onClick={() => setActiveFolder(subEvent.folder)}
        >
          <span className="font-medium text-sm md:text-base">
            {subEvent.folder}
          </span>
        </HashLink>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 sm:py-12 lg:py-16">
      <Helmet>
        <title>Gallary-Robotics</title>
      </Helmet>

      {/* Lightbox Modal */}
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
            
            <img
              src={selectedImage.src}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-lg">
              {selectedImage.src.split('/').pop()}
            </div>
          </div>
        </div>
      )}

      <header className="text-center mb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-cyan-400 mb-4 animate-fade-in-down">
            ROBOTICS CHALLENGE
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-3xl mx-auto">
            Witness Innovation in Motion - Where Future Engineers Shine
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8">
        {events.map((event) => (
          <section key={event.title} className="mb-20 last:mb-0">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {event.title}
                </h2>
              </div>
            </div>

            <EventNavigation subEvents={event.subEvents} />

            {event.subEvents.map((subEvent) => {
              const images = getEventImages(subEvent.folder);
              return (
                <div 
                  key={subEvent.folder}
                  id={subEvent.folder}
                  className="mb-16 scroll-mt-24"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-8 bg-cyan-500 rounded-full" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        {subEvent.folder}
                      </h3>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {images.length} Captured Moments
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images
                      .slice(0, expandedFolders[subEvent.folder] ? images.length : 3)
                      .map((img, idx) => (
                        <ImageCard 
                          key={idx}
                          img={img}
                          folderName={subEvent.folder}
                          index={idx}
                        />
                      ))}
                  </div>

                  {images.length > 3 && (
                    <div className="mt-10 text-center">
                      <button 
                        onClick={() => toggleFolderExpansion(subEvent.folder)}
                        className="px-8 py-3 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                      >
                        {expandedFolders[subEvent.folder] ? (
                          <>
                            <span>Show Less</span>
                            <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>View Full Gallery</span>
                            <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </main>
    </div>
  );
};

export default RoboticsGallery ;