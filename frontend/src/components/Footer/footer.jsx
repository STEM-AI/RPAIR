import React from "react";
import logo from "../../assets/Static/logo2.png";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-cyan-800 to-cyan-400 text-white py-4 sm:py-10">
            <div className="container mx-auto px-3 sm:px-4 lg:px-8">
                <div className="grid grid-cols-12 gap-3 sm:gap-8">
                    {/* Contact Information Section - Left Side */}
                    <div className="col-span-8">
                        <div className="grid grid-cols-2 gap-3 sm:gap-8">
                            {/* Sadat City Branch */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 transform transition-all duration-300 hover:bg-white/20 hover:shadow-xl">
                                <h3 className="text-[10px] sm:text-xl font-semibold flex items-center mb-2 sm:mb-4 text-cyan-50">
                                    <FaMapMarkerAlt className="mr-1 sm:mr-3 text-cyan-200" /> 
                                    <span className="border-b-2 border-cyan-200 pb-1">Sadat City Branch</span>
                                </h3>
                                <p className="text-[8px] sm:text-lg text-cyan-50 mb-2 sm:mb-4 pl-4 sm:pl-9">Sadat City, Menoufia, Egypt</p>
                                <div className="space-y-1 sm:space-y-3 pl-4 sm:pl-9">
                                    <a href="tel:+201020047147" className="flex items-center group">
                                        <FaPhone className="mr-1 sm:mr-3 text-cyan-200 group-hover:rotate-12 transition-transform text-[8px] sm:text-base" />
                                        <span className="text-[8px] sm:text-base text-cyan-50 group-hover:text-white transition-colors">+201080481880</span>
                                    </a>
                                    <a href="tel:+201555079339" className="flex items-center group">
                                        <FaPhone className="mr-1 sm:mr-3 text-cyan-200 group-hover:rotate-12 transition-transform text-[8px] sm:text-base" />
                                        <span className="text-[8px] sm:text-base text-cyan-50 group-hover:text-white transition-colors">+201555079339</span>
                                    </a>
                                </div>
                            </div>

                            {/* Alexandria Branch */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 transform transition-all duration-300 hover:bg-white/20 hover:shadow-xl">
                                <h3 className="text-[10px] sm:text-xl font-semibold flex items-center mb-2 sm:mb-4 text-cyan-50">
                                    <FaMapMarkerAlt className="mr-1 sm:mr-3 text-cyan-200" />
                                    <span className="border-b-2 border-cyan-200 pb-1">Alexandria Branch</span>
                                </h3>
                                <p className="text-[8px] sm:text-lg text-cyan-50 mb-2 sm:mb-4 pl-4 sm:pl-9">Alexandria, Egypt</p>
                                <div className="space-y-1 sm:space-y-3 pl-4 sm:pl-9">
                                    <a href="tel:+201111965693" className="flex items-center group">
                                        <FaPhone className="mr-1 sm:mr-3 text-cyan-200 group-hover:rotate-12 transition-transform text-[8px] sm:text-base" />
                                        <span className="text-[8px] sm:text-base text-cyan-50 group-hover:text-white transition-colors">+201111965693</span>
                                    </a>
                                    <a href="tel:+2034214474" className="flex items-center group">
                                        <FaPhone className="mr-1 sm:mr-3 text-cyan-200 group-hover:rotate-12 transition-transform text-[8px] sm:text-base" />
                                        <span className="text-[8px] sm:text-base text-cyan-50 group-hover:text-white transition-colors">+2034214474</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo and Description - Right Side */}
                    <div className="col-span-4">
                        <div className="flex flex-col items-center text-center">
                        <img
                            src={logo}
                            alt="logo"
                            className="h-14 sm:h-32 w-auto mb-2 sm:mb-4 p-2 sm:p-3 rounded-full"
                        />
                            <h4 className="font-light text-[8px] sm:text-lg px-1 sm:px-4" style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }}>
                                Innovation in organizing competitions that prepare participants for future jobs
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="border-t border-white/20 mt-4 sm:mt-10 pt-4 sm:pt-8">
                    <div className="flex justify-center space-x-3 sm:space-x-6">
                        {[
                            { icon: FaFacebookF, link: "https://www.facebook.com/profile.php?id=61569309222509", label: "Facebook" },
                            { icon: FaInstagram, link: "https://instagram.com", label: "Instagram" },
                            { icon: FaLinkedinIn, link: "https://linkedin.com", label: "LinkedIn" },
                        ].map(({ icon: Icon, link, label }, index) => (
                            <a 
                                key={index} 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="bg-white/10 p-1.5 sm:p-3 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-white/20"
                            >
                                <Icon className="text-[10px] sm:text-2xl text-cyan-50 hover:text-white transition-colors" />
                            </a>
                        ))}
                    </div>
                    <div className="text-center text-[8px] sm:text-sm text-cyan-50 mt-2 sm:mt-6">
                        <p>&copy; {new Date().getFullYear()} RPAIR. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
