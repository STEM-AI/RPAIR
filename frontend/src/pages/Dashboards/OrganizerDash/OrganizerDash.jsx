import React, { useEffect, useState } from 'react'

import CreateEvent from '../AdminDashboard/Management/CreateEvent'
import axios from 'axios';
export default function OrganizerDash() {
  const [userData, setUserData] = useState({});
  const [status , setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

   useEffect(() => {
      const fetchUserData = async () => {
        if (!token) {
          setError("Authentication Error");
          setLoading(false);
          return;
        }
  
        try {
          const  response  = await axios.get(`${process.env.REACT_APP_API_URL}/user/data/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setUserData(response.data);
          console.log("API Response:", response.data);
          console.log("API Active:", response.data.organization[0].is_active);
          setStatus(response.data.organization[0].is_active)


          

        } catch {
          setError("Failed to load user data");
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [token]);
  
  return (
    <div>
      {status === true ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-blue-700 p-4 text-white">
          <h2 className="text-xl font-bold">Your account is active!</h2>
          <p>You can now create and manage events</p>
        </div>
        <CreateEvent />
      </div>
      ) : (

         <div className="bg-gradient-to-r from-green-400 to-green-700 rounded-xl shadow-lg overflow-hidden  flex justify-center items-center h-dvh ">
              <div className="p-6 text-white text-center">
                <div className="text-7xl mb-4">⏳</div>
                <h2 className="text-5xl font-bold mb-2">Pending Approval</h2>
                <p className="mb-4">
                  Your organization <span className="font-semibold">{userData.organization?.[0]?.name || ''}</span> is currently Under Administrative Review
                </p>
                </div>
            </div>
        )}
    </div>
  )
}
