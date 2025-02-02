import React, { useState, useRef, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { Navigate, NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [navigate, setNavigate] = useState(null);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
        notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close ProfileDropdown when Notifications icon is clicked
  const handleNotificationClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsProfileDropdownOpen(false); // Close ProfileDropdown when Notifications is clicked
  };

  // Close NotificationDropdown when Profile icon is clicked
  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen); // Toggle ProfileDropdown
    setIsDropdownOpen(false); // Close NotificationDropdown when Profile is clicked
  };
  
  const handleSignOut = () => {
      setNavigate("/login");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
  };
  if (navigate) {
          return <Navigate to={navigate} />;
  }
  
    const toggleChallenges = () => {
        setIsChallengesOpen(!isChallengesOpen);
        setIsResourcesOpen(false);
    };

    const toggleResources = () => {
        setIsResourcesOpen(!isResourcesOpen);
        setIsChallengesOpen(false);
    };
  

  return (
        <div className="flex items-center justify-between bg-white ps-12  p-4 shadow-md w-full">
      {/* Navigation Links */}
      <div className="flex items-center justify-center ml-auto space-x-6">
        <NavLink
          to={"/"}
          className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
        >
          Home
        </NavLink>
        <NavLink
          to={"/about"}
          className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
        >
          About
        </NavLink>
         {/* Challenges Dropdown */}
          <div className="relative group w-full ">
              <button 
                  onClick={toggleChallenges}
                  className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"                    >
                  Challenges
              </button>
              <ul
                  className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95 
                      ${isChallengesOpen ? 'scale-100 block z-10' : 'hidden'}
                      transition-transform duration-300 ease-out origin-top`}
              >
                  {[
                      "Vex IQ",
                      "Vex V5",
                      "Web Design",
                      "Open Source",
                      "Mobile Application",
                      "Programming",
                      "Arduino",
                  ].map((item, index) => (
                      <li key={index} className="hover:bg-cyan-50">
                          <NavLink
                              to={`/competitions`}
                              className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105"
                          >
                              {item}
                          </NavLink>
                      </li>
                  ))}
              </ul>
          </div>

          {/* Resources Dropdown */}
          <div className="relative group">
              <button 
                  onClick={toggleResources}
                  className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"      
              >
                  Resources
              </button>
              <ul
                  className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95 
                      ${isResourcesOpen ? 'scale-100 block z-10' : 'hidden'}
                      transition-transform duration-300 ease-out origin-top`}
              >
                  {["Volunteering", "Event"].map((item, index) => (
                      <li key={index} className="hover:bg-cyan-50">
                          <NavLink
                              to={`/resources/${item.toLowerCase()}`}
                              className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105"
                          >
                              {item}
                          </NavLink>
                      </li>
                  ))}
              </ul>
          </div>
        <NavLink
          to={"/gallery"}
          className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
        >
          Gallery
        </NavLink>
      </div>

      {/* Notification and Profile Section */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Notification Section */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            onClick={handleNotificationClick}
          >
            <IoMdNotificationsOutline className="text-2xl text-gray-500" />
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
              <p className="text-gray-700 font-bold border-b pb-2">Notifications</p>
              <div className="mt-2">
                <p className="text-gray-600 text-sm">You have no new notifications.</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            onClick={handleProfileClick}
          >
            <BsFillPersonFill className="text-2xl text-gray-500" />
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
              <p className="flex items-center text-gray-600 py-2 px-1">
                <IoSettingsOutline className="text-2xl mx-2" />
                <span className="text-lg">Account Settings</span>
              </p>
              <hr />
              <div className="flex items-center text-gray-600 py-2 px-1">
                <CiLogout className="text-2xl mx-2" />
                <button className="text-lg" onClick={handleSignOut}>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Navbar;
