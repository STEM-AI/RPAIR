import React, { useState, useEffect } from "react";
import Logo from "../../../assets/Static/logo2.png";
import { MdOutlineDashboard, MdOutlineEventNote } from "react-icons/md";
import { LiaAngleDoubleDownSolid, LiaAngleDoubleUpSolid } from "react-icons/lia"; 
import { RiTeamLine, RiUserSettingsLine } from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LuWrapText } from "react-icons/lu";
import { TbBrandTeams, TbCalendarEvent } from "react-icons/tb";
import { MdGroupAdd } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";



const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isMainNavOpen, setIsMainNavOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from token
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        // Determine user role based on token flags
        if (decodedToken.is_superuser) {
          setUserRole('admin');
        } else if (decodedToken.is_staff) {
          setUserRole('judge');
        } else {
          setUserRole('user');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const renderNavItems = () => {
    switch (userRole) {
      case 'admin':
        return (
          <>
           
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
                      onClick={() => navigate("/Dashboard/Competitions")}
                    >
                      <GiLaurelsTrophy className="mr-2" />
                      Competitions
                    </li>
                    {/* list of judges */}
                    <li
                      className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
                      onClick={() => navigate("/Dashboard/Admin/listJudges")}
                    >
                      <TbBrandTeams className="mr-2" />
                      Judes
                    </li>
        
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
                      onClick={() => setIsManagementOpen(!isManagementOpen)} // Toggle the management sub-menu
                    >
                      <RiUserSettingsLine className="mr-2" />
                      Management
                      {isManagementOpen ? (
                        <LiaAngleDoubleUpSolid className="ml-2" /> // Show double up icon when open
                      ) : (
                        <LiaAngleDoubleDownSolid className="ml-2" /> // Show double down icon when closed
                      )}
                    </li>
                    {/* Management Sub-menu */}
                    {isManagementOpen && (
                      <ul className="pl-6 mt-2">
                        <Link to="/Dashboard/Admin/CreateCompetition">
                          <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            Create Competitions
                          </li>
                        </Link>
                        <Link to="/Dashboard/Admin/CreateEvent">
                          <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            Create Event
                          </li>
                        </Link>
                        <Link to="/Dashboard/Admin/CreateStaff">
                          <li className="hover:text-gray-800 p-2 text-md font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            Create Judge
                          </li>
                        </Link>
                        
                      </ul>
                    )}
          </>
        );

      case 'judge':
        return (
          <>
             {/* Dashboard */}
                        <Link to="/Dashboard/JudgeEvent">
                          <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            <MdOutlineDashboard className="mr-2" />
                            Dashboard
                          </li>
                        </Link>
                       
                        <Link to="/Dashboard/Judge/eventDetails">
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
          </>
        );

      case 'user':
        return (
          <>
            {/* Dashboard */}
                        <Link to="/Dashboard/User">
                          <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            <MdOutlineDashboard className="mr-2" />
                            Dashboard
                          </li>
                        </Link>
                        <li
                      className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer"
                      onClick={() => navigate("/Dashboard/Competitions")}
                    >
                      <GiLaurelsTrophy className="mr-2" />
                      Competitions
                    </li>
                        <Link to="/Dashboard/User/Teams">
                          <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            <FaPeopleGroup className="mr-2" />
                            My Teams
                          </li>
                        </Link>
                        <Link to="/Dashboard/User/CreateTeam">
                          <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                            <MdGroupAdd className="mr-2" />
                            Create Team
                          </li>
                        </Link>

          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative top-0 left-0 h-full">
          {/* Hamburger button to toggle sidebar visibility */}
          <button
            className="lg:hidden fixed top-9 left-4 z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="group flex h-8 w-8 items-center justify-center bg-white shadow-lg p-1 hover:bg-slate-200">
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
            className={` h-full bg-gradient-to-r from-cyan-800 to-cyan-500 text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${
              isOpen ? "w-64" : "w-0"
            } lg:w-64 lg:block lg:static`}
          >
            {/* Logo */}
            <NavLink to={"/"}>
              <div className="w-full h-32 flex justify-center items-center py-4">
                <img src={Logo} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </NavLink>
            
    

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

                    {renderNavItems()}
                  </ul>
                </div>
      </div>
    </div>
  );
};

export default Sidebar;
