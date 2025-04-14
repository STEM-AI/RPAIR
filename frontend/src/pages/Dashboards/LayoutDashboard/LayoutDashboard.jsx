// Layout.js
import React from "react";
import NavbarProfile from "../../../pages/Dashboards/NavbarProfile";
import Sidebar from "../Sidebar/Sidebar";
import Back from "../../../components/Back/Back";

const LayoutDashboard = ({ children }) => {
    
  return (
     <div className="flex h-screen bg-gray-100">
      <Sidebar className="relative left-0 w-64 h-full z-50 bg-green-500 p-4" />
      <div className="flex-1 flex flex-col">
        <NavbarProfile className="bg-blue-600 text-white p-4 sticky top-0" />
        <div className="p-6 flex-1 overflow-auto ">{children}</div>
        <Back />
      </div>
    </div>
  );
};

export default LayoutDashboard;

