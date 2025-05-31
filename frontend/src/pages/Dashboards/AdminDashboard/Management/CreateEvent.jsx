import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const CreateEvent = ({orgID}) => {
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
  const [comp, setComp] = useState([]);

  // Fetch competitions on component mount
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/competition/list/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComp(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setComp([]);
      }
    };

    fetchCompetitions();
  }, []);

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

    const token = localStorage.getItem("access_token");
    if (!token) {
      setAlertType("error");
      setResponseMessage("You are not authorized. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        ...formData,
        competition: competition_name,  // Add competition ID to request body
        organization: orgID
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/${competition_name}/event/`,
        requestData,
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
      setCompetitionName("");
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        location: "",
        category: "Mini",
        fees: 200,
        age: "00-00",
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
            {comp.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
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


// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import Stack from "@mui/material/Stack";
// import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaMoneyBillWave, FaUserAlt, FaPlus } from "react-icons/fa";

// const CreateEvent = () => {
//   const [competition_name, setCompetitionName] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
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
//   const [comp, setComp] = useState([]);

//   // Fetch competitions on component mount
//   useEffect(() => {
//     const fetchCompetitions = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) return;
        
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/competition/list/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setComp(response.data);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         setComp([]);
//       }
//     };

//     fetchCompetitions();
//   }, []);

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

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setAlertType("error");
//       setResponseMessage("You are not authorized. Please log in.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const requestData = {
//         ...formData,
//         competition: competition_name  // Add competition ID to request body
//       };

//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/admin/${competition_name}/event/`,
//         requestData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAlertType("success");
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Registration successful!",
//         showConfirmButton: false,
//       });
//       setResponseMessage("Event created successfully!");
//       setCompetitionName("");
//       setFormData({
//         name: "",
//         start_date: "",
//         end_date: "",
//         location: "",
//         category: "Mini",
//         fees: 200,
//         age: "00-00",
//       });
//     } catch (err) {
//       console.error("Error Response:", err.response);
//       console.error("Error :", err);
//       setAlertType("error");
//       setResponseMessage(
//         err.response?.data?.detail || "Failed to create the event. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const options = [
//     { value: "vex_iq", label: "VEX IQ" },
//     { value: "vex_123", label: "VEX 123" },
//     { value: "vex_go", label: "Vex GO" },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="mb-8 text-center">
//         <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-teal-500">
//           Create New Event
//         </h2>
//         <p className="mt-2 text-gray-600">
//           Fill in the details below to create a new competition event
//         </p>
//       </div>

//       {responseMessage && (
//         <Stack sx={{ width: "100%", marginBottom: "1.5rem" }}>
//           <Alert severity={alertType}>
//             <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
//             {responseMessage}
//           </Alert>
//         </Stack>
//       )}

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
//         <form onSubmit={handleSubmit} className="p-6 md:p-8">
//           {/* Competition Selection */}
//           <div className="mb-7">
//             <label className="block text-gray-700 font-semibold mb-2 flex items-center">
//               <FaTag className="mr-2 text-cyan-600" />
//               Competition Name
//             </label>
//             <div className="relative">
//               <select
//                 value={competition_name}
//                 onChange={(e) => setCompetitionName(e.target.value)}
//                 className="w-full pl-10 pr-3 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//                 required
//               >
//                 <option value="">Select Competition</option>
//                 {comp.map((option) => (
//                   <option key={option.id} value={option.id}>
//                     {option.name}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute left-3 top-3.5 text-gray-400">
//                 <FaTag />
//               </div>
//             </div>
//           </div>

//           {/* Event Name */}
//           <div className="mb-7">
//             <label className="block text-gray-700 font-semibold mb-2">
//               Event Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter event name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//             />
//           </div>

//           {/* Date Range */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2 flex items-center">
//                 <FaCalendarAlt className="mr-2 text-cyan-600" />
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 name="start_date"
//                 value={formData.start_date}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2 flex items-center">
//                 <FaCalendarAlt className="mr-2 text-cyan-600" />
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 name="end_date"
//                 value={formData.end_date}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//               />
//             </div>
//           </div>

//           {/* Location */}
//           <div className="mb-7">
//             <label className="block text-gray-700 font-semibold mb-2 flex items-center">
//               <FaMapMarkerAlt className="mr-2 text-cyan-600" />
//               Location
//             </label>
//             <input
//               type="text"
//               name="location"
//               placeholder="Enter event location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//             />
//           </div>

//           {/* Category and Fees */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//               >
//                 <option value="Mini">Mini</option>
//                 <option value="Small">Small</option>
//                 <option value="Regional">Regional</option>
//                 <option value="National">National</option>
//                 <option value="International">International</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2 flex items-center">
//                 <FaMoneyBillWave className="mr-2 text-cyan-600" />
//                 Fees (₹)
//               </label>
//               <input
//                 type="number"
//                 name="fees"
//                 value={formData.fees}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//               />
//             </div>
//           </div>

//           {/* Age Range */}
//           <div className="mb-8">
//             <label className="block text-gray-700 font-semibold mb-2 flex items-center">
//               <FaUserAlt className="mr-2 text-cyan-600" />
//               Age Range
//             </label>
//             <input
//               type="text"
//               name="age"
//               placeholder="e.g., 08-12"
//               value={formData.age}
//               onChange={handleChange}
//               className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//             />
//             <p className="mt-1 text-sm text-gray-500">Format: minAge-maxAge (e.g., 08-12)</p>
//           </div>

//           {/* Submit Button */}
//           <div className="mt-8">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : (
//                 <span className="flex items-center">
//                   <FaPlus className="mr-2" />
//                   Create Event
//                 </span>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateEvent;