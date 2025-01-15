


// import React, { useState } from "react";
// import { Link } from "react-router-dom"; 
// import Logo from "../../assets/logo/logo2.png";
// import { MdOutlineDashboard } from "react-icons/md";
// import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs"; 
// import { RiTeamLine , RiUserSettingsLine } from "react-icons/ri";
// import { GiLaurelsTrophy } from "react-icons/gi";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false); 
//   const [activeItem, setActiveItem] = useState(null); 

//   const toggleSubMenu = (item) => {
//     setActiveItem((prev) => (prev === item ? null : item));
//   };

//   return (
//     <div className="relative">
//       {/* Hamburger button to toggle sidebar visibility */}
//       <button
//         className="lg:hidden p-4 text-white bg-blue-900 fixed top-4 left-4 z-50"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="material-icons">menu</span>
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full bg-gradient-to-r from-cyan-800 to-cyan-500 text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${isOpen ? "w-64" : "w-0"} lg:w-64 lg:block lg:static`}
//       >
//         {/* Logo */}
//         <div className="w-full h-32 flex justify-center items-center py-4">
//           <img src={Logo} alt="Logo" className="max-w-full max-h-full object-contain" />
//         </div>

//         {/* Main items list */}
//         <div className="flex-1 overflow-y-auto">
//           <ul className="space-y-2 p-4">
//             {/* Dashboard */}
//             <Link to="/Dashboard/Admin">
//               <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                 <MdOutlineDashboard className="mr-2" />
//                 Dashboard
//               </li>
//             </Link>

//             {/* Competitions */}
//             <li
//               className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
//               onClick={() => toggleSubMenu("competitions")}
//             >
//               <GiLaurelsTrophy className="mr-2" />
//               Competitions
//               <span className="ml-auto">
//                 {activeItem === "competitions" ? (
//                   <BsChevronDoubleUp />
//                 ) : (
//                   <BsChevronDoubleDown />
//                 )}
//               </span>
//             </li>
//             {activeItem === "competitions" && (
//               <ul className="pl-6 mt-2">
//                 <Link to="/Dashboard/Admin/Compitions/VexIQ">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     VEX IQ 
//                   </li>
//                 </Link>
//                 <Link to="/Dashboard/Admin/Compitions/VexV5">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     VEX V5 
//                   </li>
//                 </Link>
//                 <Link to="/Dashboard/Admin/Compitions/ElectronicsArduino">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     Electronics & Arduino
//                   </li>
//                 </Link>
//                 <Link to="/Dashboard/Admin/Compitions/AI">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     Artificial Intelligence
//                   </li>
//                 </Link>
//                 <Link to="/Dashboard/Admin/Compitions/WebDesign">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     Web Design
//                   </li>
//                 </Link>
//                 <Link to="/Dashboard/Admin/Compitions/MobileApp">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     Mobile Application
//                   </li>
//                 </Link>
//               </ul>
//             )}

//             {/* Teams */}
// <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
//   <Link to="/Dashboard/Admin/Teams" className="flex items-center w-full">
//     <RiTeamLine className="mr-2" />
//     Teams
//   </Link>
// </li>


//             {/* Management */}
//             <li
//               className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
//               onClick={() => toggleSubMenu("management")}
//             >
//               <RiUserSettingsLine className="mr-2" />
//               Management
//               <span className="ml-auto">
//                 {activeItem === "management" ? (
//                   <BsChevronDoubleUp />
//                 ) : (
//                   <BsChevronDoubleDown />
//                 )}
//               </span>
//             </li>
//             {activeItem === "management" && (
//               <ul className="pl-6 mt-2">
//                 <Link to="/Dashboard/Admin/Teams/SubItem1">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     Create Competition or Event
//                   </li>
//                 </Link>
//                 <Link to="/Dashboard/Admin/Teams/SubItem2">
//                   <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                     Create Staff
//                   </li>
//                 </Link>
                
//               </ul>
//             )}

            
            
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;







import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo2.png";
import { MdOutlineDashboard } from "react-icons/md";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs";
import { RiTeamLine, RiUserSettingsLine } from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleSubMenu = (item) => {
    setActiveItem((prev) => (prev === item ? null : item));
  };

  return (
    <div className="relative">
      {/* Hamburger button to toggle sidebar visibility */}
      <button
        className="lg:hidden p-4 text-white bg-blue-900 fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons">menu</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-r from-cyan-800 to-cyan-500 text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "w-64" : "w-0"
        } lg:w-64 lg:block lg:static`}
      >
        {/* Logo */}
        <div className="w-full h-32 flex justify-center items-center py-4">
          <img
            src={Logo}
            alt="Logo"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Main items list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            {/* Dashboard */}
            <Link to="/Dashboard/Admin">
              <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <MdOutlineDashboard className="mr-2" />
                Dashboard
              </li>
            </Link>

            {/* Competitions */}
            <li
              className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => toggleSubMenu("competitions")}
            >
              <GiLaurelsTrophy className="mr-2" />
              Competitions
              <span className="ml-auto">
                {activeItem === "competitions" ? (
                  <BsChevronDoubleUp />
                ) : (
                  <BsChevronDoubleDown />
                )}
              </span>
            </li>
            {activeItem === "competitions" && (
              <ul className="pl-6 mt-2">
                {[
                  { name: "VEX IQ", path: "/Dashboard/Admin/Compitions/VexIQ" },
                  { name: "VEX V5", path: "/Dashboard/Admin/Compitions/VexV5" },
                  {
                    name: "Electronics & Arduino",
                    path: "/Dashboard/Admin/Compitions/ElectronicsArduino",
                  },
                  {
                    name: "Artificial Intelligence",
                    path: "/Dashboard/Admin/Compitions/AI",
                  },
                  {
                    name: "Web Design",
                    path: "/Dashboard/Admin/Compitions/WebDesign",
                  },
                  {
                    name: "Mobile Application",
                    path: "/Dashboard/Admin/Compitions/MobileApp",
                  },
                ].map(({ name, path }) => (
                  <Link key={name} to={path}>
                    <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      {name}
                    </li>
                  </Link>
                ))}
              </ul>
            )}

            {/* Teams */}
            <Link to="/Dashboard/Admin/Teams">
              <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <RiTeamLine className="mr-2" />
                Teams
              </li>
            </Link>

            {/* Management */}
            <li
              className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => toggleSubMenu("management")}
            >
              <RiUserSettingsLine className="mr-2" />
              Management
              <span className="ml-auto">
                {activeItem === "management" ? (
                  <BsChevronDoubleUp />
                ) : (
                  <BsChevronDoubleDown />
                )}
              </span>
            </li>
            {activeItem === "management" && (
              <ul className="pl-6 mt-2">
                {[
                  {
                    name: "Create Competition or Event",
                    path: "/Dashboard/Admin/CreateEvent",
                  },
                  {
                    name: "Create Staff",
                    path: "/Dashboard/Admin/Staff",
                  },
                ].map(({ name, path }) => (
                  <Link key={name} to={path}>
                    <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      {name}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
