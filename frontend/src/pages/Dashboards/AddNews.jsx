// import { useState, useEffect } from "react";
// import { jwtDecode } from 'jwt-decode';
// import { FcGoogle } from "react-icons/fc";

// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { VscEye, VscEyeClosed } from "react-icons/vsc";


// const AddNews = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const navigate = useNavigate();


//  const handlePasswordVisibility = () => {
//             setPasswordVisible(prevState => !prevState);
//           };
//     const signIn = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         if (!username || !password) {
//             setError("Username and password are required.");
//             setLoading(false);
//             return;
//         }

//         try {
//             console.log("REACT_APP_API_URL_AUTH" , process.env.REACT_APP_API_URL_AUTH);
//             const { data } = await axios.post(
//                 `${process.env.REACT_APP_API_URL_AUTH}/login/`,
//                 { username, password },
//                 {
//                     headers: { "Content-Type": "application/json" },
//                     withCredentials: true
//                 }
//             );

       

//             const decodedToken = jwtDecode(data.access_token);
//             localStorage.setItem("user_role", JSON.stringify({
//                 is_superuser: decodedToken?.is_superuser || false,
//                 is_staff: decodedToken?.is_staff || false,
//             }));

//             navigate("/", { replace: true });

//         } catch (err) {
//             setError(err.response?.data?.detail || "Login failed. Check your credentials.");
//         } finally {
//             setLoading(false);
//         }
//     };



//     return (
//         <div
//          >
//             <div id="loginForm" className="relative  flex bg-white rounded-2xl mb-10 shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                
//                 <div className="w-full p-8 lg:w-1/2 flex flex-col mx-auto">
                   
//                     <form className="mt-6" onSubmit={signIn}>
//                         {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
//                         <div>
//                             <textarea id="newsInput" rows="5" cols="50" className="p-10" placeholder="Enter news content here..."></textarea>
//                         </div>
                       
                        
//                         <button
//                             type="submit"
//                             className={`mt-8 font-bold py-2 px-4 w-full rounded ${
//                                 loading
//                                     ? "bg-gray-400 cursor-not-allowed"
//                                     : "bg-cyan-800 hover:bg-cyan-600"
//                             } transition-all duration-700 cursor-pointer text-white`}
//                             disabled={loading}
//                         >
//                             {loading ? "Adding..." : "Add News"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddNews;
import React, { useState } from "react";

const AddNews = () => {
  const [newsData, setNewsData] = useState({
    user_username: "neklawi",
    content: ""
  });

  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/notification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newsData) // تحويل الكائن إلى JSON
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("News updated successfully:", result);

      // إعادة تعيين الحقل content فقط
      setNewsData({ ...newsData, content: "" });
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleContentChange = (e) => {
    setNewsData({ ...newsData, content: e.target.value });
  };

  return (
    <div className="max-h-screen bg-gray-100 py-20">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="mb-6 pt-4 pb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-3xl sm:text-4xl md:text-5xl font-black">
          New News
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Textarea for news input */}
          <textarea
            id="newsInput"
            placeholder="Enter news content here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            rows={6}
            value={newsData.content}
            onChange={handleContentChange} // استخدام الدالة الجديدة لتحديث المحتوى
          />

          {/* Update News Button */}
          <button
            type="submit"
            className="mt-8 font-bold py-2 px-4 w-full rounded bg-cyan-800 hover:bg-cyan-600 transition-all duration-700 cursor-pointer text-white"
          >
            Update News
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNews;