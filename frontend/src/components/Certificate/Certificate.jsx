import React from "react";
import logo from "../../assets/Static/logo2.png";
import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
import done from "../../assets/Static/Dr._Ayman_Elnag.png";
import watermarkLeft from "../../assets/Static/bgleft.png";
import watermarkRight from "../../assets/Static/bg.png";

const Certificate = ({ selectedMember, certificateRef, teamName, competitionName, startDate }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div 
        ref={certificateRef} 
        className="bg-white shadow-2xl rounded-lg overflow-hidden relative" 
        style={{ width: "1300px", height: "1000px" }}
      >
        {/* الخلفية المائية */}
        <div className="absolute inset-0 opacity-40 z-0">
          <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 opacity-40 z-0">
          <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
        </div>

        {/* الشعارات */}
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

        {/* محتوى الشهادة */}
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
          
          <div className="mb-12 relative z-10">
            <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
              {selectedMember}
            </p>
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

        {/* التوقيع وتاريخ الإصدار */}
        <div className="text-black py-6 px-8 flex flex-col md:flex-row justify-between gap-8">
          <div className="text-center flex-1 mb-4 md:mb-0">
            <div className="border-t-2 border-black pt-4 mx-auto w-3/4">
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
          <div className="text-center flex-1">
            <div className="border-t-2 border-black pt-4 w-3/4 flex items-center justify-center">
              <img src={done} alt="Signature" className="h-28 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

// import React, { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import logo from "../../assets/Static/logo2.png";
// import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
// import done from "../../assets/Static/Dr._Ayman_Elnag.png";
// import watermarkLeft from "../../assets/Static/bgleft.png";
// import watermarkRight from "../../assets/Static/bg.png";

// const Certificate = ({ selectedMember, certificateRef, teamName, competitionName, startDate }) => {
//   const downloadCertificate = () => {
//     if (certificateRef.current) {
//       html2canvas(certificateRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false
//       }).then(canvas => {
//         const link = document.createElement("a");
//         link.download = `${selectedMember}_certificate.png`;
//         link.href = canvas.toDataURL("image/png");
//         link.click();
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
//       <div ref={certificateRef} className="bg-white shadow-2xl rounded-lg overflow-hidden relative" 
//            style={{ width: "1300px", height: "1000px" }}>
       
//     <div className="absolute inset-0 opacity-40 z-0">
//       <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
//     </div>
//     <div className="absolute inset-0 opacity-40 z-0">
//       <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
//     </div>

//   <div className=" text-white py-8 px-8 text-center relative">
//     <div className="flex  justify-between items-center mb-4 space-y-4 md:space-y-0">
//       <div className="w-40 md:w-32">
//         <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
//       </div>
      
//       <div className="w-40 md:w-32">
//         <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
//       </div>
//     </div>
//   </div>

//   <div className="py-12 px-8 text-center relative min-h-[500px]">
//   <div className="text-center flex-1 mx-4 space-y-2">
//         <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2  text-black">
//           CERTIFICATE
//         </h1>
//         <p className="text-xl italic text-black font-medium">of Excellence</p>
//       </div>

//     <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
//       This certificate is proudly presented to
//     </p>
    
//     <div className="mb-12 relative z-10">
//     <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
//         {selectedMember}
//         {/* {selectedMember.isLeader && <span className="block text-sm mt-2">(Team Leader)</span>} */}
//             </p>
//       </div>
      
    
//     <div className="space-y-2 mb-16">
//         <p className="text-2xl text-gray-700 italic font-medium">
//           For his achievement in Robotics, Programming, and Artificial Intelligence
//             </p>
//         <p className="text-2xl text-gray-700 italic font-medium">
//           and proves that he is competent in his field  
//             </p>
      
//       </div>

    
//   </div>

//   <div className=" text-black py-6 px-8 flex flex-col md:flex-row justify-between gap-8">
//     <div className="text-center flex-1 mb-4 md:mb-0">
//       <div className="border-t-2 border-black pt-4 mx-auto w-3/4">
//         <p className="font-bold text-lg mb-1">Date of Issue</p>
//         <p className="text-base font-medium">
//         {startDate ? new Date(startDate).toLocaleDateString('en-GB', {
//           day: 'numeric',
//           month: 'long',
//           year: 'numeric'
//         }) : 'Not specified'}
//       </p>
//         </div>
//     </div>
//     <div className="text-center flex-1  ">
//     <div className="border-t-2 border-black pt-4 w-3/4 flex items-center justify-center">
//     <img src={done} alt="Signature" className="h-28 w-auto" />
//       </div>
//     </div>
//   </div>
//       </div>

//       <button 
//         onClick={downloadCertificate}
//         className="mt-4  bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Download
//         </button>
//     </div>
//   );
// };

// export default Certificate;


// import React, { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import logo from "../../assets/Static/logo2.png";
// import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
// import done from "../../assets/Static/Dr._Ayman_Elnag.png";
// import watermarkLeft from "../../assets/Static/bgleft.png";
// import watermarkRight from "../../assets/Static/bg.png";

// const Certificate = ({ selectedMember, certificateRef, forceFullSize, teamName, competitionName, startDate }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
// console.log(startDate);

//   const toggleSize = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <>
//       {(isExpanded || forceFullSize) && (
//         <div className="fixed inset-0 bg-black/50 z-50 items-center justify-center flex">
//           <div className="relative w-full m-4">
//             {isExpanded && (
//               <button 
//                 onClick={toggleSize}
//                 className="absolute top-44 left-0 text-red-600 text-2xl"
//               >
//                 ✕
//               </button>
//             )}
//             <div 
//               className="w-full bg-white rounded-lg  shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <CertificateContent selectedMember={selectedMember} ref={certificateRef} />
//             </div>
//           </div>
//         </div>
//       )}

//       {!forceFullSize && (
//         <div 
//           className="m-4 cursor-pointer hover:scale-105 transition-transform duration-300"
//           onClick={toggleSize}
//         >
//           <div className="w-full bg-white shadow-2xl rounded-lg overflow-hidden transform scale-90">
//             <CertificateContent selectedMember={selectedMember} ref={certificateRef} startDate={startDate} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };


// export const CertificateContent = React.forwardRef(
//   ({ selectedMember, teamName, competitionName, startDate }, ref
//   ) => (
//     <div ref={ref} className="w-full  bg-white shadow-2xl rounded-lg overflow-hidden relative print:shadow-none">
//     <div className="absolute inset-0 opacity-40 z-0">
//       <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
//     </div>
//     <div className="absolute inset-0 opacity-40 z-0">
//       <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
//     </div>

//   <div className=" text-white py-8 px-8 text-center relative">
//     <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
//       <div className="w-40 md:w-32">
//         <img src={logo} alt="Institution Logo" className="w-full h-auto max-h-32 object-contain" />
//       </div>
      
//       <div className="w-40 md:w-32">
//         <img src={logoAlm} alt="National Symbol" className="w-full h-auto max-h-32 object-contain" />
//       </div>
//     </div>
//   </div>

//   <div className="py-12 px-8 text-center relative min-h-[500px]">
//   <div className="text-center flex-1 mx-4 space-y-2">
//         <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2  text-black">
//           CERTIFICATE
//         </h1>
//         <p className="text-xl italic text-black font-medium">of Excellence</p>
//       </div>

//     <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
//       This certificate is proudly presented to
//     </p>
    
//     <div className="mb-12 relative z-10">
//     <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
//         {selectedMember}
//       </p>
//       </div>
      
    
//     <div className="space-y-2 mb-16">
//         <p className="text-2xl text-gray-700 italic font-medium">
//           For his achievement in Robotics, Programming, and Artificial Intelligence
//             </p>
//         <p className="text-2xl text-gray-700 italic font-medium">
//           and proves that he is competent in his field  
//             </p>
      
//       </div>

    
//   </div>

//   <div className=" text-black py-6 px-8 flex flex-col md:flex-row justify-between gap-8">
//     <div className="text-center flex-1 mb-4 md:mb-0">
//       <div className="border-t-2 border-black pt-4 mx-auto w-3/4">
//         <p className="font-bold text-lg mb-1">Date of Issue</p>
//         <p className="text-base font-medium">
//         {startDate ? new Date(startDate).toLocaleDateString('en-GB', {
//           day: 'numeric',
//           month: 'long',
//           year: 'numeric'
//         }) : 'Not specified'}
//       </p>
//         </div>
//     </div>
//     <div className="text-center flex-1  ">
//     <div className="border-t-2 border-black pt-4 w-3/4 flex items-center justify-center">
//     <img src={done} alt="Signature" className="h-28 w-auto" />
//       </div>
//     </div>
//   </div>
//       </div>
// ));

// export default Certificate;





// /*



// import React, { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import logo from "../../assets/Static/logo2.png";
// import logoAlm from "../../assets/Static/egyptian-clipart-eagle-2.png";
// import done from "../../assets/Static/Dr._Ayman_Elnag.png";
// import watermarkLeft from "../../assets/Static/bgleft.png";
// import watermarkRight from "../../assets/Static/bg.png";

// const Certificate = ({ selectedMember, certificateRef, forceFullSize, teamName, competitionName, startDate }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
// console.log(startDate);

//   const toggleSize = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <>
//       {(isExpanded || forceFullSize) && (
//         <div className="fixed inset-0 bg-black/50 z-50 items-center justify-center flex">
//           <div className="relative w-full m-4">
//             {isExpanded && (
//               <button 
//                 onClick={toggleSize}
//                 className="absolute top-44 left-0 text-red-600 text-2xl"
//               >
//                 ✕
//               </button>
//             )}
//             <div 
//               className="w-full bg-white rounded-lg  shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <CertificateContent selectedMember={selectedMember} ref={certificateRef} />
//             </div>
//           </div>
//         </div>
//       )}

//       {!forceFullSize && (
//         <div 
//           className="m-4 cursor-pointer hover:scale-105 transition-transform duration-300"
//           onClick={toggleSize}
//         >
//           <div 
//             className="w-full bg-white shadow-2xl rounded-lg overflow-hidden transform scale-90 max-w-full mx-auto"
//           >
//             <CertificateContent selectedMember={selectedMember} ref={certificateRef} startDate={startDate} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };


// const CertificateContent = React.forwardRef(({ selectedMember, teamName, competitionName, startDate }, ref) => (
//   <div ref={ref} className="w-full bg-white shadow-2xl rounded-lg overflow-hidden relative print:shadow-none"
//   style={{ width: '933px', margin: '0 auto' }}>
//     <div className="absolute inset-0 opacity-40 z-0">
//       <img src={watermarkLeft} alt="Watermark" className="w-full h-full object-cover" />
//     </div>
//     <div className="absolute inset-0 opacity-40 z-0">
//       <img src={watermarkRight} alt="Watermark" className="w-full h-full object-cover" />
//     </div>

//   <div className=" text-white py-8 px-8 text-center relative">
//     <div className="flex  flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
//       <div className="w-40 md:w-32">
//         <img 
//           src={logo} 
//           alt="Institution Logo" 
//           className="md:w-full w-48 h-auto max-h-32 object-contain"
//           onError={(e) => {
//             e.target.onerror = null;
//             console.log('Failed to load institution logo');
//           }}
//         />
//       </div>
      
//       <div className="w-40 md:w-32">
//         <img 
//           src={logoAlm} 
//           alt="National Symbol" 
//           className="md:w-full w-48 h-auto max-h-32 object-contain"
//           onError={(e) => {
//             e.target.onerror = null;
//             console.log('Failed to load national symbol');
//           }}
//         />
//       </div>
//     </div>
//   </div>

//   <div className="py-12 px-8 text-center relative min-h-[500px]">
//   <div className="text-center flex-1 mx-4 space-y-2">
//         <h1 className="text-4xl md:text-5xl font-bold tracking-widest font-serif mb-2  text-black">
//           CERTIFICATE
//         </h1>
//         <p className="text-xl italic text-black font-medium">of Excellence</p>
//       </div>

//     <p className="text-xl mb-12 text-gray-600 font-medium tracking-wide">
//       This certificate is proudly presented to
//     </p>
    
//     <div className="mb-12 relative z-10">
//     <p className="text-4xl md:text-5xl font-bold text-black pb-6 inline-block px-12 font-serif tracking-tight">
//         {selectedMember}
//         {selectedMember.isLeader && <span className="block text-sm mt-2">(Team Leader)</span>}
//       </p>
//       </div>
      
    
//     <div className="space-y-2 mb-16">
//     <p className="text-xl md:text-2xl text-gray-700 italic font-medium">
//         For his achievement in Robotics, Programming, and Artificial Intelligence
//       </p>
//       <p className="text-xl md:text-2xl text-gray-700 italic font-medium">
//       and proves that he is competent in his field  
//             </p>
      
//       </div>

    
//   </div>

//   <div className=" text-black py-6 px-8 flex flex-col md:flex-row justify-between gap-8">
//     <div className="text-center flex-1 mb-4 md:mb-0">
//       <div className="border-t-2 border-black pt-4 mx-auto w-3/4">
//         <p className="font-bold text-lg mb-1">Date of Issue</p>
//         <p className="text-base font-medium">
//         {startDate ? new Date(startDate).toLocaleDateString('en-GB', {
//           day: 'numeric',
//           month: 'long',
//           year: 'numeric'
//         }) : 'Not specified'}
//       </p>
//         </div>
//     </div>
//     <div className="text-center flex-1  ">
//     <div className="border-t-2 border-black pt-4 w-3/4 flex items-center justify-center">
//     <img src={done} alt="Signature" className="h-28 w-auto" />
//       </div>
//     </div>
//   </div>
//       </div>
// ));

// export default Certificate;






// */