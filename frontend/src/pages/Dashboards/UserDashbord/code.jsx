import React from 'react'

export default function code() {
  return (
      <div>
          {/* Member */}
      {/* <div>
  <label className="block font-medium text-gray-700">Team Members</label>
  {formData.members.map((member, index) => (
    <div key={index} className="space-y-2 mb-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Member Name"
          value={member.name}
          onChange={(e) => handleChange(e, "members", index, "name")}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <input
          type="email"
          placeholder="Member Email"
          value={member.email}
          onChange={(e) => handleChange(e, "members", index, "email")}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={member.phone_number}
          onChange={(e) => handleChange(e, "members", index, "phone_number")}
          className="flex-1 border rounded-lg px-3 py-2"
        />
      </div>
      <button
        type="button"
        onClick={() => removeField("members", index)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
      >
        Remove Member
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => addField("members")}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
  >
    Add Member
  </button>
</div> */}

    </div>
  )
}

/*
import React, { useState } from "react";
import axios from "axios";

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    organization_info: {
      name: "",
      address: "",
      type: "",
      email: "",
      contacts: [{ phone_number: "" }],
    },
    name: "",
    robot_name: "",
    type: "",
    team_leader_name: "",
    team_leader_email: "",
    team_leader_phone_number: "",
    competition: "",
    members: [{ name: "", email: "", phone_number: "" }],
    sponsors: [{ name: "", email: "" }],
    previous_competition: [{ name: "" }],
    coach: [{ name: "", email: "", phone_number: "", position: "" }],
    social_media: [{ platform: "", url: "" }],
  });

  const handleChange = (e, section, index, key) => {
    if (section) {
      const updatedSection = [...formData[section]];
      if (index !== undefined) {
        updatedSection[index][key] = e.target.value;
      } else {
        updatedSection[key] = e.target.value;
      }
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addField = (section) => {
    const newField = Array.isArray(formData[section][0])
      ? {}
      : Object.keys(formData[section][0]).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {});
    setFormData({
      ...formData,
      [section]: [...formData[section], newField],
    });
  };

  const removeField = (section, index) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        "http://147.93.56.71:8000/api/team/create-team/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Team created successfully:", response.data);
    } catch (error) {
      console.error("Error creating team:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            name="organization_info.name"
            value={formData.organization_info.name}
            onChange={(e) => handleChange(e, "organization_info", null, "name")}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="organization_info.address"
            value={formData.organization_info.address}
            onChange={(e) =>
              handleChange(e, "organization_info", null, "address")
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="organization_info.email"
            value={formData.organization_info.email}
            onChange={(e) =>
              handleChange(e, "organization_info", null, "email")
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Contacts</label>
          {formData.organization_info.contacts.map((contact, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={contact.phone_number}
                onChange={(e) =>
                  handleChange(e, "organization_info.contacts", index, "phone_number")
                }
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={() =>
                  removeField("organization_info.contacts", index)
                }
                className="bg-red-500 text-white px-2 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("organization_info.contacts")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Contact
          </button>
        </div>

<div>
  <label className="block font-medium text-gray-700">Team Members</label>
  {formData.members.map((member, index) => (
    <div key={index} className="space-y-2 mb-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Member Name"
          value={member.name}
          onChange={(e) => handleChange(e, "members", index, "name")}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <input
          type="email"
          placeholder="Member Email"
          value={member.email}
          onChange={(e) => handleChange(e, "members", index, "email")}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={member.phone_number}
          onChange={(e) => handleChange(e, "members", index, "phone_number")}
          className="flex-1 border rounded-lg px-3 py-2"
        />
      </div>
      <button
        type="button"
        onClick={() => removeField("members", index)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
      >
        Remove Member
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => addField("members")}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
  >
    Add Member
  </button>
</div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;

*/ 