
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const AddNews = () => {
  const [newsData, setNewsData] = useState({
    content: ""
  });
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newsData.content) {
      setError("Content is required.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/news/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newsData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Registration successful!",
                      showConfirmButton: false,
                        });

      setNewsData({ ...newsData, content: "" });
      setError(null); 
    } catch (error) {
      setError(error.message || "Error updating news");
      console.error("Error updating news:", error);
    }
  };

  const handleContentChange = (e) => {
    setNewsData({ ...newsData, content: e.target.value });
  };

  return (
    <div className="max-h-screen bg-gray-100 py-20">
       <Helmet>
              <title>Add News</title>
            </Helmet>
                      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="mb-6 pt-4 pb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-950 to-cyan-500 text-3xl sm:text-4xl md:text-5xl font-black">
          New News
        </h1>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <textarea
            id="newsInput"
            placeholder="Enter news content here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            rows={6}
            value={newsData.content}
            onChange={handleContentChange}
          />

          <button
            type="submit"
            className="mt-8 font-bold py-2 px-4 w-full rounded bg-cyan-800 hover:bg-cyan-600 transition-all duration-700 cursor-pointer text-white"
          >
            Update News
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNews;