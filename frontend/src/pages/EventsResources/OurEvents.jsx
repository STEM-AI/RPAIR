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
  }

];



function OurEvents() {
    const navigate = useNavigate();
    
     const handleCompetitionClick = (apiName) => {
    navigate(`/Competitions/${apiName}`);
  };

  return (
    <div className="p-6 ">
      <h2 className="mb-6 pt-4 pb-8 text-center text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500">
        OUR EVENTS 
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roboticsKits.map((kit) => (
          <div 
            key={kit.id} 
                onClick={() => handleCompetitionClick(kit.apiName)}
            className={`p-6 rounded-xl shadow-2xl flex flex-col items-center text-white ${kit.bgColor} cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg`}>
            <img src={kit.logo} alt={`${kit.name} Logo`} className="mb-4 object-contain" />
            <img src={kit.image} alt={kit.name} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className={`text-2xl font-bold text-center mb-2 ${kit.textColor}`}>{kit.name}</h2>
            <p className="text-center px-2">{kit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurEvents;