import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-4 text-lg font-bold">Admin Panel</div>
      <div className="flex-1">
        <ul className="space-y-2 p-4">
          <li className="hover:bg-blue-700 p-2 rounded">Dashboard</li>
          <li className="hover:bg-blue-700 p-2 rounded">Users</li>
          <li className="hover:bg-blue-700 p-2 rounded">Settings</li>
          <li className="hover:bg-blue-700 p-2 rounded">Reports</li>
          <li className="hover:bg-blue-700 p-2 rounded">Logout</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
