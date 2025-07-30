import { useState } from "react";
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import axios from "axios";
import logo from "../../assets/Static/logoWrite-re.png";
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/Static/bg.png";
import { Link, Navigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Helmet } from "react-helmet-async";
import CircularProgress from '@mui/material/CircularProgress';
import logoblack from "../../assets/Static/logo2.png";


const Register = () => {
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [date_of_birth, setDateofbirth] = useState("");
    const [phone_number, setPhonenumber] = useState("");
    const [navigate, setNavigate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setconfirmPasswordVisible] = useState(false);

           const handlePasswordVisibility = () => {
            setPasswordVisible(prevState => !prevState);
          };
           const handleConfirmPasswordVisibility = () => {
            setconfirmPasswordVisible(prevState => !prevState);
          };
        // Password validation function
          const validatePassword = (password) => {
              const hasUppercase = /[A-Z]/.test(password);
              const hasLowercase = /[a-z]/.test(password);
              const hasDigit = /\d/.test(password);
              const hasSpecialChar = /[@#$%^&*(),.?":{}|<>]/.test(password);
              return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
                };
                
  
               const handlePasswordChange = (e) => {
                const value = e.target.value;
                setPassword(value);
                setIsPasswordValid(validatePassword(value));
                  };
                  const signUp = async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError(null);

                                        
                    if (password !== confirmPassword) {
                        setError("Passwords do not match.");
                        setLoading(false);
                        return;
                    }

                    if (!isPasswordValid) {
                        setError("Password does not meet the requirements.");
                        setLoading(false);
                        return;
                    }

                    if (!phone_number.startsWith('+20') || phone_number.length !== 13) {
                        setError("Phone number must start with +20 followed by 10 digits.");
                        setLoading(false);
                        return;
                    }
                  if (password !== confirmPassword) {
                      setError("Passwords do not match.");
                      setLoading(false);
                      return;
                  }

                  if (!isPasswordValid) {
                      setError("Password does not meet the requirements.");
                      setLoading(false);
                      return;
                  }

        try {
            const response = await axios.post(
              
                `${process.env.REACT_APP_API_URL_AUTH}/user-register/`,
                {
                    first_name,
                    last_name,
                    username,
                    email,
                    country,
                    address,
                    date_of_birth,
                    phone_number,
                    password,
                },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            console.log("Success");
            setNavigate(true);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Registration successful!",
                showConfirmButton: false,
                  });
              } catch (err) {
                console.error("Registration error:", err); // Log the full error object

                let errorMessage = "Registration failed. Try again."; // Default error message

                // Check if the error contains a response from the server
                if (err.response) {
                  // Log detailed server response data
                  console.error("Error response data:", err.response.data);

                  // Check if there is a specific error for email, phone_number, or username
                  if (err.response.data.email) {
                    errorMessage = err.response.data.email; // Set the error message from the email
                  } else if (err.response.data.phone_number) {
                    errorMessage = err.response.data.phone_number; // Set the error message from the phone_number
                  } else if (err.response.data.username) {
                    errorMessage = err.response.data.username; // Set the error message from the username
                  } else {
                    // For other errors, use a generic error message
                    errorMessage = err.response.data.detail || errorMessage;
                  }
                } else if (err.request) {
                  console.error("Error request:", err.request);
                } else {
                  console.error("Unexpected error:", err.message);
                }

                // Set the error message in the state
                setError(errorMessage);
              }
              finally {
                  setLoading(false);
              }
          };

          if (navigate) {
              return <Navigate to="/login" />;
          }

  
          return (
            <div className="min-h-screen relative py-14" style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${bgimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <Helmet>
                    <title>Registration</title>
                </Helmet>
    
                <div className="relative flex justify-center mx-auto bg-white rounded-2xl shadow-xl  sm:mx-auto max-w-xl lg:max-w-5xl overflow-hidden">
                    {/* Left Section */}
                    <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-cyan-700 to-cyan-400 items-center justify-center p-12">
                        <div className="text-center space-y-8">
                            <img src={logo} alt="Logo" className="w-48 mx-auto mb-8" />
                            <h2 className="text-3xl font-bold text-white mb-4">Create Account</h2>
                            <p className="text-cyan-100 mb-8">Join our community to start your journey</p>
                            <Link
                                to="/login"
                                className="inline-block px-8 py-3 text-sm font-semibold text-cyan-700 bg-white rounded-full hover:bg-opacity-90 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
    
                    {/* Right Section */}
                    <div className="w-full lg:w-2/3 p-4 sm:p-12 ">
                        <div className="lg:hidden mb-8 text-center">
                            <img src={logoblack} alt="Logo" className="w-32 mx-auto" />
                        </div>
    
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                            Create New Account
                        </h2>
    
                        <Link 
                            to="/register/organization" 
                            className="block text-center mb-8 text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                            Register as organization
                        </Link>
    
                        {/* <button className="w-full flex items-center justify-center gap-3 py-3 mb-8 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <FcGoogle className="text-xl" />
                            <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button> */}
    
                        <div className="flex items-center mb-8">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">or register with email</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>
    
                        <form className="space-y-6" onSubmit={signUp}>
                            {error && (
                                <Alert severity="error" className="rounded-lg bg-red-50 border border-red-200">
                                    <strong>Error:</strong> {error}
                                </Alert>
                            )}
    
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="text"
                                        placeholder="First Name"
                                        value={first_name}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        required
                                    />
                                </div>
    
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="text"
                                        placeholder="Last Name"
                                        value={last_name}
                                        onChange={(e) => setLastname(e.target.value)}
                                        required
                                    />
                                </div>
    
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
    
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
    
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="text"
                                        placeholder="Country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                    />
                                </div>
    
                               <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                    type="tel"
                                    placeholder="+20XXXXXXXXXX"
                                    value={phone_number}
                                    onChange={(e) => {
                                    let value = e.target.value;
                                    // Remove all non-digit and non-plus characters
                                    value = value.replace(/[^\d+]/g, '');
                                    
                                    // Ensure it starts with +20
                                    if (!value.startsWith('+20')) {
                                        value = '+20' + value.replace('+', '');
                                    }
                                    
                                    // Limit to 13 characters (+20 followed by 10 digits)
                                    if (value.length > 13) {
                                        value = value.slice(0, 13);
                                    }
                                    
                                    setPhonenumber(value);
                                    }}
                                    required
                                />
                                </div>
                            </div>
    
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                    type="date"
                                    value={date_of_birth}
                                    onChange={(e) => setDateofbirth(e.target.value)}
                                    required
                                />
                            </div>
    
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                    type="text"
                                    placeholder="Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
    
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors pr-12"
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onFocus={() => setShowAlert(true)}
                                        onBlur={() => { if (isPasswordValid) setShowAlert(false) }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePasswordVisibility}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                    >
                                        {passwordVisible ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                                    </button>
                                </div>
    
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors pr-12"
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleConfirmPasswordVisibility}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                    >
                                        {confirmPasswordVisible ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                                    </button>
                                </div>
                            </div>
    
                            {showAlert && !isPasswordValid && (
                                <Alert severity="info" className="rounded-lg border border-cyan-200 bg-cyan-50">
                                    <strong>Password Requirements:</strong>
                                    <ul className="list-disc pl-4 mt-1">
                                        <li>Uppercase letter</li>
                                        <li>Lowercase letter</li>
                                        <li>Number</li>
                                        <li>Special character (@#$%^&* etc.)</li>
                                    </ul>
                                </Alert>
                            )}
    
                            {password !== confirmPassword && (
                                <Alert severity="error" className="rounded-lg border border-red-200 bg-red-50">
                                    Passwords do not match
                                </Alert>
                            )}
    
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} thickness={5} className="text-white" />
                                        <span>Registering...</span>
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
    
                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-cyan-600 hover:text-cyan-700"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
};

export default Register; 