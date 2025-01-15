import React, { useState, useRef, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md w-full">
      {/* Left Content */}
      <div className="flex items-center">
        {/* You can add content for the left side here if needed */}
      </div>

      {/* Right Content */}
      <div className="flex items-center space-x-6 ml-auto">
        {/* Notification Icon */}
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
              <NavLink to="/login"  className="flex items-center text-gray-600 py-2 px-1">
                <CiLogout className="text-2xl mx-2" />
                <span className="text-lg">Log Out</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
