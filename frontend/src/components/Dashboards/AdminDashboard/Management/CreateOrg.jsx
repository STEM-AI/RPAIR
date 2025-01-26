// import React, { useState } from "react";
// import axios from "axios";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import Stack from "@mui/material/Stack";

// const CreateOrganization = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     email: "",
//     type: "",
//     contacts: [{ phone_number: "" }],
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
//     if (name.startsWith("contacts")) {
//       const index = parseInt(name.split("_")[1], 10);
//       const updatedContacts = [...formData.contacts];
//       updatedContacts[index] = { phone_number: value };
//       setFormData((prevState) => ({
//         ...prevState,
//         contacts: updatedContacts,
//       }));
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };

//   const handleAddContact = () => {
//     setFormData((prevState) => ({
//       ...prevState,
//       contacts: [...prevState.contacts, { phone_number: "" }],
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setResponseMessage(null);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/organization/create-organization/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAlertType("success");
//       setResponseMessage("Organization created successfully!");
//       setFormData({
//         name: "",
//         address: "",
//         email: "",
//         type: "",
//         contacts: [{ phone_number: "" }],
//       });
//     } catch (err) {
//       console.error("Error Response:", err.response);
//       setAlertType("error");
//       setResponseMessage(
//         err.response?.data?.detail || "Failed to create the organization. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
//         Create Organization
//       </h2>

//       {/* Alert messages */}
//       {responseMessage && (
//         <Stack sx={{ width: "100%" }} spacing={2}>
//           <Alert severity={alertType}>
//             <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
//             {responseMessage}
//           </Alert>
//         </Stack>
//       )}

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
//         <div className="p-2">
//           <label htmlFor="name" className="block text-gray-700 font-bold">
//             Organization Name:
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             placeholder="Enter organization name"
//             value={formData.name}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//           />
//         </div>

//         <div className="p-2">
//           <label htmlFor="address" className="block text-gray-700 font-bold">
//             Address:
//           </label>
//           <input
//             type="text"
//             id="address"
//             name="address"
//             placeholder="Enter address"
//             value={formData.address}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//           />
//         </div>

//         <div className="p-2">
//           <label htmlFor="email" className="block text-gray-700 font-bold">
//             Email:
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="Enter email"
//             value={formData.email}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//           />
//         </div>

//         <div className="p-2">
//           <label htmlFor="type" className="block text-gray-700 font-bold">
//             Type:
//           </label>
//           <input
//             type="text"
//             id="type"
//             name="type"
//             placeholder="Enter organization type"
//             value={formData.type}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//           />
//         </div>

//         {/* Contact Numbers */}
//         {formData.contacts.map((contact, index) => (
//           <div key={index} className="p-2">
//             <label htmlFor={`contacts_${index}`} className="block text-gray-700 font-bold">
//               Phone Number {index + 1}:
//             </label>
//             <input
//               type="text"
//               id={`contacts_${index}`}
//               name={`contacts_${index}`}
//               placeholder={`Enter phone number ${index + 1}`}
//               value={contact.phone_number}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
//             />
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddContact}
//           className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full mt-2"
//         >
//           Add Another Contact
//         </button>

//         <div className="col-span-full mt-6 p-2">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="block w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
//           >
//             {isSubmitting ? "Submitting..." : "Create Organization"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateOrganization;


import React, { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const CreateOrganization = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    type: "",
    contacts: [{ phone_number: "" }, { phone_number: "" }], 
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
    const index = parseInt(name.split("_")[1], 10);
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = { phone_number: value };
    setFormData((prevState) => ({
      ...prevState,
      contacts: updatedContacts,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const response = await axios.post(
        "http://147.93.56.71:8000/api/organization/create-organization/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertType("success");
      setResponseMessage("Organization created successfully!");
      setFormData({
        name: "",
        address: "",
        email: "",
        type: "",
        contacts: [{ phone_number: "" }, { phone_number: "" }], 
      });
    } catch (err) {
      console.error("Error Response:", err.response);
      setAlertType("error");
      setResponseMessage(
        err.response?.data?.detail || "Failed to create the organization. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
        Create Organization
      </h2>

      {/* Alert messages */}
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
          <label htmlFor="name" className="block text-gray-700 font-bold">
            Organization Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter organization name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
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
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
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
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
          />
        </div>

        <div className="p-2">
          <label htmlFor="type" className="block text-gray-700 font-bold">
            Type:
          </label>
          <input
            type="text"
            id="type"
            name="type"
            placeholder="Enter organization type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
          />
        </div>

        {/* Contact Numbers (Only 2 phone numbers) */}
        {formData.contacts.map((contact, index) => (
          <div key={index} className="p-2">
            <label htmlFor={`contacts_${index}`} className="block text-gray-700 font-bold">
              Phone Number {index + 1}:
            </label>
            <input
              type="text"
              id={`contacts_${index}`}
              name={`contacts_${index}`}
              placeholder={`Enter phone number ${index + 1}`}
              value={contact.phone_number}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-50 p-2"
            />
          </div>
        ))}

        <div className="col-span-full mt-6 p-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="block w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
          >
            {isSubmitting ? "Submitting..." : "Create Organization"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrganization;
