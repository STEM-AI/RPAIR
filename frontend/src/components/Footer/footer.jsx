import React, { useState } from 'react';
import logo from '../../assets/logo/logo2.png';
import { TbBubbleTextFilled } from "react-icons/tb";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
} from "react-icons/fa";
import ContactUs from '../Contact/contactUs';  // Import the ContactUs component

export default function Footer() {
    const [hovered, setHovered] = useState({
        title: false,
        aboutUs: false,
        challenges: false,
        gallery: false,
    });

    const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for controlling overlay visibility

    const handleMouseEnter = (element) => {
        setHovered((prevState) => ({ ...prevState, [element]: true }));
    };

    const handleMouseLeave = (element) => {
        setHovered((prevState) => ({ ...prevState, [element]: false }));
    };

    const handleOverlayDisplay = () => {
        setIsOverlayVisible(!isOverlayVisible);  // Toggle overlay visibility
    };

    return (
        <footer className='bg-gradient-to-br from-cyan-800 to-cyan-400 text-white py-8 px-40'>
            <div className='border-b border-slate-500 mb-4'>
                <div className='py-4 grid grid-cols-2 gap-4'>
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="rape" className="h-32 w-auto mb-4 p-3 rounded-full" />
                        <h4 className="font-light text-xl text-center px-24" style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)' }}>
                            Innovation in organizing competitions that prepare participants for future jobs
                        </h4>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <ul className="text-center text-white space-y-2">
                            <li>
                                <a href="#" className="font-normal text-2xl  hover:text-cyan-800"
                                    style={{
                                        textShadow: hovered.aboutUs ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.7)',
                                    }}
                                    onMouseEnter={() => handleMouseEnter('aboutUs')}
                                    onMouseLeave={() => handleMouseLeave('aboutUs')}>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="font-normal text-2xl hover:text-cyan-800"
                                    style={{
                                        textShadow: hovered.challenges ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.7)',
                                    }}
                                    onMouseEnter={() => handleMouseEnter('challenges')}
                                    onMouseLeave={() => handleMouseLeave('challenges')}>
                                    Challenges
                                </a>
                            </li>
                            <li>
                                <a href="#" className="font-normal text-2xl hover:text-cyan-800"
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
                <div className="flex justify-end px-4 py-2">
                    <button onClick={handleOverlayDisplay}>
                        <TbBubbleTextFilled className='text-6xl' />
                    </button>
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
                        © Robotics Education & Competition Foundation, 2024. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Include ContactUs Component with isVisible prop */}
            <ContactUs isVisible={isOverlayVisible} handleOverlayDisplay={handleOverlayDisplay} />
        </footer>
    );
}
