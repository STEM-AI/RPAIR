
import React from 'react';
import logo from '../../assets/logo/logo2.png';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

export default function FooterDash() {
    return (
        <footer className="bg-gradient-to-br w-full ml-auto from-cyan-400 to-cyan-800 text-white py-1 px-40">
            

            {/* Social Media Links */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className="text-2xl hover:text-sky-900 transition-all duration-700 cursor-pointer" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-2xl hover:text-pink-600 transition-all duration-700 cursor-pointer" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className="text-2xl hover:text-sky-400 transition-all duration-700 cursor-pointer" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="text-2xl hover:text-blue-400 transition-all duration-700 cursor-pointer" />
                    </a>
                </div>

                <div className="text-center text-sm mt-4">
                    <p>
                        &copy; 2025 RPAIR. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}