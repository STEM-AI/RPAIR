import React from "react";
import logo from "../../assets/logo/logoWrite-re.png"
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/imgs/aboutus/bg.png"


const Login = () => {
    return (
    
            <div className="relative py-14">
            <div
            className="absolute inset-0 z-0"
            style={{
                backgroundImage: `url(${bgimg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4, 
            }}
        ></div>
        <div className="flex bg-white rounded-2xl  shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="hidden lg:block lg:w-1/3 bg-cover bg-gradient-to-br from-cyan-800 to-cyan-400">
                    <div className="flex items-center -center  py-10 flex-col">
                        <div className="img py-16">
                            <img src={logo} alt="" className="w-60" />
                        </div>
                    </div>
                    
        </div>
        <div className="w-full p-8 lg:w-1/2 flex flex-col mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">Login</h2>
            <a
                href="#"
                className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
            >
                <div className="px-4 py-3">
                <div className="icon " viewBox="0 0 40 40">
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
            <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                />
            </div>
            <div className="mt-4">
                <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <a href="#" className="text-xs text-gray-500 hover:text-cyan-500">
                    Forget Password?
                </a>
                </div>
                <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                />
            </div>
            <div className="mt-8">
                <button className="bg-cyan-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-cyan-500">
                Login
                </button>
            </div>
            
            </div>
        </div>

    </div>

    );
};

export default Login; 