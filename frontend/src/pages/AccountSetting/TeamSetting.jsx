import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

function TeamSetting() {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    name: "",
    robot_name: "",
    user_id: "",
    type: "",
    team_leader_name: "",
    team_leader_email: "",
    team_leader_phone_number: "",
    organization: {
      name: "",
      type: ""
    },
    sponsors: [],
    coach: [],
    social_media: [],
    previous_competition: [],
    members: [],
    competition_event: "",
    id: "",
    team_number: "",
    image: ""
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError("Authentication Error");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/team/user/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const initialData = {
          ...data,
          organization: data.organization || { name: "", type: "" },
          sponsors: data.sponsors || [],
          coach: data.coach || [],
          members: data.members || [],
        };

        setUserData(initialData);
        setOriginalData(JSON.parse(JSON.stringify(initialData)));
      } catch (err) {
        setError("Failed to load user data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setUserData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, template) => {
    setUserData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setUserData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const getChangedData = () => {
    if (!originalData) return userData;

    const changes = {};
    
    Object.keys(userData).forEach(key => {
      if (typeof userData[key] !== 'object' && userData[key] !== originalData[key]) {
        changes[key] = userData[key];
      }
    });

    if (JSON.stringify(userData.organization) !== JSON.stringify(originalData.organization)) {
      changes.organization = userData.organization;
    }

    ['coach', 'members'].forEach(arrayName => {
      if (JSON.stringify(userData[arrayName]) !== JSON.stringify(originalData[arrayName])) {
        changes[arrayName] = userData[arrayName];
      }
    });

    return changes;
  };

  const validateEmails = () => {
    const emails = new Set();
    
    if (userData.team_leader_email) {
      emails.add(userData.team_leader_email.toLowerCase());
    }

    for (const coach of userData.coach) {
      if (!coach.email) continue;
      const lowerEmail = coach.email.toLowerCase();
      if (emails.has(lowerEmail)) {
        return `Duplicate email found: ${coach.email}`;
      }
      emails.add(lowerEmail);
    }

    for (const member of userData.members) {
      if (!member.email) continue;
      const lowerEmail = member.email.toLowerCase();
      if (emails.has(lowerEmail)) {
        return `Duplicate email found: ${member.email}`;
      }
      emails.add(lowerEmail);
    }

    return null;
  };

  const handleSave = async () => {
    const emailError = validateEmails();
    if (emailError) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: emailError,
      });
      return;
    }

    if (!token) {
      setError("Authentication Error");
      return;
    }
    setSaving(true);

    try {
      const dataToSend = getChangedData();
      
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/team/${id}/edit/`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOriginalData(JSON.parse(JSON.stringify(userData)));
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      let errorMessage = "Failed to save changes";
      if (error.response) {
        if (error.response.data) {
          errorMessage = Object.values(error.response.data)
            .flatMap(err => Array.isArray(err) ? err : [err])
            .join("\n");
        }
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl mt-10 border border-red-200">
      <div className="text-center text-red-600 p-4 rounded-lg bg-red-50">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 shadow-sm rounded-lg mt-6 border border-gray-100">
      <Helmet>
        <title>Team Settings</title>
      </Helmet>
      
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Team Settings</h2>
        <p className="text-gray-600">Manage your team's information and members</p>
      </div>
      
      <div className="space-y-8 divide-y divide-gray-200">
        {/* Basic Information */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Robot Name</label>
              <input
                type="text"
                name="robot_name"
                value={userData.robot_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              />
            </div>
          </div>
        </div>

        {/* Team Leader */}
        <div className="pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Leader</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="team_leader_name"
                value={userData.team_leader_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="team_leader_email"
                value={userData.team_leader_email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="team_leader_phone_number"
                value={userData.team_leader_phone_number}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Organization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                name="organization.name"
                value={userData.organization.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
              <select
                name="organization.type"
                value={userData.organization.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border"
              >
                <option value="">Select type</option>
                <option value="school">School</option>
                <option value="club">Club</option>
                <option value="non-profit">Non-profit</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coaches */}
        <div className="pt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Coaches</h3>
            <button
              onClick={() => addArrayItem("coach", { name: "", email: "", phone_number: "", position: "" })}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Add Coach
            </button>
          </div>
          
          {userData.coach.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              No coaches added yet
            </div>
          ) : (
            <div className="space-y-4">
              {userData.coach.map((coach, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Coach name"
                      value={coach.name}
                      onChange={(e) => handleArrayChange("coach", index, "name", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={coach.email}
                      onChange={(e) => handleArrayChange("coach", index, "email", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={coach.phone_number}
                      onChange={(e) => handleArrayChange("coach", index, "phone_number", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
                    <input
                      type="text"
                      placeholder="Position"
                      value={coach.position}
                      onChange={(e) => handleArrayChange("coach", index, "position", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      onClick={() => removeArrayItem("coach", index)}
                      className="w-full py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="pt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
            <button
              onClick={() => addArrayItem("members", { name: "", email: "", phone_number: "" })}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Add Member
            </button>
          </div>
          
          {userData.members.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              No members added yet
            </div>
          ) : (
            <div className="space-y-4">
              {userData.members.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) => handleArrayChange("members", index, "name", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={member.email}
                      onChange={(e) => handleArrayChange("members", index, "email", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={member.phone_number}
                      onChange={(e) => handleArrayChange("members", index, "phone_number", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 px-3 py-2 border text-sm"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      onClick={() => removeArrayItem("members", index)}
                      className="w-full py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-8">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-400"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamSetting;