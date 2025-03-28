import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; 
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/Static/logoWrite-re.png";
import bgimg from "../../assets/Static/bg.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveTokens, getTokens } from './auth';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { access_token } = getTokens();
        if (access_token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);
 const handlePasswordVisibility = () => {
            setPasswordVisible(prevState => !prevState);
          };
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
            console.log("REACT_APP_API_URL_AUTH" , process.env.REACT_APP_API_URL_AUTH);
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL_AUTH}/login/`,
                { username, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            // Save both tokens using the auth utility
            saveTokens({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });

            const decodedToken = jwtDecode(data.access_token);
            localStorage.setItem("user_role", JSON.stringify({
                is_superuser: decodedToken?.is_superuser || false,
                is_staff: decodedToken?.is_staff || false,
            }));

            navigate("/", { replace: true }); 

        } catch (err) {
            setError(err.response?.data?.detail || "Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            className="relative py-14 "
            style={{
                backgroundImage: `url(${bgimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
             <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="absolute bg-gray-50 inset-0 bg-opacity-50 z-0"></div>
            <div id="loginForm" className="relative  flex bg-white rounded-2xl mb-10 shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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
                        <div className="mt-4 relative">
                            <div className="flex justify-between ">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <Link
                                    to="/reset-password"
                                    className="text-xs text-cyan-500 hover:underline"
                                    aria-label="Forgot Password"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"

                                type={passwordVisible ? 'text' : 'password'} 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="absolute right-4 top-9 text-3xl" type="button" onClick={handlePasswordVisibility}>
                                            {passwordVisible ? <VscEyeClosed />: <VscEye />}
                                          </button>
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
/*
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; 
import logo from "../../assets/logo/logoWrite-re.png";
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/imgs/aboutus/bg.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveTokens, getTokens } from './auth';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { access_token } = getTokens();
            if (access_token) {
                try {
                    const decodedToken = jwtDecode(access_token);
                    if (decodedToken.exp * 1000 > Date.now()) {
                        navigate("/", { replace: true });
                    }
                } catch (err) {
                    localStorage.clear();
                }
            }
        };
        checkAuth();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handlePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const handleTokens = (tokens, decodedToken) => {
        saveTokens(tokens);
        localStorage.setItem("user_role", JSON.stringify({
            is_superuser: decodedToken?.is_superuser || false,
            is_staff: decodedToken?.is_staff || false,
        }));
        toast.success('Login successful!');
        navigate("/", { replace: true });
    };

    const signIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { username, password } = formData;
        if (!username || !password) {
            setError("Username and password are required.");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL_AUTH}/login/`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            const decodedToken = jwtDecode(data.access_token);
            handleTokens({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            }, decodedToken);

        } catch (err) {
            console.error("Login error:", err.response || err);
            const errorMessages = {
                401: "Invalid username or password. Please try again.",
                400: "Invalid request. Please try again.",
                500: "Server error. Please try again later.",
                0: "Network error. Please check your internet connection."
            };
            setError(errorMessages[err.response?.status] || err.response?.data?.detail || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (!credentialResponse?.credential) {
            setError("No credentials received from Google. Please try again.");
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL_AUTH}/google-login/`,
                { id_token: credentialResponse.credential },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (!data?.access_token || !data?.refresh_token) {
                throw new Error("Invalid response from server: Missing tokens");
            }

            const decodedToken = jwtDecode(data.access_token);
            handleTokens({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            }, decodedToken);

        } catch (err) {
            console.error("Google login error:", err);
            
            const errorMessages = {
                404: "Google login service is not available. Please try again later or contact support.",
                401: "Your Google account is not authorized. Please use a different account or register first.",
                400: "Invalid Google sign-in. Please try again or use email login.",
                500: "Server error. Please try again later or contact support if the problem persists.",
                0: !navigator.onLine ? "No internet connection. Please check your network and try again." : "Failed to connect with Google."
            };
            
            setError(errorMessages[err.response?.status] || err.response?.data?.detail || "Failed to login with Google. Please try again or use email login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative py-14 "
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
                    <div className="mt-4 flex items-center justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Failed to connect with Google. Please try again.")}
                            type="standard"
                            theme="filled_blue"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                            width={320}
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="mt-4 text-sm text-center text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                        <a href="#" className="text-xs text-center text-gray-500 uppercase">
                            or login with email
                        </a>
                        <span className="border-b w-1/5 lg:w-1/4"></span>
                    </div>

                    <form className="mt-6" onSubmit={signIn}>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                User Name
                            </label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mt-4 relative">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <Link
                                    to="/reset-password"
                                    className="text-xs text-cyan-500 hover:underline"
                                    aria-label="Forgot Password"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                                type={passwordVisible ? 'text' : 'password'} 
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button 
                                className="absolute right-4 top-9 text-3xl" 
                                type="button" 
                                onClick={handlePasswordVisibility}
                            >
                                {passwordVisible ? <VscEyeClosed /> : <VscEye />}
                            </button>
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

*/