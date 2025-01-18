import React, { useState } from 'react';
import robotImage from '../../assets/imgs/cotantUs/Robot-iStock.jpg';
import { IoIosCloseCircle } from "react-icons/io";
import { TbBubbleTextFilled } from "react-icons/tb";

export default function ContactUs() {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State for controlling overlay visibility
    
        const handleOverlayDisplay = () => {
            setIsOverlayVisible(!isOverlayVisible);  // Toggle overlay visibility
        };
    
    

    return (
    <div>
        <div
            id="contantUS"
            className={`fixed top-0 left-0 right-0 ${isOverlayVisible ? '' : 'hidden'} h-screen w-full z-50 bg-[rgba(0,0,0,0.45)]`}
            role="dialog"
                aria-modal="true"
                
        >
            <div className="mx-auto flex justify-center px-6 py-12">
                <div className="w-full xl:w-3/4 lg:w-11/12 h-full flex border-2 border-solid border-cyan-700 rounded-lg bg-white shadow-lg">
                    <div className="absolute top-16 right-56">
                        <IoIosCloseCircle
                            className="text-3xl text-gray-900 cursor-pointer"
                            onClick={handleOverlayDisplay}
                        />
                    </div>

                    <div className="flex">
                        <div
                            className="w-full h-auto hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
                            style={{ backgroundImage: `url(${robotImage})` }}
                            aria-hidden="true"
                        ></div>
                        <div className="w-full lg:w-7/12 py-5 px-2">
                            <h3 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-6xl font-black text-center py-8">
                                Contact Us
                            </h3>
                            <form className="flex flex-col items-center">
                                <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
                                    <label htmlFor="name" className="sr-only">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    
                                    <label htmlFor="email" className="sr-only">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                    />

                                    <label htmlFor="phon" className="sr-only">
                                        Phone
                                    </label>
                                    <input
                                        id="phon"
                                        type="text"
                                        placeholder="Enter your phone"
                                        className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    
                                    <label htmlFor="subject" className="sr-only">
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        placeholder="Subject"
                                        className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    
                                    <label htmlFor="message" className="sr-only">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        placeholder="Say Something"
                                        className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                    ></textarea>
                                </div>
                                <button
                                    className="border-2 text-md mt-5 rounded-md py-2 px-4 bg-gradient-to-r from-cyan-800 to-cyan-500 hover:bg-cyan-950 text-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    type="button"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <div id="chatBot"
                            className="fixed bottom-6 right-6 z-50  p-4 rounded-full  cursor-pointer"
                        >
                            <button onClick={handleOverlayDisplay}>
                                <TbBubbleTextFilled className="text-6xl text-cyan-800 hover:text-cyan-600 transition-all duration-700 cursor-pointer" />
                            </button>
            </div>
            </div>
    );
}
