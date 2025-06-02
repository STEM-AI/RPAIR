// OrgDetails.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaEnvelope, FaPhone, FaLink, FaBuilding, FaCheck, FaTimesCircle, FaUser, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

const OrgDetails = ({ orgID, onClose }) => {
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You are not authorized. Please log in.",
      });
      onClose();
      return;
    }

    const fetchOrg = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/organization/${orgID}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Transform API data to match component needs
        const transformedData = {
          ...response.data,
          // Add computed properties
          has_teams: response.data.teams?.length > 0,
          has_events: response.data.events?.length > 0,
          // Map contacts to expected structure
          contacts: response.data.contacts?.map(contact => ({
            phone: contact.phone_number || 'N/A',
            email: response.data.email || 'N/A'
          })) || []
        };

        setOrg(transformedData);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.detail || "Failed to fetch organization details",
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrg();
  }, [token, orgID, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white sticky top-0">
          <h2 className="text-xl font-bold">Organization Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-cyan-200 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : org ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-2xl font-bold text-gray-800">{org.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  org.is_active 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {org.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <DetailItem icon={<FaBuilding />} label="Address" value={org.address} />
                  <DetailItem icon={<FaEnvelope />} label="Email" value={org.email} />
                  <DetailItem icon={<FaLink />} label="Type" value={org.type} />
                </div>
                
                <div className="space-y-4">
                  <DetailItem 
                    icon={<FaCheck className="text-green-500" />} 
                    label="Teams" 
                    value={org.has_teams ? "Yes" : "No"} 
                  />
                  <DetailItem 
                    icon={<FaCheck className="text-green-500" />} 
                    label="Events" 
                    value={org.has_events ? "Yes" : "No"} 
                  />
                  <DetailItem 
                    icon={<FaUser className="text-cyan-600" />} 
                    label="Owner ID" 
                    value={org.owner} 
                  />
                </div>
              </div>
              
              {/* Contacts Section */}
              {org.contacts.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Contacts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {org.contacts.map((contact, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 flex items-center mt-1">
                          <FaPhone className="mr-2 text-sm opacity-70" /> 
                          {contact.phone}
                        </p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <FaEnvelope className="mr-2 text-sm opacity-70" /> 
                          {contact.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Teams Section */}
              {org.teams && org.teams.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Teams ({org.teams.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {org.teams.map((team, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium flex items-center">
                          <FaUsers className="mr-2 text-cyan-600" />
                          {team.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">ID: {team.id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Events Section */}
              {org.events && org.events.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Events ({org.events.length})</h4>
                  <div className="space-y-3">
                    {org.events.map((event, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{event.name}</h5>
                          <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                            ID: {event.id}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          <div className="flex items-center text-sm">
                            <FaCalendarAlt className="mr-2 text-gray-500" />
                            <span className="font-medium">Dates:</span>
                            <span className="ml-1">
                              {event.start_date} to {event.end_date}
                            </span>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Location:</span> {event.location}
                          </div>
                          
                          {event.competition_name && (
                            <div className="text-sm md:col-span-2">
                              <span className="font-medium">Competition:</span> {event.competition_name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              <FaTimesCircle className="mx-auto text-4xl mb-3" />
              <p>Failed to load organization details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="mt-1 mr-3 text-cyan-600">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "N/A"}</p>
    </div>
  </div>
);

export default OrgDetails;