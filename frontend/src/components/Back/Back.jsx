import { useNavigate } from 'react-router-dom';

export default function Back() {
  const navigate = useNavigate();

  return (
    <div >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed bottom-8 left-2 lg:left-72 z-50 flex h-12 w-12 items-center justify-center rounded-full
         bg-white shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:bottom-12 sm:right-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

    </div>
  );
};