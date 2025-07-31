import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import axios from "axios";
import { React, useState } from "react";
import logo from "../../assets/Static/logoWrite-re.png";
import bgimg from "../../assets/Static/bg.png";
import { Link, Navigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Helmet } from "react-helmet-async";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { HiPhone } from "react-icons/hi";
import CircularProgress from '@mui/material/CircularProgress';
import logoblack from "../../assets/Static/logo2.png";

export default function RegisterOrg() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        address: "",
        date_of_birth: "",
        phone_number: "",
        organizationName: "",
        organizationType: ""
    });

    const [state, setState] = useState({
        showAlert: false,
        isPasswordValid: false,
        navigate: false,
        loading: false,
        error: null,
        passwordVisible: false,
        confirmPasswordVisible: false,
        organizationContacts: [{ phone_number: "" }]
    });

    const togglePasswordVisibility = (field) => {
        setState(prev => ({
            ...prev,
            [`${field}Visible`]: !prev[`${field}Visible`]
        }));
    };

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone_number' || name.includes('contact_')) {
            let formattedValue = value.replace(/[^\d+]/g, '');
            if (!formattedValue.startsWith('+20')) {
                formattedValue = '+20' + formattedValue.replace('+', '');
            }
            if (formattedValue.length > 13) {
                formattedValue = formattedValue.slice(0, 13);
            }
            
            if (name.includes('contact_')) {
                const index = parseInt(name.split('_')[1]);
                const updatedContacts = [...state.organizationContacts];
                updatedContacts[index].phone_number = formattedValue;
                setState(prev => ({ ...prev, organizationContacts: updatedContacts }));
            } else {
                setFormData(prev => ({ ...prev, [name]: formattedValue }));
            }
            return;
        }
        
        if (name === 'password') {
            setState(prev => ({ ...prev, isPasswordValid: validatePassword(value) }));
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddContact = () => {
        setState(prev => ({
            ...prev,
            organizationContacts: [...prev.organizationContacts, { phone_number: "" }]
        }));
    };

    const handleRemoveContact = (index) => {
        setState(prev => ({
            ...prev,
            organizationContacts: prev.organizationContacts.filter((_, i) => i !== index)
        }));
    };

    const signUp = async (e) => {
        e.preventDefault();
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (formData.password !== formData.confirmPassword) {
            setState(prev => ({ ...prev, error: "Passwords do not match.", loading: false }));
            return;
        }

        if (!state.isPasswordValid) {
            setState(prev => ({ ...prev, error: "Password does not meet the requirements.", loading: false }));
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/organization/`,
                {
                    ...formData,
                    confirmPassword: undefined,
                    name: formData.organizationName,
                    type: formData.organizationType,
                    contacts: state.organizationContacts
                },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            
            setState(prev => ({ ...prev, navigate: true }));
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Registration successful!",
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Registration error:", err);
            let errorMessage = "Registration failed. Try again.";

            if (err.response) {
                if (err.response.data.email) {
                    errorMessage = err.response.data.email;
                } else if (err.response.data.phone_number) {
                    errorMessage = err.response.data.phone_number;
                } else if (err.response.data.username) {
                    errorMessage = err.response.data.username;
                } else {
                    errorMessage = err.response.data.detail || errorMessage;
                }
            }

            setState(prev => ({ ...prev, error: errorMessage }));
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    if (state.navigate) {
        return <Navigate to="/login" />;
    }

    const personalInfoFields = [
        { label: "First Name", name: "first_name", type: "text" },
        { label: "Last Name", name: "last_name", type: "text" },
        { label: "Username", name: "username", type: "text" }
    ];

    const contactInfoFields = [
        { label: "Email", name: "email", type: "email" },
        { label: "Country", name: "country", type: "text" },
        { label: "Phone Number", name: "phone_number", type: "tel", placeholder: "+20XXXXXXXXXX" }
    ];

    const orgInfoFields = [
        { label: "Organization Name", name: "organizationName", type: "text" },
        { label: "Organization Type", name: "organizationType", type: "select", options: ["", "profit", "non-profit"] }
    ];

    return (
        <div className="min-h-screen relative py-14" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${bgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <Helmet>
                <title>Organization Registration</title>
            </Helmet>

            <div className="relative flex justify-center mx-auto bg-white rounded-2xl shadow-xl sm:mx-auto max-w-xl lg:max-w-5xl overflow-hidden">
                {/* Left Section */}
                <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-cyan-700 to-cyan-400 items-center justify-center p-12">
                    <div className="text-center space-y-8">
                        <img src={logo} alt="Logo" className="w-48 mx-auto mb-8" />
                        <h2 className="text-3xl font-bold text-white mb-4">Create Organization Account</h2>
                        <p className="text-cyan-100 mb-8">Join our community to start your journey</p>
                        <Link
                            to="/login"
                            className="inline-block px-8 py-3 text-sm font-semibold text-cyan-700 bg-white rounded-full hover:bg-opacity-90 transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-2/3 p-4 sm:p-12">
                    <div className="lg:hidden mb-8 text-center">
                        <img src={logoblack} alt="Logo" className="w-32 mx-auto" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        Organization Registration
                    </h2>

                    <Link 
                        to="/register" 
                        className="block text-center mb-8 text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                        Register as User
                    </Link>

                    <form className="space-y-6" onSubmit={signUp}>
                        {state.error && (
                            <Alert severity="error" className="rounded-lg bg-red-50 border border-red-200">
                                <strong>Error:</strong> {state.error}
                            </Alert>
                        )}

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-cyan-900 mb-4 pb-2 border-b border-cyan-100">
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {personalInfoFields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                            type={field.type}
                                            placeholder={field.label}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {contactInfoFields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                            type={field.type}
                                            placeholder={field.placeholder || field.label}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                        type="text"
                                        placeholder="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors pr-12"
                                    type={state.passwordVisible ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setState(prev => ({ ...prev, showAlert: true }))}
                                    onBlur={() => { if (state.isPasswordValid) setState(prev => ({ ...prev, showAlert: false }))}}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('password')}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                >
                                    {state.passwordVisible ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors pr-12"
                                    type={state.confirmPasswordVisible ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                >
                                    {state.confirmPasswordVisible ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {state.showAlert && !state.isPasswordValid && (
                            <Alert severity="info" className="rounded-lg border border-cyan-200 bg-cyan-50">
                                <strong>Password Requirements:</strong>
                                <ul className="list-disc pl-4 mt-1">
                                    <li>Uppercase letter</li>
                                    <li>Lowercase letter</li>
                                    <li>Number</li>
                                    <li>Special character (@#$%^&* etc.)</li>
                                </ul>
                            </Alert>
                        )}

                        {/* Organization Information */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-cyan-900 mb-4 pb-2 border-b border-cyan-100">
                                Organization Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orgInfoFields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                        </label>
                                        {field.type === 'select' ? (
                                            <select
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required
                                            >
                                                {field.options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option || "Select Type"}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                                type={field.type}
                                                placeholder={field.label}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-cyan-800 flex items-center gap-2">
                                    <HiPhone className="text-lg" />
                                    Contact Numbers
                                </h4>
                                {state.organizationContacts.map((contact, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-colors"
                                            value={contact.phone_number}
                                            type="tel"
                                            placeholder="+20XXXXXXXXXX"
                                            name={`contact_${index}`}
                                            onChange={handleChange}
                                            required
                                        />
                                        {state.organizationContacts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveContact(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <IoIosRemoveCircle className="text-2xl" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddContact}
                                    className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 text-sm"
                                >
                                    <IoIosAddCircle className="text-lg" />
                                    Add Contact Number
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={state.loading}
                            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {state.loading ? (
                                <>
                                    <CircularProgress size={20} thickness={5} className="text-white" />
                                    <span>Registering...</span>
                                </>
                            ) : (
                                'Create Organization Account'
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-cyan-600 hover:text-cyan-700"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}