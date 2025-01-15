// import React from "react";

// const Navbar = () => {
//   return (
//     <div className="flex items-center justify-between bg-white p-4 shadow-md">
//       <div className="text-gray-700">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="border rounded-md px-4 py-2 w-72"
//         />
//       </div>
//       <div className="flex items-center space-x-4">
//         <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
//           <span className="material-icons">notifications</span>
//         </button>
//         <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
//           <span className="material-icons">settings</span>
//         </button>
//         <div className="flex items-center space-x-2">
//           <img
//             src="https://via.placeholder.com/40"
//             alt="profile"
//             className="w-10 h-10 rounded-full"
//           />
//           <span className="text-gray-700 font-medium">Admin Name</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// import React from "react";

// const Navbar = () => {
//   return (
//     <div className="flex items-center justify-between bg-white p-4 shadow-md ml-64 w-full">
//       <div className="text-gray-700">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="border rounded-md px-4 py-2 w-72"
//         />
//       </div>
//       <div className="flex items-center space-x-4">
//         <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
//           <span className="material-icons">notifications</span>
//         </button>
//         <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
//           <span className="material-icons">settings</span>
//         </button>
//         <div className="flex items-center space-x-2">
//           <img
//             src="https://via.placeholder.com/40"
//             alt="profile"
//             className="w-10 h-10 rounded-full"
//           />
//           <span className="text-gray-700 font-medium">Admin Name</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md w-full">
      {/* قائمة البحث */}
      <div className="text-gray-700 flex items-center w-full max-w-4xl">
        <button className="lg:hidden p-2 text-gray-700" aria-label="Menu">
          <span className="material-icons">menu</span>
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md px-4 py-2 w-full max-w-md lg:max-w-80"
        />
      </div>
      
      {/* الأزرار والصورة */}
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <span className="material-icons">notifications</span>
        </button>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <span className="material-icons">settings</span>
        </button>
        
        {/* صورة الملف الشخصي */}
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-gray-700 font-medium">Admin Name</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
