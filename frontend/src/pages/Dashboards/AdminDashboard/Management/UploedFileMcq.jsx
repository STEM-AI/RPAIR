import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UploadFileMcq() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Missing File',
        text: 'Please select a CSV file to upload',
      });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('access_token'); // Get token from storage

    try {
      const formData = new FormData();
      formData.append('file', selectedFile); // 'file' should match backend expectation

      await axios.post(
        `${process.env.REACT_APP_API_URL}/programming/upload-questions/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: 'MCQ questions have been uploaded successfully',
        showConfirmButton: false,
        timer: 2000
      });
      
      // Reset file input after successful upload
      setSelectedFile(null);
      document.getElementById('csv-upload').value = '';

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'File upload failed';
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={uploadFile}>
        <div className="mb-4">
          <label 
            htmlFor="csv-upload" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload MCQ Questions (CSV)
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            CSV format only. Download template for reference.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
                    ${isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Uploading...' : 'Upload Questions'}
        </button>
      </form>
    </div>
  );
}