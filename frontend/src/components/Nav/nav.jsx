import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/Static/logoWrite-re.png";
import logoBlack from "../../assets/Static/logo2.png";
import { useLocation, NavLink, Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { getTokens, clearTokens, isTokenExpired, refreshAccessToken } from '../../pages/Auth/auth';
import { NavHashLink } from 'react-router-hash-link';
import { BiSolidMessageAdd } from "react-icons/bi";





export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    challenges: false,
    resources: false,
    notifications: false,
    profile: false
  });

  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const challengesDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home-section");
      if (homeSection) {
        const homeBottom = homeSection.getBoundingClientRect().bottom;
        setIsScrolled(homeBottom <= 0);
      }
    };

    const checkLoginStatus = async () => {
      const { access_token } = getTokens();
      
      if (!access_token) {
        setIsLoggedIn(false);
        return;
      }

      if (isTokenExpired(access_token)) {
        // محاولة تجديد الـ access token باستخدام الـ refresh token
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken) {
          // تم تجديد الـ access token بنجاح
          setIsLoggedIn(true);
        } else {
          // فشل تجديد الـ token، قم بتسجيل الخروج
          handleLogout();
        }
      } else {
        // الـ access token صالح
        setIsLoggedIn(true);
      }
    };

    const handleClickOutside = (event) => {
      if (
        challengesDropdownRef.current && 
        !challengesDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, challenges: false }));
      }
      if (
        resourcesDropdownRef.current && 
        !resourcesDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, resources: false }));
      }
      if (
        notificationDropdownRef.current && 
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, notifications: false }));
      }
      if (
        profileDropdownRef.current && 
        !profileDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, profile: false }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkLoginStatus();
    
    // التحقق كل 4 دقائق (240000 مللي ثانية)
    // نختار 4 دقائق لنضمن تجديد التوكن قبل انتهاء صلاحيته (عادةً 5 دقائق)
    const tokenCheckInterval = setInterval(checkLoginStatus, 240000);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(tokenCheckInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userRole = JSON.parse(localStorage.getItem("user_role"));
  const Url = userRole
    ? userRole.is_superuser
      ? "/Dashboard/Admin"
      : userRole.is_staff && !userRole.is_superuser
      ? "/Dashboard/JudgeEvent"
      : "/Dashboard/User"
    : "/";


  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem("user_role");
    sessionStorage.removeItem("hasRefreshed");
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdownToggle = (dropdown) => {
    setDropdowns((prevState) => ({
      ...prevState,
      challenges: false,
      resources: false,
      notifications: false,
      profile: false,
      [dropdown]: !prevState[dropdown]
    }));
  };

  const handleItemClick = (link) => {
    setDropdowns({
      challenges: false,
      resources: false,
      notifications: false,
      profile: false
    });
    navigate(link);
  };

  return (
    <nav className={` z-50 shadow-lg px-5  md:px-10 py-2 flex items-center justify-between 
      ${isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)] "}
      ${location.pathname === "/" || location.pathname === "/competitions/ComingSoon" ? "bg-[rgba(0,0,0,0.183)] fixed left-0 right-0 " :  "sticky top-0 bg-white "}
      transition-colors duration-300`}>
      <div className="flex items-center space-x-3">
        <NavLink to={"/"}>
          <img
            src={location.pathname === "/" || location.pathname === "/competitions/ComingSoon" ? (isScrolled ? logoBlack : logo) : logoBlack}
            alt="Rpair-Logo"
            className="h-20 w-auto p-2 rounded-full"
          />
        </NavLink>
      </div>

      <button
        onClick={toggleMenu}
        className="md:hidden p-3 ml-auto mr-4 focus:outline-none"
      >
        <GiHamburgerMenu className="text-5xl text-cyan-500 hover:text-cyan-950 transition-all duration-300 transform hover:scale-105" />
      </button>

      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:flex md:items-center space-y-4 py-4 md:space-y-0 md:space-x-6 mt-1 mr-2 absolute md:static top-full rounded-lg right-0 w-80 md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300`}>
        <NavHashLink to={"/#home-section"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          Home
        </NavHashLink>
        <NavHashLink to={"/#about"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          About
        </NavHashLink>

        <div className="relative group w-full" ref={challengesDropdownRef}>
          <button
            onClick={() => handleDropdownToggle("challenges")}
            className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
            Challenges
          </button>
          {dropdowns.challenges && (
            <ul className={`absolute z-50 left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95 transition-transform duration-300 ease-out origin-top`}>
              {[
                { name: "Robotics", link: "/Robotics/Vex" },
                { name: "Web Design", link: "/competitions/ComingSoon" },
                { name: "Open Source", link: "/competitions/OpenSource" },
                { name: "Mobile Application", link: "/competitions/ComingSoon" },
                { name: "Programming", link: "/competitions/ComingSoon" },
                { name: "Artificial Intelligence", link: "/competitions/ComingSoon" },
                { name: "Fablab", link: "/competitions/ComingSoon" },
                { name: "ST Math", link: "/competitions/ComingSoon" },
                { name: "Graphic Design", link: "/competitions/ComingSoon" }
              ].map((item, index) => (
                <li key={index} className="hover:bg-cyan-50 transition-all duration-300">
                  <div
                    className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105 cursor-pointer transition-all duration-300"
                    onClick={() => handleItemClick(item.link)}
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative group w-full" ref={resourcesDropdownRef}>
          <button
            onClick={() => handleDropdownToggle("resources")}
            className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
            Resources
          </button>
          {dropdowns.resources && (
            <ul className={`absolute z-50 left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95 transition-transform duration-300 ease-out origin-top`}>
              {["Volunteering", "Event"].map((item, index) => (
                <li key={index} className="hover:bg-cyan-50 transition-all duration-300">
                  <div
                    className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105 cursor-pointer transition-all duration-300"
                    onClick={() => handleItemClick(`/resources/${item.toLowerCase()}`)}
                  >
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <NavLink to={"/gallery"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          Gallery
        </NavLink>

        <NavLink 
  to={"/live-events"} 
  className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300"
>
  Live 
</NavLink>
      </div>

      <div className="md:flex items-center flex-row space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center">
            <div className="relative mr-4" ref={notificationDropdownRef}>
              <button
                className="p-3 bg-gray-200 rounded-full hover:bg-cyan-950 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDropdownToggle("notifications")}>
                <IoMdNotificationsOutline className="text-2xl text-cyan-500 font-extrabold hover:text-white transition-all duration-300 transform hover:scale-105" />
              </button>
              {dropdowns.notifications && (
                <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50 transition-all duration-300">
                  <p className="text-gray-700 font-bold border-b pb-2">Notifications</p>
                  <div className="mt-2">
                    <p className="text-gray-600 text-sm">You have no new notifications.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative top-0" ref={profileDropdownRef}>
              <button
                className="p-3 bg-gray-200 rounded-full hover:bg-cyan-950 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDropdownToggle("profile")}>
                <BsFillPersonFill className="text-2xl text-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105" />
              </button>
              {dropdowns.profile && (
                 <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
                                  <NavLink to={Url} className="flex items-center text-gray-600 py-2 px-1 cursor-pointer hover:bg-gray-100">
                                    <BsFillPersonFill className="text-2xl mx-2" />
                                    <span className="text-lg">Dashboard</span>
                                  </NavLink>
                  {userRole.is_superuser &&
                  
                                  <NavLink to ={'/Dashboard/AddNews'} className="flex items-center text-gray-600 py-2 px-1 cursor-pointer hover:bg-gray-100">
                                    <BiSolidMessageAdd className="text-2xl mx-2" />
                                    <span className="text-lg">Add News</span>
                                  </NavLink>
                  }
                  
                                  <NavLink to={'/Dashboard/AccountSetting'} className="flex items-center text-gray-600 py-2 px-1 cursor-pointer hover:bg-gray-100">
                                    <IoSettingsOutline className="text-2xl mx-2" />
                                    <span className="text-lg">Account Settings</span>
                                  </NavLink>
                  
                                  <hr />
                                   <div className="flex items-center text-gray-600 py-2 px-1 transition-all duration-300">
                    <CiLogout className="text-2xl mx-2" />
                    <button className="text-lg" onClick={handleLogout}>Log Out</button>
                  </div>
                </div>
                 
              )}
            </div>
          </div>
        ) : (
          <Link
            to={"/login"}
            className="border border-cyan-500 text-cyan-500 uppercase px-4 py-2 rounded-md hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105">
            Login
          </Link>
        )}
      </div>
      
    </nav>
  );
}
/*

import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/Static/logoWrite-re.png";
import logoBlack from "../../assets/Static/logo2.png";
import { useLocation, NavLink, Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { getTokens, clearTokens, isTokenExpired, refreshAccessToken } from '../../pages/Auth/auth';
import { NavHashLink } from 'react-router-hash-link';
import { BiSolidMessageAdd } from "react-icons/bi";





export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mobileMenuRef = useRef(null); // أضف هذا مع الـ refs الأخرى
  const [dropdowns, setDropdowns] = useState({
    challenges: false,
    resources: false,
    notifications: false,
    profile: false
  });

  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const challengesDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home-section");
      if (homeSection) {
        const homeBottom = homeSection.getBoundingClientRect().bottom;
        setIsScrolled(homeBottom <= 0);
      }
    };

    const checkLoginStatus = async () => {
      const { access_token } = getTokens();
      
      if (!access_token) {
        setIsLoggedIn(false);
        return;
      }

      if (isTokenExpired(access_token)) {
        // محاولة تجديد الـ access token باستخدام الـ refresh token
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken) {
          // تم تجديد الـ access token بنجاح
          setIsLoggedIn(true);
        } else {
          // فشل تجديد الـ token، قم بتسجيل الخروج
          handleLogout();
        }
      } else {
        // الـ access token صالح
        setIsLoggedIn(true);
      }
    };

    const handleClickOutside = (event) => {
      if (
        challengesDropdownRef.current && 
        !challengesDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, challenges: false }));
      }
      if (
        resourcesDropdownRef.current && 
        !resourcesDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, resources: false }));
      }
      if (
        notificationDropdownRef.current && 
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setDropdowns(prev => ({ ...prev, notifications: false }));
      }
      if (
        profileDropdownRef.current && 
        !profileDropdownRef.current.contains(event.target)
      )
       if (
    mobileMenuRef.current && 
    !mobileMenuRef.current.contains(event.target) &&
    !event.target.closest('button[aria-label="Menu"]') // استبدل بآيدي الزر إن لزم
  ) {
    setIsMenuOpen(false);
  }{
        setDropdowns(prev => ({ ...prev, profile: false }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkLoginStatus();
    
    // التحقق كل 4 دقائق (240000 مللي ثانية)
    // نختار 4 دقائق لنضمن تجديد التوكن قبل انتهاء صلاحيته (عادةً 5 دقائق)
    const tokenCheckInterval = setInterval(checkLoginStatus, 240000);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(tokenCheckInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userRole = JSON.parse(localStorage.getItem("user_role"));
  const Url = userRole
    ? userRole.is_superuser
      ? "/Dashboard/Admin"
      : userRole.is_staff && !userRole.is_superuser
      ? "/Dashboard/JudgeEvent"
      : "/Dashboard/User"
    : "/";


  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem("user_role");
    sessionStorage.removeItem("hasRefreshed");
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdownToggle = (dropdown) => {
    setDropdowns((prevState) => ({
      ...prevState,
      challenges: false,
      resources: false,
      notifications: false,
      profile: false,
      
      [dropdown]: !prevState[dropdown]
    }));
  };

  const handleItemClick = (link) => {
    setDropdowns({
      challenges: false,
      resources: false,
      notifications: false,
      profile: false,
    });
      setIsMenuOpen(false); // إغلاق القائمة المتنقلة

    navigate(link);
  };

  return (
    <nav className={` z-50 shadow-lg px-5  md:px-10 py-2 flex items-center justify-between 
      ${isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)] "}
      ${location.pathname === "/" || location.pathname === "/competitions/ComingSoon" ? "bg-[rgba(0,0,0,0.183)] fixed left-0 right-0 " :  "sticky top-0 bg-white "}
      transition-colors duration-300`}>
      <div className="flex items-center space-x-3">
        <NavLink to={"/"}>
          <img
            src={location.pathname === "/" || location.pathname === "/competitions/ComingSoon" ? (isScrolled ? logoBlack : logo) : logoBlack}
            alt="Rpair-Logo"
            className="h-20 w-auto p-2 rounded-full"
          />
        </NavLink>
      </div>

      <button
        onClick={toggleMenu}
          aria-label="Menu" // أضف هذا السطر
        className="md:hidden p-3 ml-auto mr-4 focus:outline-none"
      >
        <GiHamburgerMenu className="text-5xl text-cyan-500 hover:text-cyan-950 transition-all duration-300 transform hover:scale-105" />
      </button>

      <div
          ref={mobileMenuRef} // أضف هذا السطر
        className={`${isMenuOpen ? "block" : "hidden"} md:flex md:items-center space-y-4 py-4 md:space-y-0 md:space-x-6 mt-1 mr-2 absolute md:static top-full rounded-lg right-0 w-80 md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300`}>
        <NavHashLink to={"/#home-section"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          Home
        </NavHashLink>
        <NavHashLink to={"/#about"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          About
        </NavHashLink>

        <div className="relative group w-full" ref={challengesDropdownRef}>
          <button
            onClick={() => handleDropdownToggle("challenges")}
            className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
            Challenges
          </button>
          {dropdowns.challenges && (
            <ul className={`absolute z-50 left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95 transition-transform duration-300 ease-out origin-top`}>
              {[
                { name: "Robotics", link: "/Robotics/Vex" },
                { name: "Web Design", link: "/competitions/ComingSoon" },
                { name: "Open Source", link: "/competitions/OpenSource" },
                { name: "Mobile Application", link: "/competitions/ComingSoon" },
                { name: "Programming", link: "/competitions/ComingSoon" },
                { name: "Artificial Intelligence", link: "/competitions/ComingSoon" },
                { name: "Fablab", link: "/competitions/ComingSoon" },
                { name: "ST Math", link: "/competitions/ComingSoon" },
                { name: "Graphic Design", link: "/competitions/ComingSoon" }
              ].map((item, index) => (
                <li key={index} className="hover:bg-cyan-50 transition-all duration-300">
                  <div
                    className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105 cursor-pointer transition-all duration-300"
                    onClick={() => handleItemClick(item.link)}
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative group w-full" ref={resourcesDropdownRef}>
          <button
            onClick={() => handleDropdownToggle("resources")}
            className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
            Resources
          </button>
          {dropdowns.resources && (
            <ul className={`absolute z-50 left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95 transition-transform duration-300 ease-out origin-top`}>
              {["Volunteering", "Event"].map((item, index) => (
                <li key={index} className="hover:bg-cyan-50 transition-all duration-300">
                  <div
                    className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105 cursor-pointer transition-all duration-300"
                    onClick={() => handleItemClick(`/resources/${item.toLowerCase()}`)}
                  >
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <NavLink to={"/gallery"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          Gallery
        </NavLink>
      </div>

      <div className="md:flex items-center flex-row space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center">
            <div className="relative mr-4" ref={notificationDropdownRef}>
              <button
                className="p-3 bg-gray-200 rounded-full hover:bg-cyan-950 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDropdownToggle("notifications")}>
                <IoMdNotificationsOutline className="text-2xl text-cyan-500 font-extrabold hover:text-white transition-all duration-300 transform hover:scale-105" />
              </button>
              {dropdowns.notifications && (
                <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50 transition-all duration-300">
                  <p className="text-gray-700 font-bold border-b pb-2">Notifications</p>
                  <div className="mt-2">
                    <p className="text-gray-600 text-sm">You have no new notifications.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative top-0" ref={profileDropdownRef}>
              <button
                className="p-3 bg-gray-200 rounded-full hover:bg-cyan-950 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDropdownToggle("profile")}>
                <BsFillPersonFill className="text-2xl text-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105" />
              </button>
              {dropdowns.profile && (
                 <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
                                  <NavLink to={Url} className="flex items-center text-gray-600 py-2 px-1 cursor-pointer hover:bg-gray-100">
                                    <BsFillPersonFill className="text-2xl mx-2" />
                                    <span className="text-lg">Dashboard</span>
                                  </NavLink>
                  {userRole.is_superuser &&
                  
                                  <NavLink to ={'/Dashboard/AddNews'} className="flex items-center text-gray-600 py-2 px-1 cursor-pointer hover:bg-gray-100">
                                    <BiSolidMessageAdd className="text-2xl mx-2" />
                                    <span className="text-lg">Add News</span>
                                  </NavLink>
                  }
                  
                                  <NavLink to={'/Dashboard/AccountSetting'} className="flex items-center text-gray-600 py-2 px-1 cursor-pointer hover:bg-gray-100">
                                    <IoSettingsOutline className="text-2xl mx-2" />
                                    <span className="text-lg">Account Settings</span>
                                  </NavLink>
                  
                                  <hr />
                                   <div className="flex items-center text-gray-600 py-2 px-1 transition-all duration-300">
                    <CiLogout className="text-2xl mx-2" />
                    <button className="text-lg" onClick={handleLogout}>Log Out</button>
                  </div>
                </div>
                 
              )}
            </div>
          </div>
        ) : (
          <Link
            to={"/login"}
            className="border border-cyan-500 text-cyan-500 uppercase px-4 py-2 rounded-md hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105">
            Login
          </Link>
        )}
      </div>
      
    </nav>
  );
}

*/