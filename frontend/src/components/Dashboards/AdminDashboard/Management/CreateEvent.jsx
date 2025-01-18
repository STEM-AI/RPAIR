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
//     rules: null, // لتخزين الملف
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");
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
//       [name]: files[0], // تخزين الملف المرفوع
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setResponseMessage("");

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "rules" && formData[key]) {
//         formDataToSend.append(key, formData[key]); // إضافة الملف
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
//             "Authorization": `Bearer ${token}`,
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
//       {/* Title */}
//       <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
//               Create Event
//             </h2>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
//         {/* Name */}
//         <div className="p-2">
//           <input
//             type="text"
//             id="name"
//             name="name"
//             placeholder="Competition Name"
//             value={formData.name}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//             style={{ backgroundColor: "#f6f6f6" }}
//           />
//         </div>

//         {/* Start Date and End Date */}
//         <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Start Date */}
//           <div>
//             <input
//               type="datetime-local"
//               id="start_date"
//               name="start_date"
//               value={formData.start_date}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//               style={{ backgroundColor: "#f6f6f6" }}
//             />
//           </div>

//           {/* End Date */}
//           <div>
//             <input
//               type="datetime-local"
//               id="end_date"
//               name="end_date"
//               value={formData.end_date}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//               style={{ backgroundColor: "#f6f6f6" }}
//             />
//           </div>
//         </div>

//         {/* Location */}
//         <div className="p-2">
//           <input
//             type="text"
//             id="location"
//             name="location"
//             placeholder="Location"
//             value={formData.location}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//             style={{ backgroundColor: "#f6f6f6" }}
//           />
//         </div>

//         {/* Type */}
//         <div className="p-2">
//           <input
//             type="text"
//             id="type"
//             name="type"
//             placeholder="Competition Type"
//             value={formData.type}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//             style={{ backgroundColor: "#f6f6f6" }}
//           />
//         </div>

//         {/* Description */}
//         <div className="p-2">
//           <textarea
//             id="description"
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="3"
//             className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
//             style={{ backgroundColor: "#f6f6f6" }}
//           />
//         </div>

//         {/* Rules (File Upload) */}
//         <div className="p-2">
//           <label
//             htmlFor="rules"
//             className=" w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
//           >
//             <div className="text-center">
//               <div className="mb-2">
//                 <button
//                   type="button"
//                   className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4"
//                 >
//                   Upload Rules
//                 </button>
//               </div>
//               <p className="text-gray-500">or drag file here</p>
//               <p className="text-gray-500 text-sm mt-1">PDF, DOCX</p>
//             </div>
//           </label>
//           <input
//             id="rules"
//             name="rules"
//             type="file"
//             accept=".pdf,.docx"
//             onChange={handleFileChange}
//             className="sr-only"
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="col-span-full mt-6 p-2">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
//           >
//             {isSubmitting ? "Submitting..." : "Create Competition"}
//           </button>
//         </div>
//       </form>

//       {/* Response Message */}
//       {responseMessage && <p className="mt-4 text-lg">{responseMessage}</p>}
//     </div>
//   );
// };

// export default CreateEvent;






import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    type: "",
    description: "",
    image: "",
    rules: null, // لتخزين الملف
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const token = localStorage.getItem("jwt_token");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0], // تخزين الملف المرفوع
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "rules" && formData[key]) {
        formDataToSend.append(key, formData[key]); // إضافة الملف
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/competition/create-competition/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setIsSubmitting(false);
      setResponseMessage("Competition created successfully!");
    } catch (error) {
      setIsSubmitting(false);
      setResponseMessage("Error creating competition. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Title */}
      <h2 className="mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
        Create Event
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {/* Name */}
        <div className="p-2">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Competition Name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Start Date and End Date */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>

        {/* Location */}
        <div className="p-2">
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Type */}
        <div className="p-2">
          <input
            type="text"
            id="type"
            name="type"
            placeholder="Competition Type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Description */}
        <div className="p-2">
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Rules (File Upload) */}
        <div className="p-2">
          <label
            htmlFor="rules"
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
          >
            <div className="text-center">
              <div className="mb-2">
                <button
                  type="button"
                  className="bg-cyan-500 hover:bg-cyan-700 text-white rounded-full py-2 px-4"
                >
                  Upload Rules
                </button>
              </div>
              <p className="text-gray-500">or drag file here</p>
              <p className="text-gray-500 text-sm mt-1">PDF, DOCX</p>
            </div>
          </label>
          <input
            id="rules"
            name="rules"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        {/* Submit Button */}
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

      {/* Response Message */}
      {responseMessage && <p className="mt-4 text-lg">{responseMessage}</p>}
    </div>
  );
};

export default CreateEvent;
