

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function AdminSetting() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    country: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setError("Authentication Error");
      setLoading(false);
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/user/data/profile/`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
          country: data.country || "",
          phone_number: data.phone_number || "",
          date_of_birth: data.date_of_birth || "",
          address: data.address || "",
        });
        
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user data");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!token) {
      setError("Authentication Error");
      return;
    }
    setSaving(true);

    const updatedData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      email: userData.email,
      country: userData.country,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/data/edit-profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save changes");
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-cyan-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-cyan-600 mb-6 text-center">Account Settings</h2>
      <div className="grid grid-cols-2 gap-6">
        {Object.keys(userData).map((key) => (
          <div key={key} className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-semibold text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
            <input
              type={key === "email" ? "email" : "text"}
              name={key}
              value={userData[key]}
              onChange={key === "phone_number" || key === "date_of_birth" ? undefined : handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              readOnly={key === "phone_number" || key === "date_of_birth"}
            />
          </div>
        ))}
        <div className="col-span-2 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-1/2 bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition text-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSetting;