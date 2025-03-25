// import React from "react";
// import logo from "../assets/Static/logoWrite-re.png";

// const LoadingPage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
//       <img src={logo} alt="RPAIR Logo" className="w-64 h-auto animate-revealFade" />
//     </div>
//   );
// };

// export default LoadingPage;
import React from "react";
import logo from "../assets/Static/logoWrite-re.png";

const LoadingPage = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 z-50">
      <div className="relative w-64 h-64">
        <img 
          src={logo} 
          alt="RPAIR Logo" 
          className="w-full h-full animate-revealFade opacity-0" 
        />
      </div>
     
    </div>
  );
};

export default LoadingPage;