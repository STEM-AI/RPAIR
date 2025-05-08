import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaUsers, FaBook, FaMicrophone } from 'react-icons/fa';


const cards = [
  { title: 'Inspection', icon: <FaSearch size={50} />, route: '/Dashboard/Judge/inspection', bg: 'bg-blue-500' },
  { title: 'Matches', icon: <FaUsers size={50} />, route: '/Dashboard/Judge/matches', bg: 'bg-green-500' },
  { title: 'Engineering Notebook', icon: <FaBook size={50} />, route: '/Dashboard/Judge/Notebook', bg: 'bg-yellow-500' },
  { title: 'Interview', icon: <FaMicrophone size={50} />, route: '/Dashboard/Judge/interview', bg: 'bg-red-500' },
];


export default function StartMatchIQ() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const event_name = searchParams.get('eventName');

  return (
    <div className="mx-auto text-center flex flex-col justify-center items-center">
      <h2 className="mb-10 py-4  bg-clip-text text-blue-950
        text-3xl sm:text-4xl lg:text-5xl font-black">
        Welcome to VEX IQ Challenge
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full ">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(`${card.route}?eventName=${encodeURIComponent(event_name)}`)}
            className={`relative min-w-64 h-80 cursor-pointer rounded-2xl shadow-lg transition-all duration-500 hover:shadow-gray-300 overflow-hidden flex flex-col items-center justify-center ${card.bg} text-white`}
          >
            <div className="mb-4">{card.icon}</div>
            <div className="text-xl font-semibold">{card.title}</div>
            <button className="mt-4 px-6 py-2 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-300 transition-all">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

