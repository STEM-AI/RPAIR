import React from 'react';
import logo from '../../assets/logo/logo2.png';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-cyan-800 to-cyan-400 text-white py-8 px-40">
            <div className="border-b border-slate-500 mb-4">
                <div className="py-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <img
                            src={logo}
                            alt="logo"
                            className="h-32 w-auto mb-4 p-3 rounded-full"
                        />
                        <h4
                            className="font-light text-xl text-center px-24"
                            style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)" }}
                        >
                            Innovation in organizing competitions that prepare participants for
                            future jobs
                        </h4>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <ul className="text-center text-white space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="font-normal text-2xl hover:text-cyan-900 transition-all duration-500"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="font-normal text-2xl hover:text-cyan-900 transition-all duration-500"
                                >
                                    Challenges
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-2xl font-normal hover:text-cyan-900 transition-all duration-500"
                                >
                                    Gallery
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    <FaFacebookF className="text-2xl hover:text-sky-900 transition-all duration-700 cursor-pointer" />
                    <FaInstagram className="text-2xl hover:text-pink-600 transition-all duration-700 cursor-pointer" />
                    <FaLinkedinIn className="text-2xl hover:text-sky-400 transition-all duration-700 cursor-pointer" />
                    <FaYoutube className="text-2xl hover:text-red-700 transition-all duration-700 cursor-pointer" />
                    <FaTiktok className="text-2xl hover:text-black transition-all duration-700 cursor-pointer" />
                </div>

                <div className="text-center text-sm mt-4">
                    <p>
                        © Robotics Education & Competition Foundation, 2024. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
