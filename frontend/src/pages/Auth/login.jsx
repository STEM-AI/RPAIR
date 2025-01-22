import { React, useState } from "react";
import { jwtDecode } from 'jwt-decode'; // Corrected import
import logo from "../../assets/logo/logoWrite-re.png";
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/imgs/aboutus/bg.png";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);


        if (!username || !password) {
            setError("Username and password are required.");
            setLoading(false);
            return;
        }
        
        try {
            const { data } = await axios.post(
                'http://147.93.56.71:8000/api/user/auth/login/',
                { username, password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            localStorage.setItem('access_token', data.access_token);
            const decodedToken = jwtDecode(data.access_token); // Corrected usage
                // Store role data in localStorage
                    localStorage.setItem('user_role', JSON.stringify({
                        is_superuser: decodedToken.is_superuser,
                        is_staff: decodedToken.is_staff,
                        is_judge: decodedToken.is_judge,
                    }));

            if (decodedToken.is_superuser) {
                console.log("superuser")
                setNavigate('/Dashboard/Admin');
            } else if (decodedToken.is_staff) {
                console.log("staff")
                setNavigate('/Dashboard/Judge');
            } else {
                setNavigate('/Dashboard/user');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (navigate) {
        return <Navigate to={navigate} />;
    }

    return (
        <div
            className="relative py-14"
            style={{
                backgroundImage: `url(${bgimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute bg-gray-50 inset-0 bg-opacity-50 z-0"></div>
            <div id="loginForm" className="relative flex bg-white rounded-2xl mb-10 shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div className="hidden lg:block lg:w-1/3 bg-cover bg-gradient-to-br from-cyan-800 to-cyan-400">
                    <div className="flex items-center py-16 flex-col">
                        <img src={logo} alt="Logo" className="w-60" />
                        <Link
                            to={"/register"}
                            className="text-center text-white font-bold py-2 border border-white w-36 rounded-full"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
                <div className="w-full p-8 lg:w-1/2 flex flex-col mx-auto">
                    <h2 className="text-3xl font-bold text-gray-700 text-center">Login</h2>
                    <a
                        href="#"
                        className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100 transition-all duration-700 cursor-pointer"
                    >
                        <div className="px-4 py-3">
                            <FcGoogle className="text-2xl" />
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

                    <form className="mt-6" onSubmit={signIn}>
                        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                User Name
                            </label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`mt-8 font-bold py-2 px-4 w-full rounded ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-cyan-800 hover:bg-cyan-600"
                            } transition-all duration-700 cursor-pointer text-white`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
