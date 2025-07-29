import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { IoAddCircle } from "react-icons/io5";
import { IoIosRemoveCircle } from "react-icons/io";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const [hasGlobalNumber, setHasGlobalNumber] = useState(null);
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [isManualOrgEntry, setIsManualOrgEntry] = useState(false); 
  const [hasCoach, setHasCoach] = useState(false); 
  const [showCoachForm, setShowCoachForm] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    event_id: "",
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
    team_number: null,
    image: "",
    team_leader_name: "",
    team_leader_email: "",
    team_leader_phone_number: "",
    coach: [],
    members: [{ name: "", email: "", phone_number: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

   const handleOrgSelect = (e) => {
    const selectedOrgName = e.target.value;
    
    if (selectedOrgName === "manual") {
      setIsManualOrgEntry(true);
      setFormData(prev => ({
        ...prev,
        organization_info: {
          name: "",
          address: "",
          email: "",
          type: "",
          contacts: [{ phone_number: "" }]
        }
      }));
      return;
    }
    
    const selectedOrg = organizations.find(org => org.name === selectedOrgName);
    if (selectedOrg) {
      setIsManualOrgEntry(false);
      setFormData(prev => ({
        ...prev,
        organization_info: { 
          ...selectedOrg,
          contacts: selectedOrg.contacts || [] 
        }
      }));
    }
  };

  const handleCoachChoice = (choice) => {
    setHasCoach(choice);
    setShowCoachForm(choice);
    
    if (choice) {
      setFormData(prev => ({
        ...prev,
        coach: [{ name: "", email: "", phone_number: "", position: "" }]
      }));
    } else {
      // إذا اختار لا، نمسح أي بيانات كوتش
      setFormData(prev => ({
        ...prev,
        coach: []
      }));
    }
  };

  useEffect(() => {
    if (formData.competition) {
      fetchEvents(formData.competition);
      fetchOrganizations();
    }
  }, [formData.competition]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

   const fetchOrganizations = async () => {
          if (!token) {
            setResponseMessage("You are not authorized. Please log in.");
            navigate(`/login`);

            
              return;
          }
  
          try {
              const response = await axios.get(
                  `${process.env.REACT_APP_API_URL}/organization/`,
                  {
                      headers: { Authorization: `Bearer ${token}` }
                  }
              );
  
              setOrganizations(response.data);
  
  
          } catch (err) {
              console.log(err);
          }
      };


  const fetchEvents = async (competition_name) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/competition/${competition_name}/event/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const upcomingCompetitions = events.filter(
    (comp) => comp.start_date >= today
  );

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

  const handlePhoneNumberChange = (e, section, index, key, subSection) => {
    let value = e.target.value;

    // Remove any non-digit characters except '+'
    value = value.replace(/[^\d+]/g, "");

    // Ensure it starts with +2
    if (!value.startsWith("+2")) {
      value = "+2" + value.replace("+", "");
    }

    // Limit to +2 plus 11 digits
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

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
      setFormData((prev) => ({ ...prev, [e.target.name]: value }));
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
  if (hasGlobalNumber === null) {
    Swal.fire({
      icon: "error",
      title: "Missing Information",
      text: "Please specify if you have a global team number or not",
    });
    return;
  }

  setIsSubmitting(true);
  setResponseMessage(null);

  try {
    const formDataToSend = new FormData();
    
    // Append the image file
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    if (hasGlobalNumber === true && formData.team_number) {
      formDataToSend.append("team_number", formData.team_number);
    }

    // تحديد شكل بيانات المنظمة بناءً على نوع الإدخال
    if (isManualOrgEntry) {
      // إرسال كافة بيانات المنظمة الجديدة
      formDataToSend.append("organization_info", JSON.stringify(formData.organization_info));
    } else {
      // إرسال معرف المنظمة فقط للمنظمة الموجودة
      formDataToSend.append("organization_id", formData.organization_info.id);
    }

    // Append other fields
    formDataToSend.append("event_id", formData.event_id);
    formDataToSend.append("competition", formData.competition);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("robot_name", formData.robot_name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("team_leader_name", formData.team_leader_name);
    formDataToSend.append("team_leader_email", formData.team_leader_email);
    formDataToSend.append("team_leader_phone_number", formData.team_leader_phone_number);
    
    // Stringify nested objects
    formDataToSend.append("coach", JSON.stringify(formData.coach));
    formDataToSend.append("members", JSON.stringify(formData.members));

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/team/user/`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

      setAlertType("success");
      setResponseMessage("Event created successfully!");
      console.log("Response Data:", response.data);

      console.log(" Data:", formData);
        
           Swal.fire({
        icon: "success",
        title: "Team Created!",
        text: "Team registration completed successfully!",
        showConfirmButton: false,
        timer: 2000
           });
      
      setFormData({
        event_id: "",
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
        team_number: "",
        image: "",
        team_leader_name: "",
        team_leader_email: "",
        team_leader_phone_number: "",
        coach: [{ name: "", email: "", phone_number: "", position: "" }],
        members: [{ name: "", email: "", phone_number: "" }],
      });
      return response.data;

    
    } catch (err) {
    console.error("Error Response:", err.response);
    const errorData = err.response?.data || {};
    
    // Handle existing data errors
    const errorMessages = [];
    
    // Check for specific field conflicts
    if (errorData.name) {
      errorMessages.push("Team name is already registered");
    }
    if (errorData.robot_name) {
      errorMessages.push("Robot name is already taken");
    }
    if (errorData.organization_info?.email) {
      errorMessages.push("Organization email is already registered");
    }
    if (errorData.team_leader_email) {
      errorMessages.push("Team leader email is already in use");
    }

    // Handle generic errors
    if (errorData.detail) {
      errorMessages.push(errorData.detail);
    }

    // If no specific messages, show default error
    if (errorMessages.length === 0) {
      errorMessages.push(`Failed to create team. Please check your inputs and try again.${ err.response.data}`);
    } else {
      errorMessages.push(`Failed to create team. Please ${ err.response?.data}`);
    }

    Swal.fire({
      icon: "error",
      title: '<span style="color: #dc2626">Registration Failed</span>',
      html: `
        <div class="text-left">
          <p class="font-semibold">Please fix the following issues:</p>
          <ul class="list-disc pl-5 mt-2">
            ${errorMessages.map(msg => `<li>${msg}</li>`).join('')}
          </ul>
        </div>
      `,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Try Again",
      scrollbarPadding: false
    });

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <Helmet>
        <title>Create Team</title>
      </Helmet>

      <h2 className="mb-5 py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-3xl md:text-4xl font-black text-center">
        Create a Team
      </h2>

      
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Competition</label>
            <select
              value={formData.competition}
              onChange={(e) => handleChange(e, null, null, null, null)}
              name="competition"
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
            >
              <option value="">Select Competition</option>
                  <option value="vex_iq">Vex IQ</option>
                  <option value="vex_go">Vex GO</option>
                  <option value="vex_123">Vex 123</option>
                  <option value="arduino">Arduino</option>                                        
                  <option value="flutter">Flutter</option>                                        
                  <option value="programming">Programming</option> 
            </select>
          </div>
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Event Name</label>
            <select
              value={formData.event_id}
              onChange={(e) => handleChange(e, null, null, null, null)}
              name="event_id"
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
              disabled={!formData.competition}
            >
              <option value="">Select Event</option>
              {upcomingCompetitions.map((event, index) => (
                <option clas key={index} value={event.id}>
                  <span>{event.name}</span> - <span>{new Date(event.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                </option>
              ))}
            </select>
          </div>
        </div>

      {/* Organization Info */}
      <div className="organizationInfo">
        <h3 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
          Organization Info:
        </h3>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Organization Selection
          </label>
          
          {isManualOrgEntry ? (
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={formData.organization_info.name}
                onChange={(e) => handleChange(e, "organization_info", null, "name")}
                className="bg-gray-100 border rounded py-2 px-4 w-full"
                placeholder="Enter organization name"
                required
              />
              <button
                type="button"
                onClick={() => setIsManualOrgEntry(false)}
                className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Select from List
              </button>
            </div>
          ) : (
            <select
              value={formData.organization_info.name}
              onChange={handleOrgSelect}
              className="bg-gray-200 border rounded py-2 px-4 w-full mb-4"
              required
            >
              <option value="">Select Organization</option>
              {organizations.map((org, index) => (
                <option key={index} value={org.name}>
                  {org.name}
                </option>
              ))}
              <option value="manual">Add New Organization...</option>
            </select>
          )}
        </div>
        
        <div className="md:flex md:justify-between">
          <div className="md:mr-2">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Organization Name
            </label>
            {isManualOrgEntry ? (
              <input
                type="text"
                value={formData.organization_info.id}
                onChange={(e) => handleChange(e, "organization_info", null, "id")}
                className="bg-gray-100 border rounded py-2 px-4 w-full"
                required
              />
            ) : (
              <input
                type="text"
                value={formData.organization_info.name}
                readOnly
                className="bg-gray-200 border rounded py-2 px-4 w-full cursor-not-allowed"
              />
            )}
          </div>
          
          <div className="md:mr-2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Address</label>
            <input
              type="text"
              value={formData.organization_info.address}
              onChange={(e) => handleChange(e, "organization_info", null, "address")}
              className={`border rounded py-2 px-4 w-full ${isManualOrgEntry ? 'bg-gray-100' : 'bg-gray-200 cursor-not-allowed'}`}
              readOnly={!isManualOrgEntry}
              required={isManualOrgEntry}
            />
          </div>
          
          <div className="md:mr-2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Type</label>
            <select
              value={formData.organization_info.type}
              onChange={(e) => handleChange(e, "organization_info", null, "type")}
              className={`border rounded py-2 px-4 w-full ${isManualOrgEntry ? 'bg-gray-100' : 'bg-gray-200 cursor-not-allowed'}`}
              disabled={!isManualOrgEntry}
              required={isManualOrgEntry}
            >
              <option value="">Select Type</option>
              <option value="profite">Profit</option>
              <option value="non-profite">Non-Profit</option>
            </select>
          </div>
        </div>
        
        <div className="md:mr-2">
          <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
          <input
            type="email"
            value={formData.organization_info.email}
            onChange={(e) => handleChange(e, "organization_info", null, "email")}
            className={`border rounded py-2 px-4 w-full ${isManualOrgEntry ? 'bg-gray-100' : 'bg-gray-200 cursor-not-allowed'}`}
            readOnly={!isManualOrgEntry}
            required={isManualOrgEntry}
          />
        </div>

        {/* Organization Contacts */}
        <h4 className="mt-4 text-lg font-bold">Contacts</h4>
        {formData.organization_info.contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="tel"
              placeholder="Enter phone number (+20XXXXXXXXXX)"
              pattern="^\+20\d{10}$"
              title="Phone number must start with +20 and contain 12 digits."
              value={contact.phone_number}
              onChange={(e) =>
                handlePhoneNumberChange(e, "organization_info", index, "phone_number", "contacts")
              }
              className={`border rounded py-2 px-4 w-full ${isManualOrgEntry ? 'bg-gray-100' : 'bg-gray-200 cursor-not-allowed'}`}
              readOnly={!isManualOrgEntry}
              required={isManualOrgEntry}
            />
            {isManualOrgEntry && (
              <button
                type="button"
                onClick={() => handleRemoveItem("organization_info", index, "contacts")}
                className="text-red-500 hover:text-red-700"
              >
                <IoIosRemoveCircle size={24} />
              </button>
            )}
          </div>
        ))}
        
        {isManualOrgEntry && (
          <button
            type="button"
            onClick={() =>
              handleAddItem("organization_info", { phone_number: "" }, "contacts")
            }
            className="text-cyan-600 hover:text-cyan-800 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add Contact
          </button>
        )}
      </div>


        {/* Team Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
          <div className="w-full md:w-1/2">
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
          {formData.competition === 'programming' || formData.competition === 'flutter' || formData.competition === 'arduino' ?
          (""):( <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Robot Name</label>
            <input
              type="text"
              name="robot_name"
              value={formData.robot_name}
              onChange={handleChange}
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
            />
          </div>) }
         
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Team Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
            >
              <option value="">Select Type</option>
              <option value="profite">Profit</option>
              <option value="non-profite">Non-Profit</option>
            </select>
          </div>
          {/* <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-bold text-gray-700"> Team Number</label>
            <input
              type="text"
              name="team_number"
              value={formData.team_number}
              onChange={handleChange}
              className="bg-gray-200 border rounded py-2 px-4 w-full"
              required
            />
          </div> */}
           
         
        <div className="w-full md:w-1/2">
        <label className="block mb-2 text-sm font-bold text-gray-700">Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="bg-gray-200 border rounded py-2 px-4 w-full"
        />
        </div>
        </div>
        <div className="  md:mr-2">
            <label className="block mb-2 text-sm font-bold text-gray-700">Team Number</label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasGlobalNumber"
                    checked={hasGlobalNumber === true}
                    onChange={() => {
                      setHasGlobalNumber(true);
                      setFormData({...formData, team_number: ""}); // Reset to empty string if they choose yes
                    }}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes, I have a global number</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasGlobalNumber"
                    checked={hasGlobalNumber === false}
                    onChange={() => {
                      setHasGlobalNumber(false);
                      setFormData({...formData, team_number: null}); // Set to null if they choose no
                    }}
                    className="form-radio"
                  />
                  <span className="ml-2">No global number</span>
                </label>
              </div>
              {hasGlobalNumber === true && (
                <input
                  type="text"
                  name="team_number"
                  value={formData.team_number || ""}
                  onChange={handleChange}
                  className="bg-gray-200 border rounded py-2 px-4 w-full"
                  required
                />
              )}
            </div>
          </div>

        {/* Team Leader Info */}
        {formData.competition === 'programming'? (""):(
          <div className="teamLeader">
          <h3 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Team Leader Info:
          </h3>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <div className="w-full md:w-1/2">
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
            <div className="w-full md:w-1/2">
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
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
            <div className="w-full md:w-1/2">
              <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
              <input
                type="text"
                name="team_leader_phone_number"
                placeholder="Phone number"
                pattern="^\+2\d{11}$"
                title="Phone number must start with +2 followed by 11 digits"
                value={formData.team_leader_phone_number}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^\d+]/g, '');
                  if (!value.startsWith('+2')) {
                    value = '+2' + value.replace('+', '');
                  }
                  if (value.length > 13) {
                    value = value.slice(0, 13);
                  }
                  setFormData({ ...formData, team_leader_phone_number: value });
                }}
                className="bg-gray-200 border rounded py-2 px-4 w-full"
                required
              />
            </div>
          </div>
        </div>
        )
        }
        

        <div className="coach">
          <h3 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Coach Info:
          </h3>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Do you want to add another coach?
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hasCoach"
                  checked={hasCoach === true}
                  onChange={() => handleCoachChoice(true)}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hasCoach"
                  checked={hasCoach === false}
                  onChange={() => handleCoachChoice(false)}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          
          {showCoachForm && formData.coach.map((coach, index) => (
            <div key={index} className="mb-5">
              <h4 className="text-lg font-medium mb-3">Coach #{index + 1}</h4>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Name</label>
                  <input
                    type="text"
                    value={coach.name}
                    onChange={(e) => handleChange(e, "coach", index, "name")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required={showCoachForm}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    value={coach.email}
                    onChange={(e) => handleChange(e, "coach", index, "email")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required={showCoachForm}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mt-4">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="enter your phone"
                    pattern="^\+2\d{11}$"
                    title="Phone number must start with +2 followed by 11 digits."
                    value={coach.phone_number}
                    onChange={(e) => handlePhoneNumberChange(e, "coach", index, "phone_number")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required={showCoachForm}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Position</label>
                  <select
                    value={coach.position}
                    onChange={(e) => handleChange(e, "coach", index, "position")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required={showCoachForm}
                  >
                    <option value="">Select Position</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                </div>
              </div>
              {index >= 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button 
                    type="button" 
                    onClick={() => handleRemoveItem("coach", index)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <IoIosRemoveCircle className="mr-1" /> Remove Coach
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {showCoachForm && (
            <button
              type="button"
              onClick={() =>
                handleAddItem("coach", { name: "", email: "", phone_number: "", position: "" })
              }
              className="text-cyan-500 flex items-center mt-2"
            >
              <IoAddCircle size={24} className="mr-1" /> Add Another Coach
            </button>
          )}
        </div>

        {/* Team Members */}
        <div className="members">
          <h3 className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 to-cyan-500 text-2xl font-black">
            Team Members:
          </h3>
          {formData.members.map((member, index) => (
            <div key={index} className="mb-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mt-4">
                <div className="w-full md:w-1/2">
                  <label className="block mb-2 text-sm font-bold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="enter your phone"
                    pattern="^\+2\d{11}$"
                    title="Phone number must start with +2 followed by 11 digits."
                    value={member.phone_number}
                    onChange={(e) => handlePhoneNumberChange(e, "members", index, "phone_number")}
                    className="bg-gray-200 border rounded py-2 px-4 w-full"
                    required
                  />
                </div>
              </div>
              {index >= 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button type="button" onClick={() => handleRemoveItem("members", index)}>
                    <IoIosRemoveCircle className="text-red-500 bg-white text-3xl hover:text-red-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleAddItem("members", { name: "", email: "", phone_number: "" })
            }
            className="text-cyan-500 flex items-center mt-2"
          >
            <IoAddCircle size={24} className="mr-1" /> Add Member
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating Team..." : "Create Team"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;


