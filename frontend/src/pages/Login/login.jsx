import React from "react";
import logo from "../../assets/logo/logoWrite-re.png"
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/imgs/aboutus/bg.png"


const Login = () => {
    return (
    
        <div className="relative py-14 "
        style={{
            backgroundImage: `url(${bgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        {/* Overlay to darken background for better readability */}
    <div className="absolute bg-gray-50 inset-0 bg-opacity-50 z-0"></div>

        <div className="relative flex bg-white rounded-2xl  shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="hidden lg:block lg:w-1/3 bg-cover bg-gradient-to-br from-cyan-800 to-cyan-400">
                    <div className="flex items-center   py-16 flex-col">
                            <img src={logo} alt="Logo" className="w-60" />
                    </div>
                    
        </div>
        <div className="w-full p-8 lg:w-1/2 flex flex-col mx-auto">
            <h2 className="text-3xl  font-bold text-gray-700 text-center">Login</h2>
            <a
                href="#"
                        className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100 
                "
            >
                <div className="px-4 py-3">
                <div className="icon ">
                <FcGoogle className="text-2xl"/>
                </div>
                </div>
                <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">
                Sign in with Google
                </h1>
            </a>
            <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <a href="#" className="text-xs text-center text-gray-500 uppercase">
                or login with email
                </a>
                <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <form className="mt-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-xs text-cyan-500 hover:underline"
                                    aria-label="Forgot Password"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-8 bg-cyan-800 text-white font-bold py-2 px-4 w-full rounded hover:bg-cyan-600"
                        >
                            Login
                        </button>
                    </form>
            
            </div>
        </div>

    </div>

    );
};

export default Login; 