import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoading } from "../../context/LoadingContext";
import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function VolunteerForm() {
  // State Management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    message: "",
    cv: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.role) errors.role = "Please select a role";
    if (!formData.cv.trim()) errors.cv = "CV link is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "https://script.google.com/macros/s/AKfycbzM3sBDLDl3h-qh_jeSCqMHjI1idkZt13LHxzNvk8AcGdLiUz2ZArUDu3MlckidzeU/exec";
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.result === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Thank you for your interest in volunteering with us.',
        });
        
        // Reset form
        setFormData({
          name: "", 
          email: "", 
          phone: "", 
          address: "",
          role: "", 
          message: "",
          cv: "", 
        });
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || 'There was an error submitting your application',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Helmet>
        <title>Volunteer</title>
      </Helmet>
      
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">Volunteer Registration</h1>
              <p className="text-gray-600 mt-2">
                Join our team to help organize or judge competitions. Make a difference in your community!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500`}
                      placeholder="Full Name"
                    />
                    <label 
                      htmlFor="name" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Full Name
                    </label>
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500`}
                      placeholder="Email Address"
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Phone and Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500`}
                      placeholder="Phone Number"
                    />
                    <label 
                      htmlFor="phone" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Phone Number
                    </label>
                    {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                  </div>

                  <div className="relative">
                    <input 
                      type="text" 
                      id="address"
                      name="address" 
                      value={formData.address}
                      onChange={handleChange}
                      className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.address ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500`}
                      placeholder="Full Address"
                    />
                    <label 
                      htmlFor="address" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Full Address
                    </label>
                    {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                  </div>
                </div>

                {/* Role Select */}
                <div className="relative">
                  <select 
                    id="role"
                    name="role" 
                    value={formData.role}
                    onChange={handleChange}
                    className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.role ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500 bg-transparent`}
                  >
                    <option value="">Select Role</option>
                    <option value="judge">Judge</option>
                    <option value="organizer">Organizer</option>
                  </select>
                  <label 
                    htmlFor="role" 
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Volunteer Role
                  </label>
                  {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>}
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea 
                    id="message"
                    name="message" 
                    rows="4" 
                    value={formData.message}
                    onChange={handleChange}
                    className="peer placeholder-transparent w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                    placeholder="Why do you want to volunteer? (Optional)"
                  ></textarea>
                  <label 
                    htmlFor="message" 
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Why do you want to volunteer? (Optional)
                  </label>
                </div>

                {/* CV Link */}
                <div className="relative">
                  <input 
                    type="url" 
                    id="cv"
                    name="cv" 
                    value={formData.cv}
                    onChange={handleChange}
                    className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.cv ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500`}
                    placeholder="CV Link (e.g. Google Drive, Dropbox)"
                  />
                  <label 
                    htmlFor="cv" 
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    CV (Link)
                  </label>
                  {formErrors.cv && <p className="mt-1 text-sm text-red-600">{formErrors.cv}</p>}
                </div>

                {/* Submit Button */}
                <div className="relative pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-md px-4 py-2 text-lg font-medium hover:opacity-90 transition shadow-md flex items-center justify-center ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}