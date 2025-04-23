import React from "react";
import { BiSolidJoystick } from "react-icons/bi";

const DriverRoundsComponent = ({ matches }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4">
        <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
          <BiSolidJoystick /> Driver Rounds
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matches.filter(team => team.round === 2).map((team) => (
              <tr key={`driver-${team.code}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{team.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{team.team1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {team.score.driver > 0 ? (
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-medium">
                      {team.score.driver}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverRoundsComponent;