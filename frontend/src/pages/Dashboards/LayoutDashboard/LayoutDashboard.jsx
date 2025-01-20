// Layout.js
import React from "react";
import Navbar from "../../../components/Dashboards/Navbar";
import SidebarAdmin from "../../../components/Dashboards/Sidebar/SidebarAdmin";
import SidebarJadge from "../../../components/Dashboards/Sidebar/SidebarJadge";
import SidebarUser from "../../../components/Dashboards/Sidebar/SidebarUser";

const LayoutDashboard = ({ children }) => {
      // Get user role from localStorage
    const userRole = JSON.parse(localStorage.getItem("user_role"));

    let Sidebar;
    if (userRole) {
        if (userRole.is_superuser) {
            Sidebar = SidebarAdmin;
        } else if (userRole.is_staff && !userRole.is_judge) {
            Sidebar = SidebarJadge;
        } else {
            Sidebar = SidebarUser;
        }
    } else {
        // Default fallback if role data is missing
        Sidebar = () => <div>No Access</div>;
    }  
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
