// Layout.js
import React from "react";
import Sidebar from "../../../components/Dashboards/Sidebar";
import Navbar from "../../../components/Dashboards/Navbar";

const LayoutDashboard = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default LayoutDashboard;
