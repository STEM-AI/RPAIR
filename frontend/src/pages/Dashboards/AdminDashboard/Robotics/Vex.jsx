import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import vex123Logo from '../../../../assets/imgs/dashboards/vex-123-logo.webp';
import vex123 from '../../../../assets/imgs/dashboards/vex-123.png';
import vexGoLogo from '../../../../assets/imgs/dashboards/vex-go-logo.webp';
import vexGo from '../../../../assets/imgs/dashboards/vex-go.webp';
import vexIqLogo from '../../../../assets/imgs/dashboards/vex-iq-logo.webp';
import vexIq from '../../../../assets/imgs/dashboards/vexiq.webp';
import vexV5Logo from '../../../../assets/imgs/dashboards/vex-v5-logo.webp';
import vexV5 from '../../../../assets/imgs/dashboards/vex-v5.webp';

const roboticsKits = [
    {
      id: 3,
      name: 'VEX IQ',
      image: vexIq,
      logo: vexIqLogo,
      description: 'A modular robotics platform designed for intermediate students.',
      bgColor: 'bg-vexIq',
      textColor: 'text-blue-900',
      apiName: 'vex_iq'
    },
  {
    id: 2,
    name: 'VEX GO',
    image: vexGo,
    logo: vexGoLogo,
    description: 'An engaging and hands-on robotics system for STEM education.',
    bgColor: 'bg-vexGo',
    textColor: 'text-teal-900',
    apiName: 'vex_go'
    },
  {
    id: 1,
    name: 'VEX 123',
    image: vex123,
    logo: vex123Logo,
    description: 'A simple and interactive robotics kit for young learners.',
    bgColor: 'bg-vex123',
    textColor: 'text-purple-900',
    apiName: 'vex_123'
  },
  {
    id: 4,
    name: 'VEX V5',
    image: vexV5,
    logo: vexV5Logo,
    description: 'A professional-grade robotics system for advanced learners.',
    bgColor: 'bg-vexV5',
    textColor: 'text-red-900',
    apiName: 'vex_v5'
  },
];



function VexPage() {
    const navigate = useNavigate();
    
     const handleCompetitionClick = (apiName) => {
    console.log("Navigating to:", `/Dashboard/Admin/Robotics/${apiName}`);
    navigate(`/Dashboard/Admin/Competitions/robotics/${apiName}`);
  };

  return (
    <div className="p-6 ">
      <h2 className="mb-6 pt-4 pb-8 text-center text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500">
        VEX Robotics 
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

export default VexPage;