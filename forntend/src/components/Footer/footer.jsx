import React from 'react'
import logo from '../../assets/logo/logo2.png'
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
} from "react-icons/fa";
export default function Footer() {
    return (
        <footer className='bg-cyan-600 text-white py-8 px-40'>
            <div className=' mb-4 border-b border-slate-500 py-8 flex items-center'>
                <div className="flex flex-col items-center">
                <img src={logo} alt="REC Foundation" className="h-16 w-auto mb-4" />
                </div>
                <div className="flex flex-col items-center">
                <ul className="text-center space-y-2">
                <li>
                    <a href="#" className="hover:text-cyan-700">
                    ABOUT US
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-cyan-700">
                    Challenges
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-cyan-700">
                    EVENT PARTNERS
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-cyan-700">
                    VOLUNTEERS
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-cyan-700">
                    Gallery
                    </a>
                </li>
                </ul>
                </div>
            </div>
            

            <div className="flex flex-col items-center space-y-4">
                {/* Social Icons */}
                <div className="flex space-x-4">
                <FaFacebookF className="hover:text-gray-300 cursor-pointer" />
                <FaInstagram className="hover:text-gray-300 cursor-pointer" />
                <FaLinkedinIn className="hover:text-gray-300 cursor-pointer" />
                <FaYoutube className="hover:text-gray-300 cursor-pointer" />
                <FaTiktok className="hover:text-gray-300 cursor-pointer" />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                <button className="bg-white text-blue-900 px-6 py-2 rounded-full border border-white hover:bg-gray-200">
                    DONATE
                </button>
                <button className="bg-white text-blue-900 px-6 py-2 rounded-full border border-white hover:bg-gray-200">
                    EVENTS
                </button>
                </div>

                {/* Footer Policies */}
                <div className="text-center text-sm mt-4">
                <p className="mb-2">
                    <a href="#" className="hover:underline">
                    Privacy Policy
                    </a>{" "}
                    |{" "}
                    <a href="#" className="hover:underline">
                    Terms of Service
                    </a>{" "}
                    |{" "}
                    <a href="#" className="hover:underline">
                    Acceptable Use Policy
                    </a>
                </p>
                <p>
                    © Robotics Education & Competition Foundation, 2024. All rights
                    reserved.
                </p>
                </div>
            </div>
        </footer>
    )
}
