


import { useState } from "react";
import { FaAward } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const awards = [
  { title: "Best clean code", criteria: [
      "Awarded to the project with the most organized, clear, and error-free code and Awarded to the project that demonstrates the best use of syntax, ensuring clarity and correctness."

    ]},
  { title: "Best algorithm design", criteria: [
      "Given to the best algorithm design that tackles the problem in an efficient and innovative way."

    ]},
  { title: "Most innovative idea", criteria: [
      "Awarded to the project that presents a new idea or an innovative method for solving a problem."

    ]},
  { title: "Best team collaboration", criteria: [
      "Given to the team that showed the best collaboration and organization while working on the project.",

    ]},
  { title: "Best user interface (UI)", criteria: [
      "Awarded to the project with the most attractive and easy-to-use user interface design.",
    ]},
  { title: "Best User Experience (UX)", criteria: [
      "Given to the project that provides the most outstanding and seamless user experience."
    ]},
  { title: "Most functional project", criteria: [
      "Awarded to the project that implemented the highest number of required functionalities while maintaining efficiency.",
    ]},
  { title: "Best Problem-Solving Approach", criteria: [
      "Given to the project that offers the best practical and effective solution to a real-world problem.",
    ]},
  { title: "Most Creative Visuals", criteria: [
      "Awarded to the project that incorporates the best creative designs or graphics.",
    ]},
  { title: "Best Use of Technology", criteria: [
      "Given to the project that utilizes available technologies in the most effective way.",

    ]},
  { title: "The Out-of-the-Box Thinker", criteria: [
      "Awarded to the project that solved the problem in an unconventional or unexpected way",

    ]},
  { title: "Fastest execution time", criteria: [
      "Awarded to the project that demonstrates the fastest performance, achieving optimal results in the shortest amount of time..",

    ]},
  { title: "Best Object-Oriented Code", criteria: [
      "Awarded to the project that demonstrates the best use of object-oriented programming principles.",
    ]},
    { title: "Youngest Programmer Award", criteria: [
        "Awarded to the youngest participant in the competition, recognizing their talent and effort.",
      ]}
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

const ProgrammingAwardsList = () => {
  return (
    <div className="flex flex-col gap-4 p-6 justify-center">
            <div className="text-center mb-5">
    <h2 className="bg-clip-text text-transparent pb-2 bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
      Programming AWARDS
    </h2>
  </div>
      <h1 className="text-2xl font-bold text-white text-center">Robotics Awards</h1>
      {awards.map((award, index) => (
        <AwardCard key={index} title={award.title} criteria={award.criteria} />
      ))}
    </div>
  );
};

export default ProgrammingAwardsList;

