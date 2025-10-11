import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarProfile from "../../../pages/Dashboards/NavbarProfile";
import Sidebar from "../Sidebar/Sidebar";
import Back from "../../../components/Back/Back";

const LayoutDashboard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenBackPaths = [
    "/Dashboard/VexGO/COOPMatches",
    "/Dashboard/VexGO/Skills",
  ];
  const shouldHideBack = hiddenBackPaths.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); 
    if (!token) {
      navigate("/login"); 
    }
  }, [navigate]);

  return (
    <div className="flex ">
      <Sidebar
        className="relative left-0 bottom-0 w-64 h-screen z-50 bg-green-500 p-4"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex h-screen flex-col">
        <NavbarProfile
          className="bg-blue-600 text-white p-4 sticky top-0"
          isSidebarOpen={isSidebarOpen}
        />

        <div className="p-6 flex-1 overflow-auto bg-gray-100">
          {!shouldHideBack && <Back />}
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutDashboard;
