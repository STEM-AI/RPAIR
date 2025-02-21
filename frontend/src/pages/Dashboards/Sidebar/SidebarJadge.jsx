import React, { useState } from "react";
import Logo from "../../../assets/logo/logo2.png";
import { MdOutlineDashboard } from "react-icons/md";
import { LiaAngleDoubleDownSolid, LiaAngleDoubleUpSolid } from "react-icons/lia"; 

import { Link, NavLink } from "react-router-dom";
import { LuWrapText } from "react-icons/lu";
import { RiTeamLine, RiUserSettingsLine } from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";
import { TbCalendarEvent } from "react-icons/tb";
import { MdOutlineEventNote } from "react-icons/md";


const SidebarJadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isMainNavOpen, setIsMainNavOpen] = useState(false); 
  const [isEventOpen, setIsEventOpen] = useState(false); 
  

  const toggleSubMenu = (item) => {
    setActiveItem((prev) => (prev === item ? null : item));
  };

  return (
    <div className="relative top-0 left-0 h-full  ">
     {/* Hamburger button to toggle sidebar visibility */}
      <button
        className="lg:hidden fixed top-9 left-4  z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="group flex h-8 w-8 items-center justify-center bg-white  p-1 hover:bg-slate-200">
          <div className="space-y-1 ">
            <span
              className={`block h-0.5 w-6 rounded-full bg-slate-500 transition-transform ease-in-out ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 rounded-full bg-slate-500 transition-transform ease-in-out ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 rounded-full bg-slate-500 transition-transform ease-in-out ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-r from-cyan-800 to-cyan-500 text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "w-64" : "w-0"
        } lg:w-64 lg:block lg:static`}
      >
        {/* Logo */}
        <NavLink to={"/"}>
        <div className="w-full h-32 flex justify-center items-center py-4">
        <img src={Logo} alt="Logo" className="max-w-full max-h-full object-contain" />
        </div></NavLink>

        {/* Main items list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
              {/* Main Nav */}
                      <div className="border-b block md:hidden  border-white mb-2">
                        <li
                          className=" flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
                          onClick={() => setIsMainNavOpen(!isMainNavOpen)} // Toggle the management sub-menu
                        >
                          <LuWrapText className="mr-2" />
            
                          Main menu
                          {isMainNavOpen ? (
                            <LiaAngleDoubleUpSolid className="ml-2" /> // Show double up icon when open
                          ) : (
                            <LiaAngleDoubleDownSolid className="ml-2" /> // Show double down icon when closed
                          )}
                        </li>
                        {/* Management Sub-menu */}
                        {isMainNavOpen && (
                          <ul className="pl-6 mb-3">
                            <Link  to={"/"}>
                              <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                Home
                              </li>
                            </Link>
                            <Link to={"/about"}>
                              <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                About
                              </li>
                            </Link>
                              
                            <Link to={"/gallery"}>
                              <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                                Gallery
                              </li>
                            </Link>
                            
                          </ul>
                        )}
                      </div>
            
            {/* Dashboard */}
            <Link to="/Dashboard/JudgeEvent">
              <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <MdOutlineDashboard className="mr-2" />
                Dashboard
              </li>
            </Link>
            <Link to="/Dashboard/Judge">
              <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <MdOutlineEventNote className="mr-2" />
                Event Details
              </li>
            </Link>
            
            {/* Event */}
              <li
                className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setIsEventOpen(!isEventOpen)} // Toggle the management sub-menu
              >
                <TbCalendarEvent className="mr-2" />
                Event
                {isEventOpen ? (
                  <LiaAngleDoubleUpSolid className="ml-2" /> // Show double up icon when open
                ) : (
                  <LiaAngleDoubleDownSolid className="ml-2" /> // Show double down icon when closed
                )}
              </li>
              {/* Management Sub-menu */}
              {isEventOpen && (
                <ul className="pl-6 mt-2">
                  <Link to="/Dashboard/Judge/inspection">
                    <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Robot Inspection
                    </li>
                  </Link>
                  <Link to="/Dashboard/Judge/matches">
                    <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      Matches
                    </li>
                  </Link>
                  <Link to="/Dashboard/Judge/Notebook">
                    <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      Engineering Notebook
                    </li>
                  </Link>
                  <Link to="/Dashboard/Judge/interview">
                    <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      Team Interview
                    </li>
                  </Link>
                  
                </ul>
              )}
            <Link to="/Dashboard/Judge">
              <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <RiTeamLine className="mr-2" />
                Teams
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarJadge;
