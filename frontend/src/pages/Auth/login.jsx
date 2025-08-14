import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/Static/logoWrite-re.png";
import bgimg from "../../assets/Static/bg.png";
import logoblack from "../../assets/Static/logo2.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveTokens, getTokens } from './auth';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Helmet } from "react-helmet-async";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


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
                organization: decodedToken?.organization || false,
            }));

            navigate("/", { replace: true }); 

        } catch (err) {
            setError(err.response.data[0]);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative py-14" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${bgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <Helmet>
                <title>Login</title>
            </Helmet>
            
            <div className="relative flex  justify-center mx-auto bg-white rounded-2xl shadow-xl  sm:mx-auto max-w-xl lg:max-w-4xl overflow-hidden">
                {/* Left Section */}
                <div className="hidden   lg:flex lg:w-1/2  bg-gradient-to-br from-cyan-700 to-cyan-400 items-center justify-center p-12">
                    <div className="text-center space-y-8">
                        <img src={logo} alt="Logo" className="w-48 mx-auto mb-8" />
                        <h2 className="text-3xl font-bold text-white mb-4">Welcome Back</h2>
                        <p className="text-cyan-100 mb-8">Sign in to continue your journey with us</p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 text-sm font-semibold text-cyan-700 bg-white rounded-full hover:bg-opacity-90 transition-all duration-300"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <div className="lg:hidden mb-8 text-center">
                        <img src={logoblack} alt="Logo" className="w-32 mx-auto" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        Sign In to Your Account
                    </h2>

                    {/* Google Login */}
                    <button className="w-full flex items-center justify-center gap-3 py-3 mb-8 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FcGoogle className="text-xl" />
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>

                    <div className="flex items-center mb-8">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">or with email</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <form className="space-y-6" onSubmit={signIn}>
                        {error && (
                            <Alert severity="error" className="rounded-lg bg-red-50 border border-red-200">
                                <strong>Error:</strong> {error}
                            </Alert>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link
                                    to="/reset-password"
                                    className="text-sm text-cyan-600 hover:text-cyan-700"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors pr-12"
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handlePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {passwordVisible ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} thickness={5} className="text-white" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-cyan-600 hover:text-cyan-700"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;