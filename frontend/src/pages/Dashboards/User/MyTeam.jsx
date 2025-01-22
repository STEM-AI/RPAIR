import React from 'react';

export default function MyTeam() {
  const token = localStorage.getItem("access_token");

  return (
    <div className="h-screen flex justify-center items-center">
      <div id="createTeam">
        <button className="text-4xl bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200">
          Create Team
        </button>
      </div>
    </div>
  );
}
