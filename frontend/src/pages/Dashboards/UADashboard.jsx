import React ,{ useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vexGoLogo from '../../assets/cards/vex-go-logo.webp';
import vex123Logo from '../../assets/cards/vex-123-logo.webp';
import vex123 from '../../assets/cards/vex-123.png';
import vexGo from '../../assets/cards/vex-go.webp';
import vexIqLogo from '../../assets/cards/vex-iq-logo.webp';
import vexIq from '../../assets/cards/vexiq.webp';
import { Helmet } from 'react-helmet-async';
import { useLoading } from '../../context/LoadingContext';


const roboticsKits = [
  {
    id: 1,
    name: 'VEX 123',
    image: vex123,
    logo: vex123Logo,
    bgColor: 'bg-vex123',
    textColor: 'text-purple-900',
  },
  {
    id: 2,
    name: 'VEX GO',
    image: vexGo,
    logo: vexGoLogo,
    bgColor: 'bg-vexGo',
    textColor: 'text-teal-900',
  },
  {
    id: 3,
    name: 'VEX IQ',
    image: vexIq,
    logo: vexIqLogo,
    bgColor: 'bg-vexIq',
    textColor: 'text-blue-900',
  },
];

function UADashboard() {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false); // إيقاف اللودينج عند الدخول للصفحة
  }, []);

  const handleNavigation = (kit) => {
    const userRole = localStorage.getItem('user_role'); 
    const snakeCaseName = kit.name.toLowerCase().replace(/\s+/g, '_'); // تحويل الاسم إلى snake case
    navigate(`/Dashboard/Event/${snakeCaseName}`, { state: { competition_name: kit.name, userRole } });
  };

  return (
    <div className="p-6 flex flex-col items-center">
       <Helmet>
              <title>Dashboard</title>
            </Helmet>
      
       <h2 className="mb-12 text-center">
        <span className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
          Live & Upcoming Competitions
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roboticsKits.map((kit) => (
          <div 
            key={kit.id} 
            className={`p-4 w-96 rounded-xl shadow-lg flex flex-col items-center ${kit.bgColor} cursor-pointer  transform hover:scale-105 hover:shadow-xl`}
            onClick={() => handleNavigation(kit)}
          >
            <img src={kit.logo} alt={`${kit.name} Logo`} className="mb-3 w-60 h-32 object-contain" />
            <img src={kit.image} alt={kit.name} className="w-full h-40 object-cover rounded-md mb-4" />
            <button 
              className="mt-auto bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-200">
              View Events
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UADashboard;
