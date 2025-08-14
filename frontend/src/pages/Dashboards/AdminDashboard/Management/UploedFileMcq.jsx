// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// export default function UploadFileMcq() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const uploadFile = async (event) => {
//     event.preventDefault();
    
//     if (!selectedFile) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Missing File',
//         text: 'Please select a CSV file to upload',
//       });
//       return;
//     }

//     setIsLoading(true);
//     const token = localStorage.getItem('access_token'); // Get token from storage

//     try {
//       const formData = new FormData();
//       formData.append('file', selectedFile); // 'file' should match backend expectation

//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/programming/upload-questions/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       Swal.fire({
//         icon: 'success',
//         title: 'Upload Successful!',
//         text: 'MCQ questions have been uploaded successfully',
//         showConfirmButton: false,
//         timer: 2000
//       });
      
//       // Reset file input after successful upload
//       setSelectedFile(null);
//       document.getElementById('csv-upload').value = '';

//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'File upload failed';
//       Swal.fire({
//         icon: 'error',
//         title: 'Upload Failed',
//         text: errorMessage,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <form onSubmit={uploadFile}>
//         <div className="mb-4">
//           <label
//             htmlFor="csv-upload"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Upload MCQ Questions (CSV)
//           </label>
//           <input
//             id="csv-upload"
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-blue-50 file:text-blue-700
//                       hover:file:bg-blue-100"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             CSV format only. Download template for reference.
//           </p>
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full py-2 px-4 rounded-md text-white font-medium
//                     ${isLoading
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {isLoading ? 'Uploading...' : 'Upload Questions'}
//         </button>
//       </form>
//     </div>
//   );
// }



import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiUploadCloud, FiFile, FiX, FiDownload } from 'react-icons/fi';

export default function UploadFileMcq() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select a CSV file',
        });
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    const token = localStorage.getItem('access_token');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

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
      
      clearFile();

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upload MCQ Questions</h2>
        <p className="text-gray-500 mt-1">Add new questions for programming competition</p>
      </div>

      <form onSubmit={uploadFile}>
        {/* File Drop Zone */}
        <div 
          className={`mb-6 rounded-xl border-2 border-dashed ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } transition-colors duration-200 p-6 text-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <FiUploadCloud className="w-8 h-8" />
            </div>
            
            <div>
              <p className="font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                CSV format only (max 10MB)
              </p>
            </div>
            
            <button 
              type="button"
              className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Browse Files
            </button>
          </div>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="mb-6 flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center">
              <FiFile className="text-gray-500 mr-3 flex-shrink-0" size={20} />
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {selectedFile.name}
              </span>
            </div>
            <button 
              type="button" 
              onClick={clearFile}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
        )}


        {/* Upload Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center
                    ${
                      isLoading || !selectedFile
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all hover:shadow-lg'
                    }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Questions'
          )}
        </button>
      </form>
    </div>
  );
}