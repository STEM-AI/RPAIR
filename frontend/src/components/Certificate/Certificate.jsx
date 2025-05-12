import React, { useRef } from "react";
import html2canvas from "html2canvas";
import logo from "../../assets/Static/logo2.png";
import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
import done from "../../assets/Static/Dr._Ayman_Elnag.png";
import watermarkLeft from "../../assets/Static/bgleft.png"; // Local watermark asset
import watermarkRight from "../../assets/Static/bg.png"; // Local watermark asset

const Certificate = () => {
    const certificateRef = useRef(null);

    const handleDownload = () => {
      if (certificateRef.current) {
        html2canvas(certificateRef.current, {
          useCORS: true,
          scale: 2 // Higher resolution
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'certificate.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      }
    };

    return (
        <>
    <button 
        onClick={handleDownload}
        className="mb-8 bg-blue-600 hover:bg-blue-700 text-center text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
      >
        Download Certificate
      </button>
      <div className="flex items-center justify-center min-h-screen  p-4 print:p-0">
         
      <div  ref={certificateRef} className="w-full max-w-6xl bg-white  shadow-2xl rounded-lg overflow-hidden relative print:shadow-none">
          {/* Watermark Background */}
          <div className="absolute inset-0 opacity-40 z-0">
            <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover " />
          </div>
          <div className="absolute inset-0 opacity-40 z-0">
            <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover " />
          </div>

        {/* Certificate Header */}
        <div className=" text-white py-8 px-8 text-center relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div className="w-40 md:w-32">
              <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
            </div>
            
            <div className="w-40 md:w-32">
              <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="py-12 px-8 text-center relative min-h-[500px]">
        <div className="text-center flex-1 mx-4 space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2  text-black">
                CERTIFICATE
              </h1>
              <p className="text-xl italic text-black font-medium">of Excellence</p>
            </div>

          <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
            This certificate is proudly presented to
          </p>
          
          <div className="mb-12 relative z-10">
            <p className="text-4xl md:text-5xl font-bold text-black   pb-6 inline-block px-12 font-serif tracking-tight">
              YARA MAHMOUD GABER
            </p>
          </div>
          
          <div className="space-y-6 mb-16">
            <p className="text-2xl text-gray-700 italic font-medium">
              For exceptional dedication and achievement in
            </p>
            <p className="text-3xl text-blue-900 font-semibold tracking-wide">
              Robotics, Programming, and Artificial Intelligence
            </p>
          </div>

          
        </div>

        <div className=" text-black py-6 px-8 flex flex-col md:flex-row justify-between gap-8">
          <div className="text-center flex-1 mb-4 md:mb-0">
            <div className="border-t-2 border-black pt-4 mx-auto w-3/4">
              <p className="font-bold text-lg mb-1">Date of Issue</p>
              <p className="text-base font-medium">May 8, 2025</p>
            </div>
          </div>
          <div className="text-center flex-1  ">
          <div className="border-t-2 border-black pt-4 w-3/4 flex items-center justify-center">
          <img src={done} alt="Signature" className="h-28 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
      </>
  );
};

export default Certificate;