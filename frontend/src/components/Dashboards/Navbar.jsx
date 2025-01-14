import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="text-gray-700">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md px-4 py-2 w-72"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <span className="material-icons">notifications</span>
        </button>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <span className="material-icons">settings</span>
        </button>
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
