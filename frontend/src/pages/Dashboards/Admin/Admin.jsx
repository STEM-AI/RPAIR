import React from "react";
import Sidebar from "../../../components/Dashboards/Sidebar";
import Navbar from "../../../components/Dashboards/Navbar";

function Admin() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          {/* محتوى الصفحة هنا */}
        </div>
      </div>
    </div>
  );
}

export default Admin;
