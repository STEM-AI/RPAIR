import React from 'react';
import robotImage from '../../assets/imgs/cotantUs/Robot-iStock.jpg';
import { IoIosCloseCircle } from "react-icons/io";

export default function ContactUs({ isVisible, handleOverlayDisplay }) {
    return (
        <div
            id="contantUS"
            className={`fixed top-0 left-0 right-0 ${isVisible ? '' : 'hidden'} h-screen w-full z-50 bg-[rgba(0,0,0,0.45)]`}
        >
            <div className="mx-auto">
                <div className="flex justify-center px-6 py-12">
                    <div className="w-full xl:w-3/4 lg:w-11/12 h-full flex border-2 border-solid border-cyan-700 rounded-lg bg-white">
                        <div className="">
                            <IoIosCloseCircle
                                className="text-3xl cursor-pointer"
                                onClick={handleOverlayDisplay}
                            />
                        </div>
                        <div className="flex">
                            <div
                                className="w-full h-auto hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
                                style={{ backgroundImage: `url(${robotImage})` }}
                            ></div>
                            <div className="w-full lg:w-7/12 py-5 px-2">
                                <h3 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-teal-500 text-6xl font-black text-center py-8">
                                    Contact Us
                                </h3>
                                <form className="flex flex-col items-center">
                                    <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-"
                                        />
                                        <input
                                            id="email"
                                            type="text"
                                            placeholder="Enter your email"
                                            className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                        <input
                                            id="phon"
                                            type="text"
                                            placeholder="Enter your phone"
                                            className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                        <input
                                            id="subject"
                                            type="text"
                                            placeholder="Subject"
                                            className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                        <textarea
                                            id="message"
                                            rows="5"
                                            placeholder="Say Something"
                                            className="my-2 py-2 px-4 rounded-md bg-gray-900 text-gray-300 w-full outline-none focus:ring-2 focus:ring-blue-600"
                                        ></textarea>
                                    </div>
                                    <button
                                        className="border-2 text-md mt-5 rounded-md py-2 px-4 bg-gradient-to-r from-cyan-800 to-teal-500 hover:bg-blue-700 text-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        type="button" onClick={handleOverlayDisplay}
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
