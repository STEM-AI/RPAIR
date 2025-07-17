import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import flutterlogo from '../../assets/cards/flutterpng.png';
import arduinologo from '../../assets/cards/arduinoLogo.png';
import flutterimg from '../../assets/cards/mobile.jpg';
import arduino from '../../assets/cards/arduino.jpg';
import vexGoLogo from '../../assets/cards/vex-go-logo.webp';
import vexGo from '../../assets/cards/vex-go.webp';
import vexIqLogo from '../../assets/cards/vex-iq-logo.webp';
import vexIq from '../../assets/cards/vexiq.webp';
import vex123 from '../../assets/cards/vex-123.png';
import vex123Logo from '../../assets/cards/vex-123-logo.webp';
import programmingImg from '../../../src/assets/gallery/Programming/logos/image.png';
import programmingLogo from '../../../src/assets/gallery/Programming/logos/programming-logo.png'; 
import { Helmet } from 'react-helmet-async';

function LiveEvents() {
  const [competitions, setCompetitions] = useState([ ]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/event/live-event-list/`);
        const data = await response.json();
        
        // Map the API data to our UI format
        const formattedData = data.map(event => {
          let eventConfig = {
            id: event.id,
            name: event.name,
            date: event.start_date,
            time: new Date(event.start_date).toLocaleTimeString(),
            location: event.location,
            type: event.competition_name
          };

          // Configure UI elements based on competition type
          switch(event.competition_name) {
            case 'vex_iq':
              eventConfig = {
                ...eventConfig,
                image: vexIq,
                logo: vexIqLogo,
                link: '/LiveMatch/VexIq',
                bgColor: 'from-blue-500 to-indigo-600',
                textColor: 'text-white',
                accentColor: 'bg-blue-400'
              };
              break;
            case 'vex_go':
              eventConfig = {
                ...eventConfig,
                image: vexGo,
                logo: vexGoLogo,
                link: '/LiveMatch/Vexgo',
                bgColor: 'from-teal-500 to-emerald-600',
                textColor: 'text-white',
                accentColor: 'bg-teal-400'
              };
              break;
            case 'vex_123':
              eventConfig = {
                ...eventConfig,
                image: vex123,
                logo: vex123Logo,
                link: '/LiveVex123',
                bgColor: 'from-purple-500 to-violet-600',
                textColor: 'text-white',
                accentColor: 'bg-purple-400'
              };
              break;
              case 'arduino':
                eventConfig = {
                  ...eventConfig,
                  image: arduino,
                  logo: arduinologo,
                  link: '/LiveFile',
                  bgColor: 'from-cyan-600 to-teal-800',
                  textColor: 'text-white',
                  accentColor: 'bg-teal-400'
                };
                break;  
              case 'flutter':
                eventConfig = {
                  ...eventConfig,
                  image: flutterimg,
                  logo: flutterlogo,
                  link: '/LiveFile',
                  bgColor: 'from-cyan-500 to-blue-600',
                  textColor: 'text-white',
                  accentColor: 'bg-cyan-400'
                };
                break;
            default:
              eventConfig = {
                ...eventConfig,
                image: programmingImg,
                logo: programmingLogo,
                link: '/LiveProgramming',
                bgColor: 'from-amber-500 to-orange-600',
                textColor: 'text-white',
                accentColor: 'bg-amber-400'
              };
          }
          return eventConfig;
        });

        setCompetitions(formattedData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  if (competitions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="px-6 py-16 bg-gradient-to-b from-gray-50 to-gray-100">
       <Helmet>
                  <title>Live-Competitions</title>
            </Helmet>
      <motion.h2 
        className="mb-12 text-center text-5xl font-extrabold text-cyan-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block mr-2">🚀</span> 
        Live Competitions 
        <span className="inline-block ml-2">⚡</span>
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {competitions.map((comp, index) => (
          <motion.div
            key={comp.id}
            className={`relative overflow-hidden rounded-3xl shadow-2xl group ${comp.textColor}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.15,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ y: -10 }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${comp.bgColor}`}></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className={`absolute rounded-full ${comp.accentColor}`}
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3
                  }}
                ></div>
              ))}
            </div>
            
            {/* Card content */}
            <div className="relative z-10 h-full flex flex-col p-6">
              {/* Logo with floating effect */}
              <motion.div
                className="mb-6 self-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={comp.logo} 
                  alt={`${comp.name} Logo`} 
                  className="h-16 object-contain drop-shadow-lg" 
                />
              </motion.div>
              
              {/* Image with 3D tilt effect */}
              <motion.div
                className="w-full h-40 mb-6 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ 
                  rotateY: 5,
                  rotateX: -5,
                  scale: 1.03
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img 
                  src={comp.image} 
                  alt={comp.name} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              
              {/* Title with underline animation */}
              <div className="relative mb-4">
                <h3 className="text-2xl font-bold text-center">
                  {comp.name}
                </h3>

              </div>
              
              {/* Details with animated icons */}
              <div className="space-y-3 mb-6 text-sm">
                <motion.p 
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.span 
                    className="inline-block"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaCalendarAlt />
                  </motion.span>
                  {comp.date}
                </motion.p>
                
                <motion.p 
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span 
                    className="inline-block"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaClock />
                  </motion.span>
                  9:00 AM
                </motion.p>
                
                <motion.p 
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.span 
                    className="inline-block"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaMapMarkerAlt />
                  </motion.span>
                  {comp.location}
                </motion.p>
              </div>
              
              {/* Animated button */}
              {comp.link && (
                <motion.div
                  className="mt-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    to={`${comp.link}?eventName=${encodeURIComponent(comp.name)}&eventId=${encodeURIComponent(comp.id)}`}
                    className={`block text-center font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${comp.accentColor} hover:bg-opacity-90`}
                  >
                    <motion.span
                      className="flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      GO <FaRocket className="inline" />
                    </motion.span>
                  </Link>
                </motion.div>
              )}
            </div>
            
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${comp.accentColor}`}></div>
          </motion.div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-10"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default LiveEvents;