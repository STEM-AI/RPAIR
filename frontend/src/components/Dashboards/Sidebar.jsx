
import React, { useState } from "react";
import Logo from "../../assets/logo/logo2.png"
import { MdOutlineDashboard } from "react-icons/md";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs"; 
import { RiTeamLine ,  RiUserSettingsLine} from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";





const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [activeItem, setActiveItem] = useState(null); 

  
  const toggleSubMenu = (item) => {
    setActiveItem((prev) => (prev === item ? null : item));
  };

  const handleItemClick = (item) => {
    console.log(`${item} clicked!`);
  };

  return (
    <div className="relative">
      {/* زر البرجر لفتح الـ Sidebar */}
      <button
        className="lg:hidden p-4 text-white bg-blue-900 fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons">menu</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-r from-cyan-800 to-teal-500 text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "w-64" : "w-0"
        } lg:w-64 lg:block lg:static`}
      >
        {/* Logo */}
        <div className="w-full h-32 flex justify-center items-center py-4">
          <img src={Logo} alt="Logo" className="max-w-full max-h-full object-contain" />
        </div>

        {/* قائمة العناصر الرئيسية */}
        <div className="flex-1">
          <ul className="space-y-2 p-4">
            <li
              className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleItemClick("Dashboard")}
            >
              <MdOutlineDashboard className="mr-2" />
              Dashboard
            </li>

            {/* Competitions */}
            <li
              className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => toggleSubMenu("competitions")}
            >
              <GiLaurelsTrophy className="mr-2" />

              Competitions
              {/* تغيير الأيقونة حسب حالة القائمة */}
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
                <li
                  className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleItemClick("Sub-item 1")}
                >
                  Sub-item 1
                </li>
                <li
                  className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleItemClick("Sub-item 2")}
                >
                  Sub-item 2
                </li>
                <li
                  className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleItemClick("Sub-item 3")}
                >
                  Sub-item 3
                </li>
              </ul>
            )}

            {/* Teams */}
            <li
              className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => toggleSubMenu("teams")}
            >
              <RiTeamLine className="mr-2" />

              Teams
              {/* تغيير الأيقونة حسب حالة القائمة */}
              <span className="ml-auto">
                {activeItem === "teams" ? (
                  <BsChevronDoubleUp />
                ) : (
                  <BsChevronDoubleDown />
                )}
              </span>
            </li>
            {activeItem === "teams" && (
              <ul className="pl-6 mt-2">
                <li
                  className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleItemClick("Sub-item 1")}
                >
                  Sub-item 1
                </li>
                <li
                  className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleItemClick("Sub-item 2")}
                >
                  Sub-item 2
                </li>
                <li
                  className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleItemClick("Sub-item 3")}
                >
                  Sub-item 3
                </li>
              </ul>
            )}

            {/* Management */}
            <li
              className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleItemClick("Management")}
            >
              <RiUserSettingsLine className="mr-2" />

              Management
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
