import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../../../assets/Static/logoWrite-re.png";
import { FaDownload, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const CompOpen = () => {
  const { competition } = useParams();
  const [searchParams] = useSearchParams();
  const eventName = searchParams.get('eventName');
  const team_id = searchParams.get('teamId');
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("access_token");

  const competitionDetails = {
    arduino: {
      title: competition,
      description: "Showcase your embedded systems skills with innovative Arduino projects",
      color: "from-emerald-500 to-emerald-700",
      allowedTypes: ['.zip','.rar'],
      maxSize: 200
    },
    flutter: {
      title: competition,
      description: "Showcase your embedded systems skills with innovative Arduino projects",
      color: "from-emerald-500 to-emerald-700",
      allowedTypes: ['.zip','.rar'],
      maxSize: 200
    },
  };

  const details = competitionDetails[competition];
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!details.allowedTypes.includes(fileExtension)) {
        setUploadStatus(`Invalid file type. Only ${details.allowedTypes.join(', ')} allowed`);
        return;
      }
      
      // Check file size
      if (file.size > details.maxSize * 1024 * 1024) {
        setUploadStatus(`File exceeds ${details.maxSize}MB limit`);
        return;
      }
      
      setSelectedFile(file);
      setUploadStatus('File selected and ready to upload');
    } else {
      setSelectedFile(null);
      setUploadStatus('No file selected');
    }
  };

  const handleSubmit = async () => {
    if (!team_id) {
      return Swal.fire("Error", "Team data is not available", "error");
    }

    if (!selectedFile) {
      return Swal.fire("Error", "Please select a file first!", "error");
    }

    try {
      setLoading(true);
      setUploadStatus('Uploading...');
      
      const formData = new FormData();
      formData.append('attachment', selectedFile);

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/${competition}/${eventName}/team-attachment/${team_id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadStatus('Upload successful! Redirecting...');
      Swal.fire("Success", "Your file submitted successfully!", "success");
      
      setTimeout(() => {
        navigate('/Dashboard/Competitions');
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setUploadStatus('Upload failed. Please try again.');
      Swal.fire("Error", "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-100 opacity-10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div className="flex items-center justify-center gap-4 mb-6">
            <motion.img 
              src={logo} 
              alt="RPAIR Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                transition: { type: 'spring', stiffness: 300 }
              }}
            />
            <motion.h1 
              className="text-3xl pb-3 sm:text-4xl font-extrabold bg-gradient-to-r from-gray-50 to-gray-100 bg-clip-text text-transparent"
            >
              {details.title} Competition
            </motion.h1>
          </motion.div>
          <motion.p 
            className="text-lg text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {details.description}
          </motion.p>
        </motion.div>

        {/* File Upload Section */}
        <motion.div 
          className="bg-gray-100 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-200 border-opacity-30"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-cyan-800 mb-2">Project Submission</h2>
              <p className="text-gray-600">Upload a single compressed file ({details.allowedTypes.join(', ')})</p>
            </div>

            

            {/* File Upload Area */}
            <motion.div 
              className="border-2 border-dashed border-cyan-200 rounded-xl p-8 text-center bg-cyan-50/50 hover:bg-cyan-50/70 transition-colors cursor-pointer"
              onClick={handleFileSelect}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={details.allowedTypes.join(',')}
              />
              <div className="space-y-4">
                <svg 
                  className="w-12 h-12 mx-auto text-cyan-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-gray-600">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="text-cyan-700 font-medium truncate" title={selectedFile.name}>
                        {selectedFile.name}
                      </div>
                      <div className="text-sm text-cyan-600">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    "Click to select a compressed file"
                  )}
                </div>
                {uploadStatus && (
                  <p className={`text-sm ${uploadStatus.includes('success') ? 'text-green-600' : 
                                  uploadStatus.includes('ready') ? 'text-cyan-600' : 
                                  uploadStatus.includes('Uploading') ? 'text-yellow-600' : 
                                  'text-red-600'}`}>
                    {uploadStatus}
                  </p>
                )}
              </div>
            </motion.div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Max file size: {details.maxSize}MB</p>
              <p className="text-xs opacity-75 mt-1">Please compress your project to a single ZIP/RAR file</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="text-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={loading|| !selectedFile}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px -10px rgba(6, 182, 212, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className={`px-12 py-4 rounded-xl font-bold text-2xl text-white ${
              loading || !selectedFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br shadow-lg shadow-cyan-500/50'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            ) : (
              'Upload File'
            )}
          </motion.button>

          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-bold text-2xl text-cyan-100 bg-cyan-700/30 hover:bg-cyan-700/50 transition-colors"
          >
            Cancel
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompOpen;