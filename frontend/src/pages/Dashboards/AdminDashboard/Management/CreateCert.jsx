import React, { useState } from 'react'
import { FaTrophy, FaMedal, FaSyncAlt, FaRobot, FaCar, FaListOl } from "react-icons/fa";

export default function CreateCert() {

const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-cyan-900"></div>
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-cyan-900"></div>
        <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-cyan-900"></div>
        <div className="absolute bottom-0 left-0 right-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-cyan-900"></div>
        
        <div className="flex flex-col items-center">
        <FaTrophy className="text-6xl text-amber-400" />
          <h2 className="text-xl font-semibold mt-2">Create Certificate </h2>
        </div>

        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Compitation Name</label>
            <select
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="">Select a compitation</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Event Name</label>
            <select
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="">Select a Event</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <select
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="">Select Team</option>
            </select>
          </div>

       

          <button
            type="submit"
            className="w-full bg-cyan-700 hover:bg-t-00 text-white py-2 rounded-md font-semibold transition-colors"
          >
            create certificate
          </button>
        </form>
      </div>
    </div>
  );
}