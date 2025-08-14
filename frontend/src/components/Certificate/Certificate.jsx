// import React from "react";
// import logo from "../../assets/Static/logo2.png";
// import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
// import done from "../../assets/Static/Dr._Ayman_Elnag.png";
// import watermarkLeft from "../../assets/Static/bgleft.png";
// import watermarkRight from "../../assets/Static/bg.png";
// import vex123Logo from "../../assets/logoCert/vex123.png";
// import vexIQLogo from "../../assets/logoCert/vexIQ.png";
// import vexGOLogo from "../../assets/logoCert/vexGO.png";
// import arduinoLogo from "../../assets/logoCert/arduino.png";
// import flutterLogo from "../../assets/logoCert/flutter.png";


// const Certificate = ({ selectedMember, certificateRef, teamName, competitionName, startDate }) => {

//   const getLogo = (competitionName) => {
//     switch (competitionName) {
//       case 'vex_123':
//         return vex123Logo;
//       case 'vex_iq':
//         return vexIQLogo;
//       case 'vex_go':
//         return vexGOLogo;
//       case 'arduino':
//         return arduinoLogo;
//       case 'flutter':
//         return flutterLogo;
//       default:
//         return vex123Logo;
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-100">
//       <div
//         ref={certificateRef}
//         className="bg-white shadow-2xl rounded-lg overflow-hidden relative"
//         style={{ width: "1300px", height: "1000px" }}
//       >
//         <div className="absolute inset-0 opacity-40 z-0">
//           <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
//         </div>
//         <div className="absolute inset-0 opacity-40 z-0">
//           <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
//         </div>

//         <div className="text-white py-8 px-8 text-center relative">
//           <div className="flex justify-between items-center mb-4 space-y-4 md:space-y-0">
//             <div className="w-40 md:w-32">
//               <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
//             </div>
//             <div className="w-40 md:w-32">
//               <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
//             </div>
//           </div>
//         </div>

//         <div className="py-12 px-8 text-center relative min-h-[500px]">
//           <div className="text-center flex-1 mx-4 space-y-2">
//             <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2 text-black">
//               CERTIFICATE
//             </h1>
//             <p className="text-xl italic text-black font-medium">of Excellence</p>
//           </div>

//           <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
//             This certificate is proudly presented to
//           </p>
          
//           <div className="mb-12 relative z-10 ">
//             <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
//               {selectedMember}
//             </p><br />
           
//           </div>
          
//           <div className="space-y-2 mb-16">
//             <p className="text-2xl text-gray-700 italic font-medium">
//               For his achievement in Robotics, Programming, and Artificial Intelligence
//             </p>
//             <p className="text-2xl text-gray-700 italic font-medium">
//               and proves that he is competent in his field
//             </p>
//           </div>
//         </div>

//         <div className="text-black  px-8 flex flex-row justify-between gap-8">
//           <div className="text-center flex-1 mb-4 md:mb-0">
//             <div className="border-t-2 border-black pt-4 mx-auto w-2/5 lg:w-3/5 ">
//               <p className="font-bold text-lg mb-1">Date of Issue</p>
//               <p className="text-base font-medium">
//                 {startDate ? new Date(startDate).toLocaleDateString('en-GB', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric'
//                 }) : 'Not specified'}
//               </p>
//             </div>
//           </div>
//             <div className="relative top-full flex items-start justify-center">
//               <img src={getLogo(competitionName)} alt="Signature" className="w-auto h-64" />
//             </div>

//           <div className="text-center flex-1">
//             <div className="border-t-2 border-black pt-4 w-2/5 lg:w-3/5 mx-auto flex items-center justify-center">
//               <img src={done} alt="Signature" className="h-28 w-auto" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certificate;



// import React from "react";
// import logo from "../../assets/Static/logo2.png";
// import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
// import done from "../../assets/Static/Dr._Ayman_Elnag.png";
// import watermarkLeft from "../../assets/Static/bgleft.png";
// import watermarkRight from "../../assets/Static/bg.png";
// import vex123Logo from "../../assets/logoCert/vex123.png";
// import vexIQLogo from "../../assets/logoCert/vexIQ.png";
// import vexGOLogo from "../../assets/logoCert/vexGO.png";
// import arduinoLogo from "../../assets/logoCert/arduino.png";
// import flutterLogo from "../../assets/logoCert/flutter.png";

// const Certificate = ({ selectedMember, certificateRef, teamName, competitionName, startDate }) => {

//   const getLogo = (competitionName) => {
//     switch (competitionName) {
//       case 'vex_123':
//         return vex123Logo;
//       case 'vex_iq':
//         return vexIQLogo;
//       case 'vex_go':
//         return vexGOLogo;
//       case 'arduino':
//         return arduinoLogo;
//       case 'flutter':
//         return flutterLogo;
//       default:
//         return vex123Logo;
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-100">
//       <div
//         ref={certificateRef}
//         className="bg-white shadow-2xl rounded-lg overflow-hidden relative"
//         style={{ width: "1300px", height: "1000px" }}
//       >
//         <div className="absolute inset-0 opacity-40 z-0">
//           <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
//         </div>
//         <div className="absolute inset-0 opacity-40 z-0">
//           <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
//         </div>

//         <div className="text-white py-8 px-8 text-center relative">
//           <div className="flex justify-between items-center mb-4 space-y-4 md:space-y-0">
//             <div className="w-40 md:w-32">
//               <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
//             </div>
//             <div className="w-40 md:w-32">
//               <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
//             </div>
//           </div>
//         </div>

//         <div className="py-12 px-8 text-center relative min-h-[500px]">
//           <div className="text-center flex-1 mx-4 space-y-2">
//             <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2 text-black">
//               CERTIFICATE
//             </h1>
//             <p className="text-xl italic text-black font-medium">of Excellence</p>
//           </div>

//           <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
//             This certificate is proudly presented to
//           </p>
          
//           <div className="mb-12 relative z-10 ">
//             <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
//               {selectedMember}
//             </p><br />
//           </div>
          
//           <div className="space-y-2 mb-16">
//             <p className="text-2xl text-gray-700 italic font-medium">
//               For his achievement in Robotics, Programming, and Artificial Intelligence
//             </p>
//             <p className="text-2xl text-gray-700 italic font-medium">
//               and proves that he is competent in his field
//             </p>
//           </div>
//         </div>

//         <div className="text-black py-6 px-8 flex flex-row justify-between gap-8">
//           <div className="text-center flex-1 mb-4 md:mb-0">
//             <div className="border-t-2 border-black pt-4 mx-auto w-2/5 lg:w-3/5 ">
//               <p className="font-bold text-lg mb-1">Date of Issue</p>
//               <p className="text-base font-medium">
//                 {startDate ? new Date(startDate).toLocaleDateString('en-GB', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric'
//                 }) : 'Not specified'}
//               </p>
//             </div>
//           </div>
          
//           {/* تم تعديل هذا القسم ليكون لوجو المسابقة في نفس مستوى التوقيع */}
//           <div className="flex-1 flex items-center justify-center"> {/* تغيير هنا */}
//             <img
//               src={getLogo(competitionName)}
//               alt="Competition Logo"
//               className="w-48 h-auto object-contain"
//             />
//           </div>

//           <div className="text-center flex-1">
//             <div className="border-t-2 border-black pt-4 w-2/5 lg:w-3/5 mx-auto flex items-center justify-center">
//               <img src={done} alt="Signature" className="h-28 w-auto" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certificate;


import React from "react";
import logo from "../../assets/Static/logo2.png";
import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
import done from "../../assets/Static/Dr._Ayman_Elnag.png";
import watermarkLeft from "../../assets/Static/bgleft.png";
import watermarkRight from "../../assets/Static/bg.png";
import vex123Logo from "../../assets/logoCert/vex123.png";
import vexIQLogo from "../../assets/logoCert/vexIQ.png";
import vexGOLogo from "../../assets/logoCert/vexGO.png";
import arduinoLogo from "../../assets/logoCert/arduino.png";
import flutterLogo from "../../assets/logoCert/flutter.png";
import pythonLogo from "../../assets/logoCert/python.webp";

const Certificate = ({ selectedMember, certificateRef, teamName, competitionName, startDate }) => {

  const getLogo = (competitionName) => {
    switch (competitionName) {
      case 'vex_123':
        return vex123Logo;
      case 'vex_iq':
        return vexIQLogo;
      case 'vex_go':
        return vexGOLogo;
      case 'arduino':
        return arduinoLogo;
      case 'flutter':
        return flutterLogo;
      default:
        return pythonLogo;
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div 
        ref={certificateRef} 
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative" 
        style={{ width: "1300px", height: "1000px" }}
      >
        <div className="absolute inset-0 opacity-40 z-0">
          <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 opacity-40 z-0">
          <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
        </div>

        <div className="text-white py-8 px-8 text-center relative">
          <div className="flex justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div className="w-40 md:w-32">
              <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
            </div>
            <div className="w-40 md:w-32">
              <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
            </div>
          </div>
        </div>

        <div className="py-12 px-8 text-center relative min-h-[500px]">
          <div className="text-center flex-1 mx-4 space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2 text-black">
              CERTIFICATE
            </h1>
            <p className="text-xl italic text-black font-medium">of Excellence</p>
          </div>

          <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
            This certificate is proudly presented to
          </p>
          
          <div className="mb-12 relative z-10 ">
            <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
              {selectedMember}
            </p><br/>
          </div>
          
          <div className="space-y-2 mb-16">
            <p className="text-2xl text-gray-700 italic font-medium">
              For his achievement in Robotics, Programming, and Artificial Intelligence
            </p>
            <p className="text-2xl text-gray-700 italic font-medium">
              and proves that he is competent in his field  
            </p>
          </div>
        </div>

        <div className="text-black py-6 px-8 flex flex-row justify-between gap-8">
          <div className="text-center flex-1 mb-4 md:mb-0">
            <div className="border-t-2 border-black pt-4 mx-auto w-2/3  ">
              <p className="font-bold text-lg mb-1">Date of Issue</p>
              <p className="text-base font-medium">
                {startDate ? new Date(startDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'Not specified'}
              </p>
            </div>
          </div>
          
          
          <div className="flex-1 flex justify-center relative -top-28"> 
            <img 
              src={getLogo(competitionName)} 
              alt="Competition Logo" 
              className="w-auto h-60 object-contain" 
            />
          </div>

          <div className="text-center flex-1">
            <div className="border-t-2 border-black pt-4 w-2/3  mx-auto flex items-center justify-center">
              <img src={done} alt="Signature" className="h-28 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;