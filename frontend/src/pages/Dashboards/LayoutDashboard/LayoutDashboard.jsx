// Layout.js
import React from "react";
import NavbarProfile from "../../../pages/Dashboards/NavbarProfile";
import SidebarAdmin from "../Sidebar/SidebarAdmin";
import SidebarJadge from "../Sidebar/SidebarJadge";
import SidebarUser from "../Sidebar/SidebarUser"

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
        Sidebar = () => <div>No Access</div>;
    }  
  return (
    <div className="flex h-screen bg-gray-100">
              <NavbarProfile className="fixed top-0 left-0 w-full " />
      <Sidebar className="fixed top-16 left-0 w-64 h-full z-50"  />
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-auto ">{children}</div>

      </div>
    </div>
  );
};

export default LayoutDashboard;
