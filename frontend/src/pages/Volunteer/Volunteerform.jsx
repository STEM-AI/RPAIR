

// import { useState } from "react";

// export default function VolunteerForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     role: "",
//     experience: "",
//     message: "",
//     cv: null,
//     photo: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "file" ? files[0] : value,
//     });
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
//       <h2 className="text-3xl font-bold text-cyan-700 text-center">Volunteer Registration</h2>
//       <p className="text-gray-500 text-center mt-2">Join us to organize or judge competitions!</p>

//       <form className="mt-6 space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required
//             className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

//           <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required
//             className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required
//             className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

//           <input type="text" name="address" placeholder="Full Address" onChange={handleChange} required
//             className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//         </div>

//         <select name="role" onChange={handleChange} required
//           className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700">
//           <option value="">Select Role</option>
//           <option value="judge">Judge</option>
//           <option value="organizer">Organizer</option>
//         </select>

//         <input type="text" name="experience" placeholder="Years of Experience" onChange={handleChange} required
//           className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

//         <textarea name="message" rows="4" placeholder="Why do you want to volunteer?" onChange={handleChange}
//           className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700"></textarea>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-gray-600 font-medium">Upload CV (PDF/DOC)</label>
//             <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} required
//               className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//           </div>

//           <div>
//             <label className="text-gray-600 font-medium">Upload Photo (JPG/PNG)</label>
//             <input type="file" name="photo" accept="image/*" onChange={handleChange} required
//               className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//           </div>
//         </div>

//         <button type="submit"
//           className="w-full bg-cyan-700 text-white py-3 rounded-md text-lg font-semibold hover:bg-cyan-800 transition">
//           Submit Application
//         </button>
//       </form>
//     </div>
//   );
// }


// import { useState } from "react";
// import VolunteerImg from '../../assets/imgs/vexComp/volunteer.jpg';

// export default function VolunteerForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     role: "",
//     experience: "",
//     message: "",
//     cv: null,
//     photo: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "file" ? files[0] : value,
//     });
//   };

//   return (
//     <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
//       <div className="grid grid-cols-1 md:grid-cols-2">
        
//         {/* ✅ Form Section */}
//         <div className="p-8">
//           <h2 className="text-3xl font-bold text-cyan-700 text-center">Volunteer Registration</h2>
//           <p className="text-gray-500 text-center mt-2">Join us to organize or judge competitions!</p>

//           <form className="mt-6 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required
//                 className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

//               <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required
//                 className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required
//                 className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

//               <input type="text" name="address" placeholder="Full Address" onChange={handleChange} required
//                 className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//             </div>

//             <select name="role" onChange={handleChange} required
//               className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700">
//               <option value="">Select Role</option>
//               <option value="judge">Judge</option>
//               <option value="organizer">Organizer</option>
//             </select>

//             <input type="text" name="experience" placeholder="Years of Experience" onChange={handleChange} required
//               className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

//             <textarea name="message" rows="4" placeholder="Why do you want to volunteer?" onChange={handleChange}
//               className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700"></textarea>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-gray-600 font-medium">Upload CV (PDF/DOC)</label>
//                 <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} required
//                   className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//               </div>

//               <div>
//                 <label className="text-gray-600 font-medium">Upload Photo (JPG/PNG)</label>
//                 <input type="file" name="photo" accept="image/*" onChange={handleChange} required
//                   className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
//               </div>
//             </div>

//             <button type="submit"
//               className="w-full bg-cyan-700 text-white py-3 rounded-md text-lg font-semibold hover:bg-cyan-800 transition">
//               Submit Application
//             </button>
//           </form>
//         </div>

//         {/* ✅ Image Section */}
//         <div className="hidden md:block bg-cyan-700">
//           <img src={VolunteerImg} alt="Volunteering" 
//             className="w-full h-full object-cover" />
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import VolunteerImg from '../../assets/Forms/volunteer.jpg';

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    experience: "",
    message: "",
    cv: null,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden my-12">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* ✅ Form Section */}
        <div className="py-12 px-6 md:px-12">
          <h2 className="text-3xl font-bold text-cyan-700 text-center">Volunteer Registration</h2>
          <p className="text-gray-500 text-center mt-2">Join us to organize or judge competitions!</p>

          <form className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required
                className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

              <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required
                className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required
                className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

              <input type="text" name="address" placeholder="Full Address" onChange={handleChange} required
                className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
            </div>

            <select name="role" onChange={handleChange} required
              className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700">
              <option value="">Select Role</option>
              <option value="judge">Judge</option>
              <option value="organizer">Organizer</option>
            </select>

            <input type="text" name="experience" placeholder="Years of Experience" onChange={handleChange} required
              className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />

            <textarea name="message" rows="4" placeholder="Why do you want to volunteer?" onChange={handleChange}
              className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700"></textarea>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-600 font-medium">Upload CV (PDF/DOC)</label>
                <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} required
                  className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
              </div>

              <div>
                <label className="text-gray-600 font-medium">Upload Photo (JPG/PNG)</label>
                <input type="file" name="photo" accept="image/*" onChange={handleChange} required
                  className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:border-cyan-700" />
              </div>
            </div>

            <button type="submit"
              className="w-full bg-cyan-700 text-white py-3 rounded-md text-lg font-semibold hover:bg-cyan-800 transition">
              Submit Application
            </button>
          </form>
        </div>

        {/* ✅ Image Section */}
        <div className="hidden md:block bg-cyan-700 p-4">
          <img src={VolunteerImg} alt="Volunteering" 
            className="w-full h-full object-cover rounded-lg" />
        </div>

      </div>
    </div>
  );
}
