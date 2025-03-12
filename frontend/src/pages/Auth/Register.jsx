import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import axios from "axios";
import {React,useState} from "react"; 
import logo from "../../assets/Static/logoWrite-re.png"
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/Static/bg.png"
import { Link, Navigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";



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
    
        <div className="relative py-14 "
        style={{
            backgroundImage: `url(${bgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        {/* Overlay to darken background for better readability */}
    <div className="absolute bg-gray-50 inset-0 bg-opacity-50 z-0"></div>
       
            
        <div id="signUpForm" onSubmit={signUp} className="relative flex bg-white rounded-2xl  shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-5xl w-full">
            
            <div className="w-full px-8 py-4 lg:w-3/4 flex flex-col mx-auto">
                <h2 className="text-3xl  font-bold text-gray-700 text-center">Register</h2>
                <a href="#"className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                    <div className="px-4 py-3">
                    <div className="icon ">
                    <FcGoogle className="text-2xl"/>
                    </div>
                    </div>
                    <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">
                    Sign up with Google
                    </h1>
                </a>
                <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                    <a href="#" className="text-xs text-center text-gray-500 uppercase">
                    or register with email
                    </a>
                    <span className="border-b w-1/5 lg:w-1/4"></span>
                </div>

            <form className=" pt-6 pb-8 mb-4 bg-white rounded" >
              {error && <Alert className="px-5 my-2 " severity="error">{error}</Alert>} 
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={first_name}
                      onChange={(e) => setFirstname(e.target.value)}
                      required
                    />
                  </div>
                  <div className=" mb-4 md:mr-2 md:mb-0">
                    <label
                      className={`block mb-2 text-sm font-bold text-gray-700 `}
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={last_name}
                      onChange={(e) => setLastname(e.target.value)}
                      required
                    />
                </div>
                <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="username"
                    >
                      User Name
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="username"
                      type="text"
                    placeholder="User Name"
                    value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                    className="block mb-2 text-sm font-bold  text-gray-700"
                    htmlFor="country"
                  >
                    Country
                  </label>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="country"
                      type="text"
                      placeholder="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0">
                     <label
                    className={`block mb-2 text-sm font-bold  text-gray-700`}
                    htmlFor="phone"
                  >
                     Phone Number
                  </label>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="phone"
                      type="text"
                  placeholder="enter your phone"
                   pattern="^\+20\d{10}$"
                  title="Phone number must start with +2 and contain 11 digits."
                      value={phone_number}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      required
                    />
                </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="lastName"
                    >
                      Date of Birth
                    </label>
                    <input
                    className="bg-gray-200  text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="date_of_birth"
                    type="date"
                    value={date_of_birth}
                      onChange={(e) => setDateofbirth(e.target.value)}
                      required
                    />
                </div>

                </div>
               
                
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold  text-gray-700"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="address"
                      type="text"
                      placeholder="enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                </div>
                
                <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                  id="email"
                  type="text"
                  value={email} // النص الكامل في الحقل
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>

                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 w-1/2 md:mb-0 relative">
                    <label
                      className={`block mb-2 text-sm font-bold  text-gray-700 `}
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="password"
                      type={passwordVisible ? 'text' : 'password'} 
                      placeholder="******************"
                    value={password}
                    onFocus={() => setShowAlert(true)} // Show alert on focus
                    onBlur={() => {
                      // Hide alert only if password is valid
                      if (isPasswordValid) setShowAlert(false);
                    }}
                      onChange={handlePasswordChange}
                      required
                  />
                  <button className="absolute right-4 top-9 text-3xl" type="button" onClick={handlePasswordVisibility}>
                    {passwordVisible ? <VscEyeClosed />: <VscEye />}
                  </button>
                  </div>
                  <div className="mb-4 md:mr-2  w-1/2 md:mb-0 relative">
                    <label
                      className={`block mb-2 text-sm font-bold  text-gray-700 `}
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="confirmPassword"
                      type={passwordVisible ? 'text' : 'password'} 
                      placeholder="******************"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                  />
                   <button className="absolute right-4 top-9 text-3xl" type="button" 
                   onClick={handleConfirmPasswordVisibility}
                    >
                      {confirmPasswordVisible ? <VscEyeClosed /> : <VscEye />}
                    
                  </button>
                </div>
              </div>
                  {showAlert && !isPasswordValid && (
                        <Alert severity="info" className="mt-2">
                            Password must include uppercase, lowercase, digit, and special character.
                        </Alert>
                    )}
                    {password !== confirmPassword && (
                      <Alert severity="error" className="mt-2">
                        Passwords do not match.
                      </Alert>
              )}                    
              
              {error && <Alert className="p-5 my-2" severity="error">{error}</Alert>} 
                <div className=" text-center">
                    <button
                            type="submit"
                            className={`mt-8 font-bold py-2 px-4 w-full rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-800 hover:bg-cyan-600"} text-white`}
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                </div>    
            </form>
            </div>
            <div className="hidden lg:block lg:w-1/3 bg-cover bg-gradient-to-br from-cyan-800 to-cyan-400">
                <div className="flex items-center  justify-center flex-col h-full">
                        <img src={logo} alt="Logo" className="w-60" />
                         <Link
                          to={"/login"}
                            className=" text-center text-white font-bold py-2 border border-white  w-36 rounded-full ">
                            Sign In
                        </Link>
                    </div>
                
            </div>
            </div>
            
        

    </div>

    );
};

export default Register; 