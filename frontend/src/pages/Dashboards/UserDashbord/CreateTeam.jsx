import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { IoAddCircle } from "react-icons/io5";
import { IoIosRemoveCircle } from "react-icons/io";

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    competition_event: "",
    competition: "",
    organization_info: {
      name: "",
      address: "",
      email: "",
      type: "",
      contacts: [{ phone_number: "" }],
    },
    name: "",
    robot_name: "",
    type: "",
    team_leader_name: "",
    team_leader_email: "",
    team_leader_phone_number: "",
    sponsors: [{ name: "", email: "" }],
    coach: [{ name: "", email: "", phone_number: "", position: "" }],
    social_media: [{ platform: "", url: "" }],
    previous_competition: [{ name: "", year: "" }],
    members: [{ name: "", email: "", phone_number: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const handleChange = (e, section, index, key, subSection) => {
    const value = e.target.value;
    
  

    if (subSection) {
      setFormData((prev) => {
        const updatedSection = [...prev[section][subSection]];
        updatedSection[index][key] = value;
        return {
          ...prev,
          [section]: { ...prev[section], [subSection]: updatedSection },
        };
      });
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: Array.isArray(prev[section])
          ? prev[section].map((item, i) =>
              i === index ? { ...item, [key]: value } : item
            )
          : { ...prev[section], [key]: value },
      }));
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleAddItem = (section, newItem, subSection) => {
    if (subSection) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: [...prev[section][subSection], newItem],
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [section]: [...prev[section], newItem] }));
    }
  };

  const handleRemoveItem = (section, index, subSection) => {
    if (subSection) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: prev[section][subSection].filter((_, i) => i !== index),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      }));
    }
  };

   const token = localStorage.getItem("access_token");
  

  if (!token) {
    return (
      <div className="text-red-600 text-center mt-8">
        You are not authorized. Please log in.
      </div>
    );
  }
  const handleSubmit = async (event) => {
  event.preventDefault();
  setIsSubmitting(true);
  setResponseMessage(null);

  try {
    const response = await axios.post( // هنا خزّنا الـ response
      `${process.env.REACT_APP_API_URL}/team/create/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAlertType("success");
    setResponseMessage("Event created successfully!");
    console.log("Response Data:", response.data); 

    setFormData({
      competition_event: "",
      competition: "",
      organization_info: {
        name: "",
        address: "",
        email: "",
        type: "",
        contacts: [{ phone_number: "" }],
      },
      name: "",
      robot_name: "",
      type: "",
      team_leader_name: "",
      team_leader_email: "",
      team_leader_phone_number: "",
      sponsors: [{ name: "", email: "" }],
      coach: [{ name: "", email: "", phone_number: "", position: "" }],
      social_media: [{ platform: "", url: "" }],
      previous_competition: [{ name: "", year: "" }],
      members: [{ name: "", email: "", phone_number: "" }],
    });
     Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Registration successful!",
                    showConfirmButton: false,
                      });
    return response.data; 
  } catch (err) {
    console.error("Error Response:", err.response); 
    setAlertType("error");
    setResponseMessage(
      err.response?.data?.detail || "Failed to create the event. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="mb-5 py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-3xl md:text-4xl font-black text-center">
        Create a Team
      </h2>
      
        {responseMessage && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity={alertType}>
              <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
              {responseMessage}
            </Alert>
          </Stack>
        )}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Event Name</label>
            <input
              type="text"
              name="competition_event"
              value={formData.competition_event}
              onChange={handleChange}
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Competition Name</label>
            <input
              type="text"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
            />
          </div>
        </div>
        {/* Organization Info */}
        <div className="organizationInfo">
          <h3 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Organization Info:
          </h3>
          <div className="md:flex md:justify-between">
            <div className="md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Organization Name</label>
              <input
                type="text"
                value={formData.organization_info.name}
                onChange={(e) => handleChange(e, "organization_info", null, "name")}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className="md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Address</label>
              <input
                type="text"
                value={formData.organization_info.address}
                onChange={(e) => handleChange(e, "organization_info", null, "address")}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className="md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Type</label>
              <input
                type="text"
                value={formData.organization_info.type}
                onChange={(e) => handleChange(e, "organization_info", null, "type")}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
              />
            </div>
          </div>
          <div className="md:mr-2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
            <input
              type="email"
              value={formData.organization_info.email}
              onChange={(e) => handleChange(e, "organization_info", null, "email")}
              className="bg-gray-200 border rounded py-2 px-4 w-full"
            />
          </div>

          {/* Organization Contacts */}
          <h4 className="mt-4 text-lg font-bold">Contacts</h4>
          {formData.organization_info.contacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                 placeholder="enter your phone"
                   pattern="^\+20\d{10}$"
                  title="Phone number must start with +2 and contain 12 digits."
                value={contact.phone_number}
                onChange={(e) =>
                  handleChange(e, "organization_info", index, "phone_number", "contacts")
                }
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem("organization_info", index, "contacts")}
                className="text-red-500"
              >
                <IoIosRemoveCircle size={24} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("organization_info", { phone_number: "" }, "contacts")
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add Contact
          </button>
        </div>

        {/* Team Info */}
        <div className="teamInfo">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Team Info:
          </h3>
          <div className=" md:flex md:justify-between  ">
            <div className=" md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Team Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className=" md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Robot Name</label>
              <input
                type="text"
                name="robot_name"
                value={formData.robot_name}
                onChange={handleChange}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className=" md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Team Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
          </div>
        </div>
        {/* Team Leader Info */}
        <div className="teamLeader">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Team Leader Info:
          </h3>
          <div className=" md:flex md:justify-between">
            <div className=" md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
              <input
                type="text"
                name="team_leader_name"
                value={formData.team_leader_name}
                onChange={handleChange}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className=" md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
              <input
                type="email"
                name="team_leader_email"
                value={formData.team_leader_email}
                onChange={handleChange}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className="md:mr-2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
              <input
                type="text"
                name="team_leader_phone_number"
                placeholder="enter your phone"
                   pattern="^\+20\d{10}$"
                  title="Phone number must start with +2 and contain 12 digits."
                value={formData.team_leader_phone_number}
                onChange={handleChange}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
          </div>
        </div>
        {/* Sponsors Info */}
        <div className="sponsors">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Sponsors Info:
          </h3>
          {formData.sponsors.map((sponsor, index) => (
            <div key={index} className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
              <div className="w-full md:w-1/2">
                <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                <input
                  type="text"
                  value={sponsor.name}
                  onChange={(e) => handleChange(e, "sponsors", index, "name")}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  value={sponsor.email}
                  onChange={(e) => handleChange(e, "sponsors", index, "email")}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              </div>
              {index >= 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button type="button" onClick={() => handleRemoveItem("sponsors", index)}>
                    <IoIosRemoveCircle className="text-red-500 bg-white text-3xl hover:text-red-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("sponsors", { name: "", email: "" })
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add Sponsor
          </button>
        </div>
        {/* previous_competition Info */}
        <div className="previous_competition">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Previous Competition :
          </h3>
          {formData.previous_competition.map((competition, index) => (
            <div key={index} className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
              <div className="w-full md:w-1/2">
                <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                <input
                  type="text"
                  value={competition.name}
                  onChange={(e) => handleChange(e, "previous_competition", index, "name")}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block mb-2 text-sm font-bold text-gray-700">Year</label>
                <input
                  type="date"
                  value={competition.year}
                  onChange={(e) => handleChange(e, "previous_competition", index, "year")}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              </div>
              {index >= 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button type="button" onClick={() => handleRemoveItem("previous_competition", index)}>
                    <IoIosRemoveCircle className="text-red-500 bg-white text-3xl hover:text-red-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("previous_competition", { name: "", year: "" })
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add Previous Competition
          </button>
        </div>
        {/* coach Info */}
        <div className="coach">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            coaches Info  :
          </h3>
          {formData.coach.map((coach, index) => (
            <div key={index} className="">
              <div className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                  <input
                    type="text"
                    value={coach.name}
                    onChange={(e) => handleChange(e, "coach", index, "name")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    value={coach.email}
                    onChange={(e) => handleChange(e, "coach", index, "email")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
              </div>
              <div className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="enter your phone"
                   pattern="^\+20\d{10}$"
                  title="Phone number must start with +2 and contain 12 digits."
                    value={coach.phone_number}
                    onChange={(e) => handleChange(e, "coach", index, "phone_number")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Position</label>
                  <input
                    type="text"
                    value={coach.position}
                    onChange={(e) => handleChange(e, "coach", index, "position")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
                {index >= 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button type="button" onClick={() => handleRemoveItem("coach", index)}>
                      <IoIosRemoveCircle className="text-red-500 bg-white text-3xl hover:text-red-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("coach", { name: "", email: "", phone_number: "", position: "" })
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add coach
          </button>
        </div>
        {/* coach Info */}
        <div className="members">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Members Info  :
          </h3>
          {formData.members.map((member, index) => (
            <div key={index} className="">
              <div className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleChange(e, "members", index, "name")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleChange(e, "members", index, "email")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
              </div>
              <div className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="enter your phone"
                    pattern="^\+20\d{10}$"
                    title="Phone number must start with +2 and contain 12 digits."
                    value={member.phone_number}
                    onChange={(e) => handleChange(e, "members", index, "phone_number")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
                
                {index >= 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button type="button" onClick={() => handleRemoveItem("members", index)}>
                      <IoIosRemoveCircle className="text-red-500 bg-white text-3xl hover:text-red-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("members", { name: "", email: "", phone_number: ""})
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add Member
          </button>
        </div>
        {/* social_media Info */}
        <div className="social_media">
          <h3 className=" py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Social Media :
          </h3>
          {formData.social_media.map((competition, index) => (
            <div key={index} className=" flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
              <div className="w-full md:w-1/2">
                <label className="block mb-2 text-sm font-bold text-gray-700">platform</label>
                <input
                  type="text"
                  value={competition.platform}
                  onChange={(e) => handleChange(e, "social_media", index, "platform")}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block mb-2 text-sm font-bold text-gray-700">URL</label>
                <input
                  type="url"
                  value={competition.url}
                  onChange={(e) => handleChange(e, "social_media", index, "url")}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              </div>
              {index >= 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button type="button" onClick={() => handleRemoveItem("social_media", index)}>
                    <IoIosRemoveCircle className="text-red-500 bg-white text-3xl hover:text-red-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("social_media", { platform: "", url: "" })
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add social media
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-600 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating Team...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
};
export default CreateTeam;