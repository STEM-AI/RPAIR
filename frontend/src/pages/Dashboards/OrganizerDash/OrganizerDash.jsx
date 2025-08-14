import React, { useEffect, useState } from 'react'
import CreateEvent from '../AdminDashboard/Management/CreateEvent'
import axios from 'axios';

export default function OrganizerDash() {
  const [userData, setUserData] = useState({});
  const [status, setStatus] = useState(null); // Use null for initial state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/data/profile/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(response.data);
        
        // Safely handle organization data
        if (response.data.organization?.length > 0) {
          setStatus(response.data.organization[0].is_active);
        } else {
          setError("No organization data found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl shadow-lg p-6 text-white text-center flex flex-col justify-center items-center h-dvh">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold mb-2">Error Occurred</h2>
        <p className="text-xl mb-4">{error}</p>
        <p className="text-sm">Please try refreshing the page or contact support</p>
      </div>
    );
  }

  // Handle unverified organization state
  if (status === false) {
    return (
      <div className="bg-gradient-to-r from-green-400 to-green-700 rounded-xl shadow-lg overflow-hidden flex justify-center items-center h-dvh">
        <div className="p-6 text-white text-center">
          <div className="text-7xl mb-4">⏳</div>
          <h2 className="text-5xl font-bold mb-2">Pending Approval</h2>
          <p className="mb-4 text-xl">
            Your organization <span className="font-semibold">{userData.organization?.[0]?.name || ''}</span> is currently under administrative review
          </p>
        </div>
      </div>
    );
  }

  // Main content when organization is verified
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-400 to-blue-700 p-4 text-white">
        <h2 className="text-xl font-bold">Your account is active!</h2>
        <p>You can now create and manage events</p>
      </div>
                <CreateEvent orgID={userData.organization?.[0]?.id}  />
    </div>
  );
}