import React from 'react';
import { Link } from 'react-router-dom';
import Arduino from '../../../../assets/cards/arduino.jpg'
import { useNavigate } from 'react-router-dom';


const openSource = [
  {
    id: 1,
    name: 'Arduino',
    image: Arduino,
    description: 'Compete in Arduino challenges to showcase your electronics and programming skills by building innovative projects.',
  
    apiName: 'arduino'
  },
  
];

function SourcePage() {
 const navigate = useNavigate();
    
     const handleCompetitionClick = (apiName) => {
    navigate(`/Dashboard/Competitions/${apiName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      {/* العنوان الرئيسي */}
      <h2 className="mb-10 text-center text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500">
        Open Source Challenges
      </h2>

      {openSource.map((kit) => (
          <div 
            key={kit.id} 
            onClick={() => handleCompetitionClick(kit.apiName)}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl w-[420px]">
         <img src={kit.image} alt={kit.name}
          className="w-full h-64 object-cover"
        />

        {/* تفاصيل الكارد */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 ">{kit.name}</h2>
          <p className="text-gray-700 text-base leading-relaxed">{kit.description}</p>
                     </div>
      </div>
               ))}
    </div>
  );
}

export default SourcePage;

