import React, { useState } from "react";
import Logo from "../../../assets/logo/logo2.png";
import { MdOutlineDashboard } from "react-icons/md";
import { BsChevronDoubleDown, BsChevronDoubleUp } from "react-icons/bs";
import { RiTeamLine, RiUserSettingsLine } from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";

const SidebarJadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleSubMenu = (item) => {
    setActiveItem((prev) => (prev === item ? null : item));
  };

  return (
    <div className="relative top-0 left-0 h-full  z-50">
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
        <NavLink to={"/"}>
        <div className="w-full h-32 flex justify-center items-center py-4">
        <img src={Logo} alt="Logo" className="max-w-full max-h-full object-contain" />
        </div></NavLink>

        {/* Main items list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            {/* Dashboard */}
            <Link to="/Dashboard/Judge">
              <li className="flex items-center hover:text-gray-800 text-lg font-medium p-2 rounded transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <MdOutlineDashboard className="mr-2" />
                Dashboard
              </li>
            </Link>

           

           

           
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarJadge;
