import React, { useEffect, useState } from "react";
import logo from "../../assets/logo/logoWrite-re.png";
import logoBlack from "../../assets/logo/logo2.png";
import { useLocation, NavLink, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChallengesOpen, setIsChallengesOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const homeSection = document.getElementById("home-section");
            if (homeSection) {
                const homeBottom = homeSection.getBoundingClientRect().bottom;
                setIsScrolled(homeBottom <= 0);
            }
        };

        // Check login status based on token
        const checkLogin = () => {
            const token = localStorage.getItem("access_token");
            setIsLoggedIn(!!token);
        };

        window.addEventListener("scroll", handleScroll);
        checkLogin(); // Run on component mount

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleChallenges = () => {
        setIsChallengesOpen(!isChallengesOpen);
        setIsResourcesOpen(false);
    };

    const toggleResources = () => {
        setIsResourcesOpen(!isResourcesOpen);
        setIsChallengesOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        setIsLoggedIn(false);
    };
    

    return (
        <nav className={`fixed left-0 right-0 z-50 shadow-lg px-5 md:px-10 py-3 flex items-center justify-between 
            ${isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)]"}
            ${location.pathname === "/" ? "bg-[rgba(0,0,0,0.183)] " : "bg-white "}
            transition-colors duration-300`}
        >
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <NavLink to={"/"}>
                    <img
                        src={location.pathname === "/" ? (isScrolled ? logoBlack : logo) : logoBlack}
                        alt="Rpair-Logo"
                        className="h-20 w-auto p-2 rounded-full"
                    />
                </NavLink>
            </div>

            {/* Hamburger Menu Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden text-cyan-500 focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Navigation Links */}
            <div
                className={`${isMenuOpen ? "block " : "hidden"} md:flex md:items-center space-y-4 py-4 md:space-y-0 md:space-x-6 mt-1 mr-2 absolute md:static top-full rounded-lg right-0 w-80 md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300`}
            >
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
                            ${isChallengesOpen ? 'scale-100 opacity-100 z-10' : 'opacity-0'}
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
                            ${isResourcesOpen ? 'scale-100 opacity-100 z-10' : 'opacity-0'}
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
                {/* Login Button or Profile in Menu */}
                

                
                
            </div>

           {/* Login or Profile Icon */}
            <div className="hidden md:flex items-center space-x-4">
                {isLoggedIn ? (
                    <div className="relative">
                        <FaUserCircle className="text-cyan-500 text-3xl cursor-pointer" />
                        <div className="absolute  right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 hover:opacity-100 "> 
                            <NavLink
                                to="/Dashboard/Admin"
                                className="block w-full px-4 py-2 text-left text-cyan-500 hover:bg-cyan-50 transition-all"
                            >
                                Profile
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="block  w-full px-4 py-2 text-left text-cyan-500 hover:bg-cyan-50 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link
                        to={"/login"}
                        className="border border-cyan-500 text-cyan-500 uppercase px-4 py-2 rounded-md hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105"
                    >
                        Login
                    </Link>
                )}
            </div>

        </nav>
    );
}

