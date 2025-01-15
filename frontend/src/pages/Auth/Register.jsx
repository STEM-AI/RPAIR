import axios from "axios";
import {React,useState} from "react"; 
import logo from "../../assets/logo/logoWrite-re.png"
import { FcGoogle } from "react-icons/fc";
import bgimg from "../../assets/imgs/aboutus/bg.png"
import { Link, Navigate } from "react-router-dom";

const Register = () => {
        const [firstname,setFirstname] =useState("")
        const [lastname,setLastname] =useState("")
        const [username,setUsername] =useState("")
        const [email,setEmail] =useState("")
        const [password,setPassword] =useState("")
        const [country,setCountry] =useState("")
        const [address,setAddress] =useState("")
        const [dateofbirth,setDateofbirth] =useState("")
        const [phonenumber, setPhonenumber] = useState("")
        const [navigate, setNavigate] = useState(false);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
          
        const signUp = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            try {
                const { data } = await axios.post(
                    'http://147.93.56.71:8000/api/user/auth/user-register/',
                    { username, password },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );

                // Save token to axios defaults and localStorage
                axios.defaults.headers.common['Authorization'] = `Bearer ${data['access_token']}`;
                localStorage.setItem('access_token', data.access_token);
                
                // Print token stored in localStorage
                console.log("Access token saved to localStorage:", localStorage.getItem('access_token'));
                
                setNavigate(true);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to login. Please check your credentials.");
            } finally {
                setLoading(false);
            }
        };

        if (navigate) {
            return <Navigate to="/dashbord/Admin" />;
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
       
            
        <div id="signUpForm" className="relative flex bg-white rounded-2xl  shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-5xl">
            
            <div className="w-full p-8 lg:w-1/2 flex flex-col mx-auto">
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
              {error && <div className="mt-4 text-sm text-red-600">{error}</div>} 
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className={`block mb-2 text-sm font-bold text-gray-700`}
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:ml-2">
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
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className={`block mb-2 text-sm font-bold text-gray-700`}
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
                  <div className="md:ml-2">
                    <label
                      className={`block mb-2 text-sm font-bold text-gray-700 `}
                      htmlFor="lastName"
                    >
                      Date of Birth
                    </label>
                    <input
                    className="bg-gray-200  text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="date_of_birth"
                    type="date"
                    value={dateofbirth}
                      onChange={(e) => setDateofbirth(e.target.value)}
                      required
                    />
                  </div>
                </div>
               
                <div className="mb-4">
                  <label
                    className={`block mb-2 text-sm font-bold  text-gray-700`}
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
                <div className="mb-4">
                  <label
                    className={`block mb-2 text-sm font-bold  text-gray-700`}
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
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      required
                    />
                </div>
                <div className="mb-4">
                  <label
                    className={`block mb-2 text-sm font-bold  text-gray-700`}
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className={`block mb-2 text-sm font-bold  text-gray-700 `}
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                      id="password"
                      type="password"
                      placeholder="******************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                </div>
                <div className="mb-6 text-center">
                    <button
                            type="submit"
                            className={`mt-8 font-bold py-2 px-4 w-full rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-800 hover:bg-cyan-600"} text-white`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
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