

// import React, { useState } from "react";
// import axios from "axios";

// const CreateEvent = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     start_date: "",
//     end_date: "",
//     location: "",
//     type: "",
//     description: "",
//     image: "",
//     rules: null,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");
//   const [showForm, setShowForm] = useState(false); // State to toggle form visibility
//   const token = localStorage.getItem("jwt_token");

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (event) => {
//     const { name, files } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: files[0],
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setResponseMessage("");

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "rules" && formData[key]) {
//         formDataToSend.append(key, formData[key]);
//       } else if (formData[key]) {
//         formDataToSend.append(key, formData[key]);
//       }
//     });

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/competition/create-competition/",
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setIsSubmitting(false);
//       setResponseMessage("Competition created successfully!");
//     } catch (error) {
//       setIsSubmitting(false);
//       setResponseMessage("Error creating competition. Please try again.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Button to Show Form */}
//       {!showForm && (
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full mb-4"
//         >
//           Add Event / Create Event
//         </button>
//       )}

//       {showForm && (
//         <div>
//           {/* Title */}
//           <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
//             Create Event
//           </h2>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
//             {/* Name */}
//             <div className="p-2">
//               <label htmlFor="name" className="block text-gray-700 font-bold">
//                 Event Name:
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 placeholder="Enter the competition name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//                 style={{ backgroundColor: "#f6f6f6" }}
//               />
//             </div>

//             {/* Start Date and End Date */}
//             <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label
//                   htmlFor="start_date"
//                   className="block text-gray-700 font-bold"
//                 >
//                   Start Date:
//                 </label>
//                 <input
//                   type="datetime-local"
//                   id="start_date"
//                   name="start_date"
//                   value={formData.start_date}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//                   style={{ backgroundColor: "#f6f6f6" }}
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="end_date"
//                   className="block text-gray-700 font-bold"
//                 >
//                   End Date:
//                 </label>
//                 <input
//                   type="datetime-local"
//                   id="end_date"
//                   name="end_date"
//                   value={formData.end_date}
//                   onChange={handleChange}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//                   style={{ backgroundColor: "#f6f6f6" }}
//                 />
//               </div>
//             </div>

//             {/* Location */}
//             <div className="p-2">
//               <label
//                 htmlFor="location"
//                 className="block text-gray-700 font-bold"
//               >
//                 Location:
//               </label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 placeholder="Enter the location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//                 style={{ backgroundColor: "#f6f6f6" }}
//               />
//             </div>

//             {/* Type */}
//             <div className="p-2">
//               <label htmlFor="type" className="block text-gray-700 font-bold">
//                 Competition Type:
//               </label>
//               <input
//                 type="text"
//                 id="type"
//                 name="type"
//                 placeholder="e.g., Robotics"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//                 style={{ backgroundColor: "#f6f6f6" }}
//               />
//             </div>

//             {/* Description */}
//             <div className="p-2">
//               <label
//                 htmlFor="description"
//                 className="block text-gray-700 font-bold"
//               >
//                 Description:
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 placeholder="Provide a brief description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="3"
//                 className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//                 style={{ backgroundColor: "#f6f6f6" }}
//               />
//             </div>

//             {/* Rules */}
//             <div className="p-2">
//               <label
//                 htmlFor="rules"
//                 className="block text-gray-700 font-bold"
//               >
//                 Upload Rules (PDF/DOCX):
//               </label>
//               <input
//                 id="rules"
//                 name="rules"
//                 type="file"
//                 accept=".pdf,.docx"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="col-span-full mt-6 p-2">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="block w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Response Message */}
//       {responseMessage && (
//         <p className="mt-4 text-lg text-center">{responseMessage}</p>
//       )}
//     </div>
//   );
// };

// export default CreateEvent;


// import React, { useState } from "react";
// import axios from "axios";

// const CreateEvent = () => {
//     const [eventName, setEventName] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [location, setLocation] = useState('');
//     const [type, setType] = useState('');
//     const [rules, setRules] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(null);
//     const [error, setError] = useState(null);

//     const handleCreateEvent = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         // Fetch the token from localStorage
//         const token = localStorage.getItem('access_token');
//         if (!token) {
//             setError("You are not authorized. Please log in.");
//             setLoading(false);
//             return;
//         }

//         try {
//             const { data } = await axios.post(
//                 'http://147.93.56.71:8000/api/competition/create-competition',
//                 {
//                     name: eventName,
//                     start_date: startDate,
//                     end_date: endDate,
//                     location: location,
//                     type: type,
//                     rules: rules,
//                     description: description,
//                     image: image,
//                 },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             setSuccess("Event created successfully!");
//             setEventName('');
//             setStartDate('');
//             setEndDate('');
//             setLocation('');
//             setType('');
//             setRules('');
//             setDescription('');
//             setImage('');
//         } catch (err) {
//             setError(err.response?.data?.detail || 'Failed to create event.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
//             <h2 className="text-xl font-bold text-gray-700">Create Event</h2>
//             {success && <div className="text-green-600">{success}</div>}
//             {error && <div className="text-red-600">{error}</div>}
//             <form onSubmit={handleCreateEvent}>
//                 <div>
//                     <label className="block text-gray-700">Event Name</label>
//                     <input
//                         type="text"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={eventName}
//                         onChange={(e) => setEventName(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">Start Date</label>
//                     <input
//                         type="date"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">End Date</label>
//                     <input
//                         type="date"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={endDate}
//                         onChange={(e) => setEndDate(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">Location</label>
//                     <input
//                         type="text"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={location}
//                         onChange={(e) => setLocation(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">Type</label>
//                     <input
//                         type="text"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={type}
//                         onChange={(e) => setType(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">Rules</label>
//                     <textarea
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={rules}
//                         onChange={(e) => setRules(e.target.value)}
//                         required
//                     ></textarea>
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">Description</label>
//                     <textarea
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         required
//                     ></textarea>
//                 </div>
//                 <div className="mt-4">
//                     <label className="block text-gray-700">Image URL</label>
//                     <input
//                         type="text"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200"
//                         value={image}
//                         onChange={(e) => setImage(e.target.value)}
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     className={`mt-6 w-full py-2 px-4 rounded-md text-white ${
//                         loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'
//                     }`}
//                     disabled={loading}
//                 >
//                     {loading ? "Creating..." : "Create Event"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CreateEvent;

import React from 'react'

function CreateEvent() {
  return (
    <div>
      Amany is working on it
    </div>
  )
}

export default CreateEvent
