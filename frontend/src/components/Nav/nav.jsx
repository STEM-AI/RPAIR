import React, { useEffect, useState } from "react";
import logo from "../../assets/logo/logoWrite-re.png";
import logoBlack from "../../assets/logo/logo2.png";
import { useLocation ,NavLink, Link } from "react-router-dom";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();


    useEffect(() => {
        const handleScroll = () => {
        const homeSection = document.getElementById("home-section");

        if (homeSection) {
            const homeBottom = homeSection.getBoundingClientRect().bottom;
            setIsScrolled(homeBottom <= 0);
        }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={` left-0 right-0 z-50 shadow-lg px-10 py-3 flex items-center justify-between 
            ${isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)]"}
            ${location.pathname === "/" ? "bg-[rgba(0,0,0,0.183)] fixed" : "bg-white relative "}
            transition-colors duration-300`}
        >
            <div className="flex items-center space-x-3">
                <NavLink to={"/"}>
                    <img
            src={location.pathname === "/" ? (isScrolled ? logoBlack : logo) : logoBlack}
            alt="Rpair-Logo"
            className="h-28 w-auto p-3 ms-3 rounded-full "
            />
                </NavLink>
            
        </div>

        <div className="hidden md:flex items-center space-x-6">
            <div>
            <NavLink to={"/about"} className="text-cyan-500 font-bold text-xl hover:text-cyan-950">
                ABOUT
            </NavLink>
            </div>

            <div className="relative group">
            <NavLink to={""} className="text-cyan-500 uppercase font-bold text-xl hover:text-cyan-950">
                Challenges
            </NavLink>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md px-4 pt-2 pb-5 w-60">
                <p className="block px-2 py-2 text-gray-700 font-bold ">
                        Competitions:
                </p>
                        <NavLink to="/competitions" className=" px-5">VEX IQ Competitions</NavLink>
                        
            </div>
            </div>
            <div className="relative group">
            <button className="text-cyan-500 font-bold uppercase text-xl hover:text-cyan-950">
                Resources
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-60">
                <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                Competitions
                </a>
            </div>
            </div>
            <div className="relative group">
            <NavLink to={"/gallery"} className="text-cyan-500 font-bold uppercase text-xl hover:text-cyan-950">
                Gallery
            </NavLink>
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <button className="bg-cyan-500  text-white px-4 py-2 rounded-md hover:bg-cyan-700">
            DONATE
            </button>
            <Link to={"/login"}  className="border border-cyan-500 text-cyan-500 uppercase px-4 py-2 rounded-md hover:bg-cyan-50">
            Login
            </Link>
        </div>
        </nav>
    );
}
