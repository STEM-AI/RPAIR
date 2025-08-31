import { useState } from "react";
import { FaAward } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const awards = [
  {
    title: " Best Overall Application",
    criteria: [
      "Awarded to the student or team that delivers the most outstanding application in terms of idea and execution. ",
    ],
  },
  {
    title: "Most Innovative Idea",
      criteria: [
        "Awarded to the application that showcases a new and unique concept. "
    ],
  },
  {
    title: "Best User Interface (UI) Design",
      criteria: [
        "Awarded to the application with an attractive and user-friendly design."
    ],
  },
  {
    title: "Best User Experience (UX)",
    criteria: [
      "Awarded to the application that provides a smooth and seamless experience for users.",
    ],
  },
  {
    title: "Best Functional Application",
      criteria: [
          "Awarded to the application that offers practical and valuable functionality."
    ],
  },
  {
    title: "Best clean code",
    criteria: [
      "Awarded to the project with the most organized, clear, and error-free code and Awarded to the project that demonstrates the best use of syntax, ensuring clarity and correctness.",
    ],
  },
  {
    title: "(specialized Awards) Best Responsive Design Application",
    criteria: [
      "For the application that performs exceptionally well across various devices and screen sizes, ensuring an accessible and user-friendly experience. ",
    ],
  },
  {
    title: " (specialized Awards) Best Multilingual Application",
    criteria: [
        "For the application that supports multiple languages and delivers an outstanding experience to users from diverse backgrounds"
      ],
  },
  {
    title: " (specialized Awards)  Best Data Management Application",
    criteria: [
        "For the application that demonstrates expertise in organizing, managing, and processing data efficiently. "
      ],
  },
  {
    title: " (specialized Awards)  Best Fusion of Technology and Artistic Design",
      criteria: [
        "For the application that seamlessly combines advanced technical features with creative and artistic design to provide a unique and engaging experience. "
      ],
  },
  {
    title: " (Encouragement Awards)  Best Teamwork Award",
      criteria: [
        "For the team that demonstrated excellent collaboration and coordination throughout the development process."
      ],
  },
  {
    title: " (Encouragement Awards) Outstanding Young Developer Award",
      criteria: [
          "To encourage the youngest students who showcased creativity and excellence in their applications."
      ],
  },
  {
    title: " (Encouragement Awards)  Best Application Presentation Award",
      criteria: [
          "* For the application that was presented professionally and effectively during the evaluation process. "
      ],
  },
  {
    title: " (Encouragement Awards)  Audience Choice Award",
      criteria: [
        "For the application that won the admiration of the audience or a non-technical judging panel."
      ],
  },
  {
    title: " (Encouragement Awards) Best Community Impact Application",
      criteria: [
          "For the application aimed at solving social issues or contributing positively to the community. "
      ],
  },

];

const AwardCard = ({ title, criteria }) => {
  const [showCriteria, setShowCriteria] = useState(false);
  return (
    <>
      <div className="bg-gray-200 text-cyan-900 border-l-8 border-cyan-800 rounded-md px-4 py-3 w-full flex flex-col">
        <h3 className="text-lg font-bold flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <FaAward className="text-yellow-500" /> {title}
          </span>
          <button onClick={() => setShowCriteria(!showCriteria)}>
            {showCriteria ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </h3>
        {showCriteria && (
          <ul className="text-gray-800 font-thin text-sm pt-1 list-disc pl-4">
            {criteria.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const FlutterAwardsList = () => {
  return (
    <div className="flex flex-col gap-4 p-6 justify-center">
      <div className="text-center mb-5">
        <h2 className="bg-clip-text text-transparent pb-2 bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
          Flutter AWARDS
        </h2>
      </div>
      <h1 className="text-2xl font-bold text-white text-center">
        Robotics Awards
      </h1>
      {awards.map((award, index) => (
        <AwardCard key={index} title={award.title} criteria={award.criteria} />
      ))}
    </div>
  );
};

export default FlutterAwardsList;
