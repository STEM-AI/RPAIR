import React, { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";


const options = [
  { value: "vex_iq", label: "VEX IQ" },
  { value: "vex_123", label: "VEX 123" },
  {
    label: "VEX GO",
    options: [
      { value: "robotics", label: <> Ocean Science Exploration</> },
      { value: "vex_go_city", label: <> City Technology Rebuild</> },
      { value: "vex_go_village", label: <> Village Engineering Construction</> },
      { value: "vex_go_mars", label: <> Mars Math Expedition</> },
    ],
  },
  { value: "programming", label: "Programming" },
  { value: "web_design", label: "Web Design" },
    { value: "open_source", label: "Open Source" },
    { value: "mobile_application", label: "Mobile Application" },
    { value: "artificial_intelligence", label: "Artificial Intelligence" },
    { value: "fablab", label: "Fablab" },
    { value: "st_math", label: "ST Math" },
    { value: "graphic_design", label: "Graphic Design" },
];
const CreateCompetition = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "", 
    rules:"" , 
    description: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post(
        `${process.env.REACT_APP_API_URL}/competition/create/`,
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
      setFormData({
        name: "",
        type: "",
        rules: "",
        description: "",
        image: null
      });
      setImagePreview(null);
   
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
    <div className="container px-4">
        <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl py-2 font-black">
          Create Competition
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
            <label htmlFor="competition_name" className="block text-gray-700 font-bold">
              Competition Name:
            </label>
          <select
            id="competition_name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
          >
            {options.map((item) => 
              item.options ? (
                <optgroup key={item.label} label={item.label}>
                  {item.options.map((subItem) => (
                    <option key={subItem.value} value={subItem.value}>
                      {subItem.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              )
            )}
          </select>

          </div>

         
          <div className="p-2">
            <label htmlFor="type" className="block text-gray-700 font-bold">
              type:
            </label>
           
           <input
              type="text"
              id="competition_name"
              name="name"
              placeholder="Enter competition name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
          />
          </div>

          <div className="p-2">
            <label htmlFor="rules" className="block text-gray-700 font-bold">
              rules:
            </label>
            <input
              type="text"
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
          </div>

          <div className="p-2">
            <label htmlFor="description" className="block text-gray-700 font-bold">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
          </div>

          <div className="p-2">
            <label htmlFor="image" className="block text-gray-700 font-bold mb-4">
              Competition Image:
            </label>
            <div className="flex flex-col items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full max-w-2xl">
                  <img 
                    src={imagePreview} 
                    alt="Competition preview" 
                    className="w-full "
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="col-span-full mt-6 p-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
  );
};

export default CreateCompetition;