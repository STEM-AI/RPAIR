import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaCheck, FaTimes, FaChevronRight } from 'react-icons/fa';

export default function EditTimeIQ({ id, onTimeChange }) {
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [success, setSuccess] = useState(false);

 
  const handleClose = () => {
    setIsVisible(false);
  };

   const saveTimeLimit = async (seconds) => {
    if (!id || isSaving) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Missing authentication token');
      
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/core/event/${id}/time-limit/`,
        { time_limit: seconds },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setTimeInSeconds(seconds);
      if (onTimeChange) onTimeChange(seconds);
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    } catch (err) {
      setError('Failed to update time limit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getDisplayTime = (seconds) => {
    return seconds === 60 
      ? '1 minute (60 seconds)' 
      : '1.5 minutes (90 seconds)';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FaClock className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white">Time Limit Settings</h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-5 text-center">
            Set the time limit for each question in this event
          </p>
          
          <div className="space-y-3 mb-6">
            {/* 60 seconds option */}
            <button
              onClick={() => saveTimeLimit(60)}
              disabled={isSaving}
              className={`w-full py-4 px-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
                ${timeInSeconds === 60 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'}
                ${isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
              `}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3
                  ${timeInSeconds === 60 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                >
                  {timeInSeconds === 60 && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">1 minute</div>
                  <div className="text-sm text-gray-500">60 seconds</div>
                </div>
              </div>
              
            </button>
            
            <button
              onClick={() => saveTimeLimit(90)}
              disabled={isSaving}
              className={`w-full py-4 px-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
                ${timeInSeconds === 90 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'}
                ${isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
              `}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3
                  ${timeInSeconds === 90 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                >
                  {timeInSeconds === 90 && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">1.5 minutes</div>
                  <div className="text-sm text-gray-500">90 seconds</div>
                </div>
              </div>
              
            </button>
          </div>
          
          
          {/* Status indicators */}
          <div className="h-12 flex items-center justify-center">
            {isSaving && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Saving your selection...</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center justify-center animate-fadeIn">
                <FaCheck className="text-green-500 mr-2" />
                <span className="text-green-700 font-medium">Time limit updated successfully!</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center animate-fadeIn">
                <FaTimes className="text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </div>
        </div>
        
        
        </div>
      </div>
  );
}