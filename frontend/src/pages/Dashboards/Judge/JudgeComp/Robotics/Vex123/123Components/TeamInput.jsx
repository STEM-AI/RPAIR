export default function TeamInput({ teamName, setTeamName }) {
    return (
      <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
        <label className="block text-sm sm:text-base font-semibold text-indigo-700 mb-1">👥 Team Name</label>
        <input
          type="text"
          placeholder="Enter Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white text-sm sm:text-base"
        />
      </div>
    );
  }