import React from 'react';
import { Link } from 'react-router-dom';

function SourcePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      {/* العنوان الرئيسي */}
      <h2 className="mb-10 text-center text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500">
        Open Source Challenges
      </h2>

      {/* كارد Arduino */}
      <Link to="/Arduino" className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl w-[420px]">
        {/* صورة الكارد */}
        <img 
          src={require('../../../../assets/cards/arduino.jpg')} 
          alt="Arduino"
          className="w-full h-64 object-cover"
        />

        {/* تفاصيل الكارد */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Arduino</h2>
          <p className="text-gray-700 text-base leading-relaxed">
          Compete in Arduino challenges to showcase your electronics and programming skills by building innovative projects.
          </p>
        </div>
      </Link>
    </div>
  );
}

export default SourcePage;


