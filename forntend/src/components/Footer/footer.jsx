import { React, useState } from 'react';
import logo from '../../assets/logo/logo2.png';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
} from "react-icons/fa";

export default function Footer() {
    const [hovered, setHovered] = useState({
        title: false,
        aboutUs: false,
        challenges: false,
        gallery: false,
    });

    const handleMouseEnter = (element) => {
        setHovered((prevState) => ({ ...prevState, [element]: true }));
    };

    const handleMouseLeave = (element) => {
        setHovered((prevState) => ({ ...prevState, [element]: false }));
    };

    return (
        <footer className='bg-cyan-600 text-white py-8 px-40'>
            <div className='mb-4 border-b border-slate-500 py-8 grid grid-cols-2 gap-4'>
                <div className="flex flex-col items-center">
                    <img src={logo} alt="REC Foundation" className="h-32 w-auto mb-4" />
                    <h4 className="font-medium text-xl text-center px-24"
                        style={{textShadow:'2px 2px 5px rgba(0, 0, 0, 0.7)'}}
                    >
                        Innovation in organizing competitions
                        that prepare participants for future jobs
                    </h4>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <ul className="text-center text-white space-y-2">
                        <li>
                            <a href="#" className="font-bold text-2xl hover:text-cyan-800"
                                style={{
                                    textShadow: hovered.aboutUs ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.7)',
                                }}
                                onMouseEnter={() => handleMouseEnter('aboutUs')}
                                onMouseLeave={() => handleMouseLeave('aboutUs')}>
                                ABOUT US
                            </a>
                        </li>
                        <li>
                            <a href="#" className="font-bold text-2xl hover:text-cyan-800"
                                style={{
                                    textShadow: hovered.challenges ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.7)',
                                }}
                                onMouseEnter={() => handleMouseEnter('challenges')}
                                onMouseLeave={() => handleMouseLeave('challenges')}>
                                Challenges
                            </a>
                        </li>
                        <li>
                            <a href="#" className="font-bold text-2xl hover:text-cyan-800"
                                style={{
                                    textShadow: hovered.gallery ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.7)',
                                }}
                                onMouseEnter={() => handleMouseEnter('gallery')}
                                onMouseLeave={() => handleMouseLeave('gallery')}>
                                Gallery
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    <FaFacebookF className="text-2xl hover:text-sky-900 cursor-pointer" />
                    <FaInstagram className="text-2xl hover:text-pink-600 cursor-pointer" />
                    <FaLinkedinIn className="text-2xl hover:text-sky-400 cursor-pointer" />
                    <FaYoutube className="text-2xl hover:text-red-700 cursor-pointer" />
                    <FaTiktok className="text-2xl hover:text-black cursor-pointer" />
                </div>

                <div className="text-center text-sm mt-4">
                    <p>
                        © Robotics Education & Competition Foundation, 2024. All rights
                        reserved.
                    </p>
                    
                </div>
            </div>
        </footer>
    );
}
