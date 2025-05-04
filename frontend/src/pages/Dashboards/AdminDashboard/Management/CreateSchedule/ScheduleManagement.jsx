import React, { useState } from "react";
import GameScheduleForm from "./GameScheduleForm";
import DeleteSchedule from "./DeleteSchedule";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const ScheduleManagement = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="  p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Tab Switcher */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setActiveTab("create")}
            className={`group flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold transition-all duration-300 transform
              ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white text-gray-600 shadow-sm hover:bg-cyan-50 hover:shadow-md"
              }`}
          >
            <FiPlus className="transition-transform duration-300 group-hover:translate-x-1" />
            Create Schedule
          </button>
          
          <button
            onClick={() => setActiveTab("delete")}
            className={`group flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold transition-all duration-300 transform
              ${
                activeTab === "delete"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:shadow-md"
              }`}
          >
            <FiTrash2 className="transition-transform duration-300 group-hover:translate-x-1" />
            Delete Schedule
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300">
          {activeTab === "create" ? <GameScheduleForm /> : <DeleteSchedule />}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;