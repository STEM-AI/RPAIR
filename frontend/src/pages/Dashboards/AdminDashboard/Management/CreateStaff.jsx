import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { MdEventNote } from "react-icons/md"; 

const CreateStaff = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    country: "",
    address: "",
    date_of_birth: "",
    phone_number: "",
  });

 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const token = localStorage.getItem("access_token");
  
  if (!token) {
    return (
      <div className="text-red-600 text-center mt-8">
        You are not authorized. Please log in.
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
  const updatedEmail = formData.email.replace("@gmail.com", "@rpair.judge.com");
  const updatedFormData = { ...formData, email: updatedEmail };
  
    setIsSubmitting(true);
    setResponseMessage(null);
    setAlertType("");

    try {
      // First, register the judge
      const judgeResponse = await axios.post(
        `${process.env.REACT_APP_API_URL_AUTH}/judge-register/`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      setAlertType("success");
      setResponseMessage("Judge and event created successfully!");
      Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Registration successful!",
                      showConfirmButton: false,
                        });
      
      // Reset both forms after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        country: "",
        address: "",
        date_of_birth: "",
        phone_number: "",
      });
      
      
    } catch (err) {
      console.error("Error Response:", err.response);
      
      let errorMessage = "Failed to create the judge. Please try again.";
      
      if (err.response?.data) {
        // Handle field-specific errors
        const errors = err.response.data;
        
        if (errors.detail) {
          // Handle non-field errors
          errorMessage = errors.detail;
        } else {
          // Collect all validation errors
          const messages = [];
          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              messages.push(...errors[key]);
            } else {
              messages.push(errors[key]);
            }
          }
          errorMessage = messages.join(' ');
        }
      }

      setAlertType("error");
      setResponseMessage(errorMessage);
      
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
   
        <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl py-2 font-black">
          Create Judge
        </h2>
      {responseMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity={alertType}>
            <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
            {responseMessage}
          </Alert>
        </Stack>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        

        <div className="p-2">
          <label htmlFor="first_name" className="block text-gray-700 font-bold">
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="last_name" className="block text-gray-700 font-bold">
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="username" className="block text-gray-700 font-bold">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            pattern="^[a-zA-Z0-9@.+\-_]+$"
            title=" This value may contain only letters, numbers, and @/./+/-/_ characters"
            value={formData.username}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="email" className="block text-gray-700 font-bold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="password" className="block text-gray-700 font-bold">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="country" className="block text-gray-700 font-bold">
            Country:
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Enter country"
            value={formData.country}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="address" className="block text-gray-700 font-bold">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="date_of_birth" className="block text-gray-700 font-bold">
            Date of Birth:
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="phone_number" className="block text-gray-700 font-bold">
            Phone Number:
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            placeholder="enter your phone"
            pattern="^\+20\d{10}$"
            title="Phone number must start with +2 and contain 11 digits."
            value={formData.phone_number}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            required
          />
        </div>

        <div className="col-span-full mt-6 p-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="block w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
          >
            {isSubmitting ? "Submitting..." : "Create Judge and Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;