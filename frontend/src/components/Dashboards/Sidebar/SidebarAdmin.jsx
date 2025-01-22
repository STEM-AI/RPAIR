import React, { useState } from "react";
import Logo from "../../../assets/logo/logo2.png";
import { MdOutlineDashboard } from "react-icons/md";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs";
import { RiTeamLine, RiUserSettingsLine } from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const toggleSubMenu = (item) => {
    setActiveItem((prev) => (prev === item ? null : item));
  };

  return (
    <div className="relative">
      {/* Hamburger button to toggle sidebar visibility */}
         {/* Hamburger button */}
         <button
  className="lg:hidden fixed top-4 left-4 z-50"
  onClick={() => setIsOpen(!isOpen)}
>
  <div className="group flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg p-1 hover:bg-slate-200">
    <div className="space-y-1">
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
        onClick={() => {
          toggleSubMenu("competitions"); 
          navigate("/Dashboard/Admin/Competitions"); 
        }}
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
            { name: "VEX IQ", path: "/Dashboard/Admin/Competitions/VexIQ" },
            { name: "VEX V5", path: "/Dashboard/Admin/Competitions/VexV5" },
            {
              name: "Electronics & Arduino",
              path: "/Dashboard/Admin/Competitions/ElectronicsArduino",
            },
            {
              name: "Artificial Intelligence",
              path: "/Dashboard/Admin/Competitions/AI",
            },
            {
              name: "Web Design",
              path: "/Dashboard/Admin/Competitions/WebDesign",
            },
            {
              name: "Mobile Application",
              path: "/Dashboard/Admin/Competitions/MobileApp",
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
                  // {
                  //   name: "Create Organization ",
                  //   path: "/Dashboard/Admin/CreateOrganization",
                  // },
                  {
                    name: "Create Event",
                    path: "/Dashboard/Admin/CreateEvent",
                  },

                  {
                    name: "Create Judge",
                    path: "/Dashboard/Admin/CreateStaff",
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

