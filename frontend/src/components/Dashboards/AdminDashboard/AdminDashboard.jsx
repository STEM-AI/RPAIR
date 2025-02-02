
import React from 'react';

function AdminDashboard() {
  const competitions = [
    {
      id: 1,
      name: 'Competition 1',
      date: '2025-01-20',
      time: '10:00 AM',
      location: 'New York',
      status: 'active',
    },
    {
      id: 2,
      name: 'VEX IQ Competition',
      date: '2025-02-14',
      time: '10:00 AM',
      location: '6 October',
      status: 'upcoming',
    },
    {
      id: 3,
      name: 'Mobile Application Competition',
      date: '2025-05-20',
      time: '02:00 PM',
      location: 'Cairo, Egypt',
      status: 'upcoming',
    },
    {
      id: 4,
      name: 'VEX IQ Competition',
      date: '2024-12-26',
      time: '10:00 AM',
      location: 'Alexandria, Egypt',
      status: 'completed',
    }
    
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return '';
    }
  };

  return (
    <div className="p-6  mt-20">
      <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
              Welcome, Admin
            </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {competitions.map((competition) => (
          <div
            key={competition.id}
            className={`p-4 rounded-lg shadow-md ${getStatusStyle(competition.status)}`}
          >
            <h2 className="text-lg font-semibold mb-2">{competition.name}</h2>
            <p className="mb-1">Date: {competition.date}</p>
            <p className="mb-1">Time: {competition.time}</p>
            <p className="mb-1">Location: {competition.location}</p>
            <span className="block mt-2 font-medium capitalize">Status: {competition.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;


