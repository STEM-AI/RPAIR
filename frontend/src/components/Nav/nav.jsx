import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo/logoWrite-re.png";
import logoBlack from "../../assets/logo/logo2.png";
import { useLocation, NavLink, Link,Navigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";



export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
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

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home-section");
      if (homeSection) {
        const homeBottom = homeSection.getBoundingClientRect().bottom;
        setIsScrolled(homeBottom <= 0);
      }
    };
    const checkLogin = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("scroll", handleScroll);
    checkLogin(); // Run on component mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  const userRole = JSON.parse(localStorage.getItem("user_role"));
  const Url = userRole
    ? userRole.is_superuser
      ? "/Dashboard/Admin"
      : userRole.is_staff && !userRole.is_judge
      ? "/Dashboard/Judge"
      : "/Dashboard/User"
    : "/";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
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
      // Close all dropdowns first, then toggle the selected one
      challenges: false,
      resources: false,
      notifications: false,
      profile: false,
      [dropdown]: !prevState[dropdown] // Toggle the selected dropdown
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
        notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)
      ) {
        setDropdowns((prevState) => ({
          challenges: false,
          resources: false,
          notifications: false,
          profile: false
        }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`fixed left-0 right-0 z-50 shadow-lg px-5  md:px-10 py-2 flex items-center justify-between 
      ${isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)]"}
      ${location.pathname === "/" ? "bg-[rgba(0,0,0,0.183)] " : "bg-white "}
      transition-colors duration-300`}>
      <div className="flex items-center space-x-3">
        <NavLink to={"/"}>
          <img
            src={location.pathname === "/" ? (isScrolled ? logoBlack : logo) : logoBlack}
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
        <NavLink to={"/"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          Home
        </NavLink>
        <NavLink to={"/about"} className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
          About
        </NavLink>

        <div className="relative group w-full">
          <button
            onClick={() => handleDropdownToggle("challenges")}
            className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
            Challenges
          </button>
          <ul
            className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95
              ${dropdowns.challenges ? 'scale-100 opacity-100 z-10' : 'opacity-0'}
              transition-transform duration-300 ease-out origin-top`}>
            {["Vex IQ", "Vex V5", "Web Design", "Open Source", "Mobile Application", "Programming", "Arduino"].map((item, index) => (
              <li key={index} className="hover:bg-cyan-50">
                <NavLink to={`/competitions`} className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105">
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative group">
          <button
            onClick={() => handleDropdownToggle("resources")}
            className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300">
            Resources
          </button>
          <ul
            className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95
              ${dropdowns.resources ? 'scale-100 opacity-100 z-10' : 'opacity-0'}
              transition-transform duration-300 ease-out origin-top`}>
              
            {["Volunteering", "Event"].map((item, index) => (
              <li key={index} className="hover:bg-cyan-50">
                <NavLink to={`/resources/${item.toLowerCase()}`} className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105">
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>
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
                <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
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
                  <NavLink to={Url} className="flex items-center text-gray-600 py-2 px-1">
                    <BsFillPersonFill className="text-2xl mx-2" />
                    <span className="text-lg">My Account</span>
                  </NavLink>
                  <p className="flex items-center text-gray-600 py-2 px-1">
                    <IoSettingsOutline className="text-2xl mx-2" />
                    <span className="text-lg">Account Settings</span>
                  </p>
                  <hr />
                  <div className="flex items-center text-gray-600 py-2 px-1">
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


// export default function Navbar() {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isChallengesOpen, setIsChallengesOpen] = useState(false);
//     const [isResourcesOpen, setIsResourcesOpen] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
//     const location = useLocation();
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//       const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//     //   const [navigate, setNavigate] = useState(null);
//      const navigate = useNavigate();
//       const profileDropdownRef = useRef(null);
//       const notificationDropdownRef = useRef(null);

//       useEffect(() => {
//           const handleScroll = () => {
//               const homeSection = document.getElementById("home-section");
//               if (homeSection) {
//                   const homeBottom = homeSection.getBoundingClientRect().bottom;
//                   setIsScrolled(homeBottom <= 0);
//                 }
//             };
            
//             const checkLogin = () => {
//                 const token = localStorage.getItem("access_token");
//                 setIsLoggedIn(!!token);
                
//             };
            
//             window.addEventListener("scroll", handleScroll);
//             checkLogin(); // Run on component mount
            
//             return () => {
//                 window.removeEventListener("scroll", handleScroll);
//             };
//         }, []); // Empty dependency array ensures this effect runs once on mount
        
//         const userRole = JSON.parse(localStorage.getItem("user_role"));
        
//         let Url;
//         if (userRole) {
//             if (userRole.is_superuser) {
//                 Url = "/Dashboard/Admin";
//             } else if (userRole.is_staff && !userRole.is_judge) {
//                 Url = "/Dashboard/Judge";
//             } else {
//                 Url = "/Dashboard/User";
//             }
//         } else {
//             Url = "/";
//         }  
//         const handleLogout = () => {
//             localStorage.removeItem("access_token");
//             localStorage.removeItem("user_role");
//             setIsLoggedIn(false); 
//             navigate("/", { replace: true }); 
//         };
        
        
//         const toggleMenu = () => {
//             setIsMenuOpen(!isMenuOpen);
//         };
//         useEffect(() => {
//             const handleClickOutside = (event) => {
//               if (
//                 profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
//                   notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target) &&
//                   isChallengesOpen.current && !isChallengesOpen.current.contains(event.target) &&  
//                   isResourcesOpen.current && !isResourcesOpen.current.contains(event.target)
//               ) {
//                 setIsDropdownOpen(false);
//                 setIsProfileDropdownOpen(false);
//                   setIsResourcesOpen(false);
//                   setIsChallengesOpen(false);
                  
//               }
//             };
//             document.addEventListener("mousedown", handleClickOutside);
//             return () => document.removeEventListener("mousedown", handleClickOutside);
//         }, []);
        

//     const toggleChallenges = () => {
//         setIsChallengesOpen(!isChallengesOpen);
//         setIsResourcesOpen(false);
//         setIsDropdownOpen(false); // Close NotificationDropdown when Profile is clicked 
//     };

//     const toggleResources = () => {
//         setIsResourcesOpen(!isResourcesOpen);
//         setIsDropdownOpen(false); // Close NotificationDropdown when Profile is clicked
//     };


//     const handleNotificationClick = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     setIsProfileDropdownOpen(false); // Close ProfileDropdown when Notifications is clicked
//   };

//   // Close NotificationDropdown when Profile icon is clicked
//   const handleProfileClick = () => {
//     setIsProfileDropdownOpen(!isProfileDropdownOpen); // Toggle ProfileDropdown
//     setIsDropdownOpen(false); // Close NotificationDropdown when Profile is clicked
//   };
    

//     return (
//         <nav className={`fixed left-0 right-0 z-50 shadow-lg px-5 md:px-10 py-3 flex items-center justify-between 
//             ${isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)]"}
//             ${location.pathname === "/" ? "bg-[rgba(0,0,0,0.183)] " : "bg-white "}
//             transition-colors duration-300`}
//         >
//             {/* Logo */}
//             <div className="flex items-center space-x-3">
//                 <NavLink to={"/"}>
//                     <img
//                         src={location.pathname === "/" ? (isScrolled ? logoBlack : logo) : logoBlack}
//                         alt="Rpair-Logo"
//                         className="h-20 w-auto p-2 rounded-full"
//                     />
//                 </NavLink>
//             </div>

//             {/* Hamburger Menu Button */}
//             <button
//                 onClick={toggleMenu}
//                 className="md:hidden p-3   ml-auto mr-4 focus:outline-none"
//             >
//                 <RxDropdownMenu className="text-5xl text-cyan-500 hover:text-cyan-950 transition-all duration-300 transform hover:scale-105 "/>

                
//             </button>

//             {/* Navigation Links */}
//             <div
//                 className={`${isMenuOpen ? "block " : "hidden"} md:flex md:items-center space-y-4 py-4 md:space-y-0 md:space-x-6 mt-1 mr-2 absolute md:static top-full rounded-lg right-0 w-80 md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300`}
//             >
//                 <NavLink
//                     to={"/"}
//                     className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
//                 >
//                     Home
//                 </NavLink>
//                 <NavLink
//                     to={"/about"}
//                     className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
//                 >
//                     About
//                 </NavLink>
                
//                  {/* Challenges Dropdown */}
//                 <div className="relative group w-full ">
//                     <button
//                         onClick={toggleChallenges}
//                         className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"                    >
//                         Challenges
//                     </button>
//                     <ul
//                         className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95
//                             ${isChallengesOpen ? 'scale-100 opacity-100 z-10' : 'opacity-0'}
//                             transition-transform duration-300 ease-out origin-top`}
//                     >
//                         {[
//                             "Vex IQ",
//                             "Vex V5",
//                             "Web Design",
//                             "Open Source",
//                             "Mobile Application",
//                             "Programming",
//                             "Arduino",
//                         ].map((item, index) => (
//                             <li key={index} className="hover:bg-cyan-50">
//                                 <NavLink
//                                     to={`/competitions`}
//                                     className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105"
//                                 >
//                                     {item}
//                                 </NavLink>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {/* Resources Dropdown */}
//                 <div className="relative group">
//                     <button
//                         onClick={toggleResources}
//                         className="block w-full text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
//                     >
//                         Resources
//                     </button>
//                     <ul
//                         className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform scale-95
//                             ${isResourcesOpen ? 'scale-100 opacity-100 z-10' : 'opacity-0'}
//                             transition-transform duration-300 ease-out origin-top`}
//                     >
//                         {["Volunteering", "Event"].map((item, index) => (
//                             <li key={index} className="hover:bg-cyan-50">
//                                 <NavLink
//                                     to={`/resources/${item.toLowerCase()}`}
//                                     className="block px-4 py-2 text-cyan-500 hover:text-cyan-950 transform hover:scale-105"
//                                 >
//                                     {item}
//                                 </NavLink>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 <NavLink
//                     to={"/gallery"}
//                     className="block text-cyan-500 font-bold text-lg md:text-xl text-center hover:text-cyan-950 transition-all duration-300 transform hover:scale-105"
//                 >
//                     Gallery
//                 </NavLink>
//                 {/* Login Button or Profile in Menu */}
//             </div>

//            {/* Login or Profile Icon */}
//             <div className=" md:flex items-center flex-row space-x-4">
//                 {isLoggedIn ? (
//                     <div className="flex items-center">
//                          {/* Notification Section */}
//                                 <div className="relative mr-4" ref={notificationDropdownRef}>
//                                   <button
//                                     className="p-3 bg-gray-200 rounded-full hover:bg-cyan-950  transition-all duration-300 transform hover:scale-105"
//                                     onClick={handleNotificationClick}
//                                   >
//                                     <IoMdNotificationsOutline className="text-2xl text-cyan-500 font-extrabold hover:text-white transition-all duration-300 transform hover:scale-105" />
//                                   </button>
//                                   {isDropdownOpen && (
//                                     <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
//                                       <p className="text-gray-700 font-bold border-b pb-2">Notifications</p>
//                                       <div className="mt-2">
//                                         <p className="text-gray-600 text-sm">You have no new notifications.</p>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
                        
//                                 {/* Profile Section */}
//                                 <div className="relative top-0" ref={profileDropdownRef}>
//                                   <button
//                                     className="p-3 bg-gray-200 rounded-full hover:bg-cyan-950  transition-all duration-300 transform hover:scale-105"
//                                     onClick={handleProfileClick}
//                                   >
//                                     <BsFillPersonFill className="text-2xl text-cyan-500 hover:text-white transition-all duration-300 transform hover:scale-105" />
//                                   </button>
//                             {isProfileDropdownOpen && (
                                
//                                     <div className="absolute bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 w-80 right-0 mt-2 z-50">
//                                       <NavLink to={`${Url}`} className="flex items-center text-gray-600 py-2 px-1">
//                                         <BsFillPersonFill className="text-2xl mx-2" />
//                                         <span className="text-lg">My Account </span>
//                                       </NavLink>
//                                       <p className="flex items-center text-gray-600 py-2 px-1">
//                                         <IoSettingsOutline className="text-2xl mx-2" />
//                                         <span className="text-lg">Account Settings</span>
//                                       </p>
//                                       <hr />
//                                       <div className="flex items-center text-gray-600 py-2 px-1">
//                                         <CiLogout className="text-2xl mx-2" />
//                                         <button className="text-lg" onClick={handleLogout}>
//                                           Log Out
//                                         </button>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                     </div>
//                 ) : (
//                     <Link
//                         to={"/login"}
//                         className="border border-cyan-500 text-cyan-500 uppercase px-4 py-2 rounded-md hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105"
//                     >
//                         Login
//                     </Link>
//                 )}
//             </div>

//         </nav>
//     );
// }

