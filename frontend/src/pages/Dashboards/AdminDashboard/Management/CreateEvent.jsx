// import React, { useState } from "react";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import Stack from "@mui/material/Stack";

// const CreateEvent = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     competition_name: "",
//     start_date: "",
//     end_date: "",
//     location: "",
//     category: "Mini", 
//     fees: 200, 
//     age: "00-00", 
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [responseMessage, setResponseMessage] = useState(null);
//   const [alertType, setAlertType] = useState("");

//   const token = localStorage.getItem("access_token");
  

//   if (!token) {
//     return (
//       <div className="text-red-600 text-center mt-8">
//         You are not authorized. Please log in.
//       </div>
//     );
//   }

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setResponseMessage(null);

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/admin/event/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAlertType("success");
//       setResponseMessage("Event created successfully!");
//       setFormData({
//         name : "",
//         competition_name: "",
//         start_date: "",
//         end_date: "",
//         location: "",
//         category: "Mini",
//         fees: 200,
//         age: "00-00",
//       });
//     } catch (err) {
//       console.error("Error Response:", err.response); 
//       setAlertType("error");
//       setResponseMessage(
//         err.response?.data?.detail || "Failed to create the event. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container px-4">
//       <div className="mt-8">
//         <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
//           Create Event
//         </h2>

//         {responseMessage && (
//           <Stack sx={{ width: "100%" }} spacing={2}>
//             <Alert severity={alertType}>
//               <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
//               {responseMessage}
//             </Alert>
//           </Stack>
//         )}

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
//           <div className="p-2">
//             <label htmlFor="name" className="block text-gray-700 font-bold">
//               Event Name:
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Enter Event name"
//               value={formData.name}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             />
//           </div>



//           <div className="p-2">
//             <label htmlFor="competition_name" className="block text-gray-700 font-bold">
//               Competition Name:
//             </label>
//             <input
//               type="text"
//               id="competition_name"
//               name="competition_name"
//               placeholder="Enter competition name"
//               value={formData.competition_name}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             />
//           </div>






//           <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="start_date" className="block text-gray-700 font-bold">
//                 Start Date:
//               </label>
//               <input
//                 type="date"
//                 id="start_date"
//                 name="start_date"
//                 value={formData.start_date}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="end_date" className="block text-gray-700 font-bold">
//                 End Date:
//               </label>
//               <input
//                 type="date"
//                 id="end_date"
//                 name="end_date"
//                 value={formData.end_date}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//               />
//             </div>
//           </div>

//           <div className="p-2">
//             <label htmlFor="location" className="block text-gray-700 font-bold">
//               Location:
//             </label>
//             <input
//               type="text"
//               id="location"
//               name="location"
//               placeholder="Enter the location"
//               value={formData.location}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             />
//           </div>

//           <div className="p-2">
//             <label htmlFor="category" className="block text-gray-700 font-bold">
//               Category:
//             </label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             >
//               <option value="Mini">Mini</option>
//               <option value="Small">Small</option>
//               <option value="Regional">Regional</option>
//               <option value="National">National</option>
//               <option value="International">International</option>
//             </select>
//           </div>

//           <div className="p-2">
//             <label htmlFor="fees" className="block text-gray-700 font-bold">
//               Fees:
//             </label>
//             <input
//               type="number"
//               id="fees"
//               name="fees"
//               value={formData.fees}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             />
//           </div>

//           <div className="p-2">
//             <label htmlFor="age" className="block text-gray-700 font-bold">
//               Age Range:
//             </label>
//             <input
//               type="text"
//               id="age"
//               name="age"
//               placeholder="Enter age range (e.g., 10-15)"
//               value={formData.age}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             />
//           </div>

//           <div className="col-span-full mt-6 p-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="block w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full"
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;

import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const CreateEvent = () => {
  const [competition_name, setCompetitionName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    category: "Mini", 
    fees: 200, 
    age: "00-00", 
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
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/${competition_name}/event/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertType("success");
       Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Registration successful!",
                      showConfirmButton: false,
                        });
      setResponseMessage("Event created successfully!");
      setFormData({
        name : "",
        competition_name: "",
        start_date: "",
        end_date: "",
        location: "",
        category: "",
        fees: 200,
        age: "",
      });
    } catch (err) {
      console.error("Error Response:", err.response);
      console.error("Error :", err);
      setAlertType("error");
      setResponseMessage(
        err.response?.data?.detail || "Failed to create the event. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
  
    { value: "vex_iq", label: "VEX IQ" },
  { value: "vex_123", label: "VEX 123" },
    { value: "vex_go", label: "Vex GO" },
    { value: "web_design", label: "Web Design" },
    { value: "open_source", label: "Open Source" },
    { value: "mobile_application", label: "Mobile Application" },
    { value: "programming", label: "Programming" },
    { value: "artificial_intelligence", label: "Artificial Intelligence" },
    { value: "fablab", label: "Fablab" },
    { value: "st_math", label: "ST Math" },
    { value: "graphic_design", label: "Graphic Design" },

  ];

  return (
    <div className="container px-4">
        <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-5xl py-2 font-black">
          Create Event
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
              name="competition_name"
              value={competition_name}
              onChange={(e) => setCompetitionName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
              required
            >
              <option value="">Select Competition</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
        </div>
        

          <div className="p-2">
            <label htmlFor="name" className="block text-gray-700 font-bold">
              Event Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Event name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
          </div>


          <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-gray-700 font-bold">
                Start Date:
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-gray-700 font-bold">
                End Date:
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
              />
            </div>
          </div>

          <div className="p-2">
            <label htmlFor="location" className="block text-gray-700 font-bold">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter the location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
          </div>

          <div className="p-2">
            <label htmlFor="category" className="block text-gray-700 font-bold">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            >
              <option value="Mini">Mini</option>
              <option value="Small">Small</option>
              <option value="Regional">Regional</option>
              <option value="National">National</option>
              <option value="International">International</option>
            </select>
          </div>

          <div className="p-2">
            <label htmlFor="fees" className="block text-gray-700 font-bold">
              Fees:
            </label>
            <input
              type="number"
              id="fees"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
          </div>

          <div className="p-2">
            <label htmlFor="age" className="block text-gray-700 font-bold">
              Age Range:
            </label>
            <input
              type="text"
              id="age"
              name="age"
              placeholder="Enter age range (e.g., 10-15)"
              value={formData.age}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
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

export default CreateEvent;