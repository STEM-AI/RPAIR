import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

function TeamSetting() {
  const { team_name } = useParams();
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
          `${process.env.REACT_APP_API_URL}/team/user/${team_name}/`,
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
        setOriginalData(JSON.parse(JSON.stringify(initialData))); // Deep copy
      } catch (err) {
        setError("Failed to load user data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, team_name]);

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
    
    // Compare top-level fields
    Object.keys(userData).forEach(key => {
      if (typeof userData[key] !== 'object' && userData[key] !== originalData[key]) {
        changes[key] = userData[key];
      }
    });

    // Compare organization
    if (JSON.stringify(userData.organization) !== JSON.stringify(originalData.organization)) {
      changes.organization = userData.organization;
    }

    // Compare arrays (coach and members)
    ['coach', 'members'].forEach(arrayName => {
      if (JSON.stringify(userData[arrayName]) !== JSON.stringify(originalData[arrayName])) {
        changes[arrayName] = userData[arrayName];
      }
    });

    return changes;
  };

  const validateEmails = () => {
    const emails = new Set();
    
    // Check team leader email
    if (userData.team_leader_email) {
      emails.add(userData.team_leader_email.toLowerCase());
    }

    // Check coaches emails
    for (const coach of userData.coach) {
      if (!coach.email) continue;
      const lowerEmail = coach.email.toLowerCase();
      if (emails.has(lowerEmail)) {
        return `Duplicate email found: ${coach.email}`;
      }
      emails.add(lowerEmail);
    }

    // Check members emails
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
        `${process.env.REACT_APP_API_URL}/team/${team_name}/edit/`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update original data after successful save
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

  if (loading) return <p className="text-center text-cyan-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl mt-10 border border-gray-200">
      <Helmet>
        <title>Team Settings</title>
      </Helmet>
      <h2 className="text-3xl font-bold text-cyan-600 mb-6 text-center">Team Settings</h2>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Robot Name</label>
            <input
              type="text"
              name="robot_name"
              value={userData.robot_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Team Leader */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Team Leader</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="team_leader_name"
                value={userData.team_leader_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="team_leader_email"
                value={userData.team_leader_email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="team_leader_phone_number"
                value={userData.team_leader_phone_number}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Organization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input
                type="text"
                name="organization.name"
                value={userData.organization.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Type</label>
              <input
                type="text"
                name="organization.type"
                value={userData.organization.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Coaches */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Coaches</h3>
          {userData.coach.map((coach, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={coach.name}
                onChange={(e) => handleArrayChange("coach", index, "name", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={coach.email}
                onChange={(e) => handleArrayChange("coach", index, "email", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={coach.phone_number}
                onChange={(e) => handleArrayChange("coach", index, "phone_number", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Position"
                  value={coach.position}
                  onChange={(e) => handleArrayChange("coach", index, "position", e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                />
                <button
                  onClick={() => removeArrayItem("coach", index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("coach", { name: "", email: "", phone_number: "", position: "" })}
            className="mt-2 text-cyan-600 hover:text-cyan-700 text-sm"
          >
            + Add Coach
          </button>
        </div>

        {/* Members */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
          {userData.members.map((member, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => handleArrayChange("members", index, "name", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={member.email}
                onChange={(e) => handleArrayChange("members", index, "email", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={member.phone_number}
                  onChange={(e) => handleArrayChange("members", index, "phone_number", e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                />
                <button
                  onClick={() => removeArrayItem("members", index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("members", { name: "", email: "", phone_number: "" })}
            className="mt-2 text-cyan-600 hover:text-cyan-700 text-sm"
          >
            + Add Member
          </button>
        </div>

        {/* Save Button */}
        <div className="border-t pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 disabled:bg-gray-400 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamSetting;