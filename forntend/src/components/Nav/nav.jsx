import React, { useEffect, useState } from "react";
import logo from "../../assets/logo/logo2.png";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        // نحصل على قسم الـ Home
        const homeSection = document.getElementById("home-section");

        if (homeSection) {
            // حساب المسافة بين القسم وأعلى الصفحة
            const homeBottom = homeSection.getBoundingClientRect().bottom;

            // إذا تجاوزنا قسم Home، نقوم بتغيير الحالة
            setIsScrolled(homeBottom <= 0);
        }
        };

        // إضافة حدث التمرير
        window.addEventListener("scroll", handleScroll);

        // تنظيف الحدث عند إزالة المكون
        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
        className={`fixed left-0 right-0 z-40 shadow-lg px-10 py-3 flex items-center justify-between ${
            isScrolled ? "bg-white" : "bg-[rgba(0,0,0,0.183)]"
        } transition-colors duration-300`}
        >
        <div className="flex items-center space-x-3">
            <img
            src={logo}
            alt="Rpair-Logo"
            className="h-20 w-28 p-3 ms-3 rounded-full bg-white"
            />
        </div>

        <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
            <button className="text-cyan-500 font-bold text-xl hover:text-cyan-950">
                ABOUT
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-32">
                <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                About Us
                </a>
            </div>
            </div>

            <div className="relative group">
            <button className="text-cyan-500 uppercase font-bold text-xl hover:text-cyan-950">
                Challenges
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
            <button className="text-cyan-500 font-bold uppercase text-xl hover:text-cyan-950">
                Gallery
            </button>
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <button className="bg-cyan-500  text-white px-4 py-2 rounded-md hover:bg-cyan-700">
            DONATE
            </button>
            <button className="border border-cyan-500 text-cyan-500 uppercase px-4 py-2 rounded-md hover:bg-cyan-50">
            sign up
            </button>
        </div>
        </nav>
    );
}
