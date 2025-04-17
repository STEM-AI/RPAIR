import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import vex123Logo from '../../../assets/cards/vex-123-logo.webp';
import vex123 from '../../../assets/gallery/Robotics/Vex123/FutureComp-sadat/3.jpg';
import vexGoLogo from '../../../assets/cards/vex-go-logo.webp';
import vexGo from '../../../assets/gallery/Robotics/VexGO/FutureComp-sadat/2.jpg';
import vexIqLogo from '../../../assets/cards/vex-iq-logo.webp';
import vexIq from '../../../assets/gallery/Robotics/VexIQ/NationalComp/2.JPG';
import vexV5Logo from '../../../assets/cards/vex-v5-logo.webp';
import vexV5 from '../../../assets/gallery/Robotics/VexV5/vexV.jpg';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { MdNavigateNext } from "react-icons/md";



    

const roboticsVex = [
  {
    id: 1,
    name: 'VEX 123',
    image: vex123,
    logo: vex123Logo,
    bgColor: 'bg-vex123',
    textColor: 'text-purple-900',
    path: '/gallery/Robotics/Vex123'
  },
  {
    id: 2,
    name: 'VEX GO',
    image: vexGo,
    logo: vexGoLogo,
    bgColor: 'bg-vexGo',
    textColor: 'text-teal-900',
    path: '/gallery/Robotics/VexGo'
  },
  {
    id: 3,
    name: 'VEX IQ',
    image: vexIq,
    logo: vexIqLogo,
    bgColor: 'bg-vexIq',
    textColor: 'text-blue-900',
    path: '/gallery/Robotics/VexIQ'
  },
  {
    id: 4,
    name: 'VEX V5',
    image: vexV5,
    logo: vexV5Logo,
    bgColor: 'bg-vexV5',
    textColor: 'text-red-900',
    // path: '/gallery/Robotics/VexV5'
    path: '/competitions/ComingSoon'
  },
];



function Robotics() {
  const navigate = useNavigate();

  return (
    <div className="p-6 mx-auto">
      <Helmet>
        <title>Gallary-Robotics</title>
      </Helmet>
      <h2 className="mb-6 pt-4 pb-8 text-center text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-300">
        VEX Robotics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {roboticsVex.map((Vex) => (
          <article 
            key={Vex.id}
            role="button"
            tabIndex="0"
            onClick={() => navigate(Vex.path)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(Vex.path)}
            className={`group relative p-8 rounded-2xl shadow-xl flex flex-col items-center cursor-pointer transition-all duration-300 hover:z-10 ${Vex.bgColor} hover:shadow-2xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-white/30`}
          >
            {/* Card Content */}
            <div className=" w-full flex-1 flex flex-col items-center">
              <img 
                src={Vex.logo} 
                alt={`${Vex.name} Logo`} 
                className="mb-6 h-16 w-auto object-contain opacity-90" 
              />
               <img src={Vex.image} alt={Vex.name} className="w-full h-80 object-cover rounded mb-4" />

            
            </div>

            {/* CTA Button */}
          <div className="mt-4 w-full flex justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
              <Link
                to={Vex.path}
                className="flex items-center space-x-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors font-medium"
              >
                View Gallery <MdNavigateNext />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Robotics;


