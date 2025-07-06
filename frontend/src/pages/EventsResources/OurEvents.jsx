import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import vex123Logo from '../../assets/cards/vex-123-logo.webp';
import vex123 from '../../assets/cards/vex-123.png';
import vexGoLogo from '../../assets/cards/vex-go-logo.webp';
import vexGo from '../../assets/cards/vex-go.webp';
import vexIqLogo from '../../assets/cards/vex-iq-logo.webp';
import vexIq from '../../assets/cards/vexiq.webp';
import programmingLogo from '../../assets/gallery/Programming/logos/programming-logo.png';
import programming from '../../assets/cards/programming.webp';
import flutterlogo from '../../assets/cards/flutter-removebg-preview.png';
import arduinologo from '../../assets/cards/arduinoLogoo.png';
import flutterimg from '../../assets/cards/mobile.jpg';
import arduino from '../../assets/cards/arduino.jpg';


const roboticsKits = [
  {
    id: 1,
    name: 'VEX 123',
    image: vex123,
    logo: vex123Logo,
    description: 'See Now',
    bgColor: 'bg-vex123',
    textColor: 'text-purple-900',
    apiName: 'vex_123'
  },
  {
    id: 2,
    name: 'VEX GO',
    image: vexGo,
    logo: vexGoLogo,
    description: 'See Now',
    bgColor: 'bg-vexGo',
    textColor: 'text-teal-900',
    apiName: 'vex_go'
    },
  
  {
    id: 3,
    name: 'VEX IQ',
    image: vexIq,
    logo: vexIqLogo,
    description: 'See Now',
    bgColor: 'bg-vexIq',
    textColor: 'text-blue-900',
    apiName: 'vex_iq'
  },
  {
    id: 4,
    name: 'Programming',
    image: programming,
    logo: programmingLogo,
    description: 'See Now',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-900',
    apiName: 'programming'
  },
  {
    id: 5,
    name: 'Flutter',
    image: flutterimg,
    logo: flutterlogo,
    description: 'See Now',
    bgColor: 'inset-0 bg-gradient-to-br from-cyan-500 to-blue-600',
    textColor: 'text-white',
    apiName: 'flutter'
  },
  {
    id: 6,
    name: 'Arduino',
    image: arduino,
    logo: arduinologo,
    description: 'See Now',
    bgColor: 'inset-0 bg-gradient-to-br from-cyan-600 to-teal-800',
    textColor: 'text-white',
    apiName: 'arduino'
  }

];



function OurEvents() {
    const navigate = useNavigate();
    
     const handleCompetitionClick = (apiName) => {
    navigate(`/Competitions/${apiName}`);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <h2 className="mb-8 pt-6 pb-2 text-center text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-cyan-400">
            OUR EVENTS 
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {roboticsKits.map((kit) => (
                <div 
                    key={kit.id} 
                    onClick={() => handleCompetitionClick(kit.apiName)}
                    className={`relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl cursor-pointer group transition-all duration-300 ${kit.bgColor}`}>
                    
                    {/* Card Content */}
                    <div className="p-5 md:p-6 flex flex-col items-center h-full">
                        {/* Logo with gradient background */}
                        <div className="mb-4 p-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <img 
                                src={kit.logo} 
                                alt={`${kit.name} Logo`} 
                                className="w-16 h-16 object-contain" 
                            />
                        </div>
                        
                        {/* Image with aspect ratio */}
                        <div className="w-full aspect-video rounded-lg mb-4 overflow-hidden border-2 border-white/30">
                            <img 
                                src={kit.image} 
                                alt={kit.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        
                        {/* Text content */}
                        <div className="text-center mt-auto w-full">
                            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${kit.textColor}`}>
                                {kit.name}
                            </h2>
                            <button className={`mt-2 px-4 py-2 rounded-full ${kit.textColor} bg-white/20 backdrop-blur-sm font-medium hover:bg-white/30 transition-colors`}>
                                {kit.description}
                            </button>
                        </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            ))}
        </div>
    </div>
);
}

export default OurEvents;