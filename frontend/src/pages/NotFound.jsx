import React from "react";
import { Link } from "react-router-dom"
import IMG from "../assets/Static/404.png"

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="text-center animate-fadeIn">
        <img
            src={IMG}
            alt="404 Illustration"
            className="mx-auto w-1/3 animate-float shadow-xl rounded-lg"
            />

    <h1 className="mb-4 pt-4 pb-8 tracking-tight text-center text-cyan-500 text-5xl font-black">

          Looks Like You're Lost!
        </h1>
        <p className="text-xl text-gray-700 mt-2 ">
          We can't seem to find the page you're looking for.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-cyan-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105 hover:bg-cyan-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
