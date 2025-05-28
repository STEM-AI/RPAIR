  import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { FiSearch, FiTrash2, FiToggleLeft, FiToggleRight, FiAlertCircle } from "react-icons/fi";
import AlertTitle from "@mui/material/AlertTitle";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";




export default function ActiveOrg() {
    const [searchQuery, setSearchQuery] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [isActiveFilter, setIsActiveFilter] = useState("");
    const token = localStorage.getItem("access_token");

    const fetchOrganizations = async () => {
        if (!token) {
            setError("Authentication Error");
            setResponseMessage("You are not authorized. Please log in.");
            setAlertType("error");
            setLoading(false);
            return;
        }

        const params = {
            search: searchQuery,
            is_active: isActiveFilter
        };

        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/organization/list-organizations/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params
                }
            );

            setOrganizations(response.data);


            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
            handleApiError(err);
        }
    };

    const handleApiError = (err) => {
        if (err.code === "ECONNABORTED") {
            setResponseMessage("Request timed out. Please check your connection.");
        } else if (axios.isAxiosError(err)) {
            setResponseMessage(
                err.response?.data?.message || "Failed to fetch organizations."
            );
        } else {
            setResponseMessage("An unexpected error occurred.");
        }
        setAlertType("error");
    };

    const toggleOrganizationStatus = async (orgId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/admin/active-organization/${orgId}/`,
                {}, // Empty request body
                { headers: { Authorization: `Bearer ${token}` } } // Correct headers position
            );
    
            // Update state to reflect the change
            setOrganizations(organizations.map(org => 
                org.id === orgId ? { ...org, is_active: !org.is_active } : org
            ));
            
            Swal.fire({
                icon: "success",
                title: "Status Updated",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: err.response?.data?.detail || "Could not update status",
            });
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, [searchQuery, isActiveFilter]);

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDeleteOrganization = async (org) => {
    // التحقق من وجود فرق أو أحداث مرتبطة بالمنظمة
    if (org.has_teams || org.has_events) {
      let errorMessage = "Cannot delete organization because it has ";
      const issues = [];
      
      if (org.has_teams) issues.push("teams");
      if (org.has_events) issues.push("events");
      
      errorMessage += issues.join(" and ") + " associated with it.";
      
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: errorMessage,
        footer: "You must remove all teams and events first."
      });
      return;
    }
  
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete the "${org.name}" organization? \n You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (!confirmation.isConfirmed) return;
  
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/organization/delete-organization/${org.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // تحديث قائمة المنظمات بعد الحذف
      setOrganizations(organizations.filter(organization => organization.id !== org.id));
      
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Organization has been deleted.",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.response?.data?.detail || "Could not delete organization",
      });
    }
  };


    return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
                    Organizations
                </span>
                <div className="mt-2 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 w-24 mx-auto rounded-full" />
            </motion.h2>

            {/* Search and Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:max-w-xs relative">
                    <FiSearch className="absolute left-4 top-3.5 text-cyan-500" />
                    <input
                        type="text"
                        placeholder="Search organizations..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-cyan-100 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                    <select 
                        className="w-full sm:w-48 px-4 py-2.5 border-2 border-cyan-100 rounded-full bg-white text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-all"
                        value={isActiveFilter}
                        onChange={(e) => setIsActiveFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton 
                            key={i} 
                            height={64} 
                            className="rounded-xl"
                            baseColor="#e0f7fa"
                            highlightColor="#f0fdff"
                        />
                    ))}
                </div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Alert 
                        severity="error" 
                        className="mb-4 rounded-xl border-2 border-red-100 bg-red-50"
                        icon={<FiAlertCircle className="text-red-600" />}
                    >
                        <AlertTitle className="font-bold">Error</AlertTitle>
                        {responseMessage}
                    </Alert>
                </motion.div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-cyan-50">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100">
                                <tr>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-cyan-700">ID</th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-cyan-700">Organization</th>
                                    <th className="px-6 py-5 text-left text-sm font-semibold text-cyan-700">Status</th>
                                    <th className="px-6 py-5 text-center text-sm font-semibold text-cyan-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cyan-100">
                                {filteredOrgs.map((org) => (
                                    <motion.tr 
                                        key={org.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-cyan-50 transition-colors "
                                    >
                                        <td className="px-6 py-4 font-medium text-cyan-900">{org.id}</td>
                                        <td className="px-6 py-4 font-medium text-cyan-900">{org.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                    org.is_active 
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}>
                                                    {org.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleOrganizationStatus(org.id)}
                                                    className="p-4 rounded-lg hover:bg-cyan-100 transition-colors relative group"
                                                >
                                                    {org.is_active ? (
                                                        <FiToggleRight className="w-6 h-6 text-green-500" />
                                                    ) : (
                                                        <FiToggleLeft className="w-6 h-6 text-red-500" />
                                                    )}
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                        {org.is_active ? "Deactivate" : "Activate"}
                                                    </span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteOrganization(org)}
                                                    className="p-4 rounded-lg hover:bg-red-100 transition-colors relative group"
                                                >
                                                    <FiTrash2 className="w-5 h-5 text-red-600" />
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                        Delete
                                                    </span>
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden space-y-4 p-4">
                        {filteredOrgs.map((org) => (
                            <motion.div
                                key={org.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border-2 border-cyan-50 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-cyan-800">
                                            {org.name}
                                        </h3>
                                        <p className="text-sm text-cyan-600 mt-1">ID: {org.id}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs ${
                                        org.is_active 
                                            ? "bg-green-100 text-green-700" 
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {org.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-2 border-t border-cyan-100 pt-3">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleOrganizationStatus(org.id)}
                                        className="flex items-center justify-center px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition-colors"
                                    >
                                        {org.is_active ? (
                                            <FiToggleRight className="w-5 h-5 text-green-500 mr-2" />
                                        ) : (
                                            <FiToggleLeft className="w-5 h-5 text-red-500 mr-2" />
                                        )}
                                        {org.is_active ? "Deactivate" : "Activate"}
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDeleteOrganization(org)}
                                        className="flex items-center justify-center px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4 mr-2" />
                                        Delete Organization
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredOrgs.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-cyan-50 m-4 rounded-xl"
                        >
                            <div className="text-cyan-400 mb-4">
                                <FiSearch className="mx-auto w-16 h-16" />
                            </div>
                            <h3 className="text-xl font-medium text-cyan-800 mb-2">
                                No organizations found
                            </h3>
                            <p className="text-cyan-600 text-sm">
                                Try adjusting your search terms or filters
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setIsActiveFilter("");
                                }}
                                className="mt-4 px-6 py-2 bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}