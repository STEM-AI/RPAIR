

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoading } from "../../context/LoadingContext";
import React, { useEffect } from 'react';

export default function VolunteerForm() {
  // State Management
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

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
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
    if (!formData.experience) errors.experience = "Experience is required";
    if (!formData.cv) errors.cv = "CV is required";
    if (!formData.photo) errors.photo = "Photo is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: "", email: "", phone: "", address: "",
          role: "", experience: "", message: "",
          cv: null, photo: null,
        });
      }, 2000);
    }
  };

  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Helmet>
        <title>Volunteer</title>
      </Helmet>
      
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        {/* Gradient background element */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        
        {/* Main form container */}
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-12">
          <div className="max-w-2xl mx-auto">
            {/* Header section */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-800">Volunteer Registration</h1>
              <p className="text-gray-600 mt-2">
                Join our team to help organize or judge competitions. Make a difference in your community!
              </p>
            </div>

            {submitSuccess ? (
              /* Success state */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Application Submitted!</h3>
                <p className="text-gray-600 mb-6">Thank you for your interest in volunteering with us.</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-md hover:opacity-90 transition shadow-md"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
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

                  {/* Experience */}
                  <div className="relative">
                    <input 
                      type="text" 
                      id="experience"
                      name="experience" 
                      value={formData.experience}
                      onChange={handleChange}
                      className={`peer placeholder-transparent h-10 w-full border-b-2 ${formErrors.experience ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:outline-none focus:border-cyan-500`}
                      placeholder="Years of Experience"
                    />
                    <label 
                      htmlFor="experience" 
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Years of Experience
                    </label>
                    {formErrors.experience && <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>}
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

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF/DOC)</label>
                      <input 
                        type="file" 
                        name="cv" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      />
                      {formErrors.cv && <p className="mt-1 text-sm text-red-600">{formErrors.cv}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (JPG/PNG)</label>
                      <input 
                        type="file" 
                        name="photo" 
                        accept="image/*" 
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      />
                      {formErrors.photo && <p className="mt-1 text-sm text-red-600">{formErrors.photo}</p>}
                    </div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}