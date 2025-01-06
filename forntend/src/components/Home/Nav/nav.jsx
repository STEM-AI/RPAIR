import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../../assets/logo/logo.jpg'

export default function Navbar() {
return (
    <nav className="bg-white shadow-lg px-10 py-3 flex items-center justify-between">
        
    <div className="flex items-center space-x-3">
    <img
        src={logo}
        alt="Rpair-Logo"
        className="h-20 w-28 ps-5"
    />
</div>

<div className="hidden md:flex items-center space-x-6">
    <div className="relative group">
    <button className="text-cyan-500 font-medium hover:text-cyan-950">
        ABOUT
    </button>
    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2  w-32">
        <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
            About Us
        </a>
        </div>
    </div>

    <div className="relative group">
        <button className="text-cyan-500 uppercase font-medium hover:text-cyan-950">
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
        <button className="text-cyan-500 font-medium uppercase hover:text-cyan-950">
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
        <button className="text-cyan-500 font-medium uppercase hover:text-cyan-950">
        Gallery
        </button>
    </div>

    </div>

    <div className="flex items-center space-x-4">
    <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-700">
        DONATE
    </button>
    <button className="border border-cyan-500 text-cyan-500 px-4 py-2 rounded-md hover:bg-cyan-50">
        NEW TO ROBOTICS?
    </button>

    </div>
</nav>

)
}
