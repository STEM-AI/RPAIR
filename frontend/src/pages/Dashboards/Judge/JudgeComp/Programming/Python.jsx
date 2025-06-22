import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useSearchParams } from 'react-router-dom';

export default function Python() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('eventName');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addNumOfQuestions = async (event) => {
    event.preventDefault();
    
    if (!numberOfQuestions) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please enter the number of questions',
      });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      // NOTE: Remember to replace {id} with actual competition ID
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/programming/number-of-questions/${id}/`,
        { number_of_questions: numberOfQuestions },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Number of questions added successfully!',
        showConfirmButton: false,
        timer: 2000
      });
      
      setNumberOfQuestions('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add questions';
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Programming Competition Setup</h2>
        <p className="text-gray-600">Set the number of questions </p>
      </div>
      
      <form onSubmit={addNumOfQuestions}>
        <div className="mb-6">
          <label 
            htmlFor="number_of_questions" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Questions
          </label>
          <div className="relative">
            <input 
              type="number"
              id="number_of_questions"
              name="number_of_questions"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
              min="1"
              max="100"
              className="w-full py-3 px-4 pl-11 pr-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
              placeholder="Enter number of questions"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
         
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-200 flex items-center justify-center
                    ${isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Questions
            </>
          )}
        </button>
      </form>
      
      
    </div>
  );
}