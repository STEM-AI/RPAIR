


import { useState } from "react";
import { FaAward } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const awards = [
  { title: "Electronics Award", criteria: [
      "Balance quality and cost ",
      "Choose the right Arduino board based on your project needs. For simple projects, an Arduino Uno or Nano is sufficient. For more complex projects, consider an Arduino Mega or MKR series board.",
      "Start with prototyping your project on a breadboard to test different components and configurations.",
    ]},
  { title: "Electricity Award", criteria: [
      "Use the Correct Voltage and Current ",
        "Voltage: Make sure your power supply matches the voltage requirements of your Arduino and other components. Most Arduinos operate at 5V or 3.3V. ",
        "Current: Ensure your power supply can provide enough current for all connected devices without exceeding their limits. Overloading components can cause overheating or damage ",
        "Wires: Use insulated wires to prevent accidental short circuits. ",
        "Connections: Ensure that all connections are secure and insulated, especially if you have exposed wires or terminals. "
            ]},
  { title: "Programming   Award", criteria: [
    "Choose Descriptive Names ",
    "Organize Your Code with Functions", 
    "Use Comments Wisely ",
        "Make your code neat and readable. "
    ] },
  { title: "Mechanical part  Award", criteria: [
        "Load and Stress: Determine the load and stress the mechanical parts will need to withstand. ",
        "Strength: Choose materials that can withstand the mechanical stress and load.",
        "Weight: Consider the weight of the parts, especially for projects that involve movement or portability. "
    ]
    },
  { title: "Design Award", criteria: [
      "Components: List all the components and sensors you'll be using and understand their functionality. ",
      "Components must be organized and clear on breadboard ",
    ]},
  { title: "Excellence Award", criteria: [
    "This award is given to the team who has mastered all of the above.",  
    ]
    },
  { title: "Best Practical Application  Award", criteria: [
    "An award for the project that provides a practical solution to a real problem using Arduino"  
    ]
    },
  { title: " Best Use of Sensors Award", criteria: [
      "Writing accurate and organized code with minimal errors.",
      "Using efficient algorithms to enhance robot performance.",
      "Applying programming to complete tasks effectively and efficiently.",
      "Seamless interaction between programming and other systems within the robot.",
      "Ability to modify programs to solve problems that arise during the competition."
    ]},
  { title: "Best Innovative Idea  Award", criteria: [
    "Award for the most innovative and different project using Arduino technology."  
    ]
    },
  { title: "Best Small Robot  Award", criteria: [
    "An award for the best robot built using Arduino that can perform tasks such as walking or avoiding obstacles. " 
    ]
    },
  { title: "Best Multi-Use Project Award", criteria: [
     "An award for the best project that can be used in multiple situations or applications, such as a device that can be converted from an educational project to an entertainment. "
    ]},
  { title: "Young Maker Award", criteria: [
      " For an outstanding project created by a young or new maker. "
    ]},
  { title: "Best Teamwork Award", criteria: [
  "For the team that demonstrated excellent collaboration and coordination throughout the development process."    
  ]},
  { title: "Best Documentation Award", criteria: [
    "Given to the project with the best organized and comprehensive documentation explaining the project and how to use it.  "
    ]
    },
  { title: "Best Presentation Award", criteria: [
"Awarded to the project with the best presentation in front of the judging panel. "
    ]},
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

const AwardsList = () => {
  return (
    <div className="flex flex-col gap-4 p-6 justify-center">
            <div className="text-center mb-10">
    <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
      ROBOTICS AWARDS
    </h2>
  </div>
      <h1 className="text-2xl font-bold text-white text-center">Robotics Awards</h1>
      {awards.map((award, index) => (
        <AwardCard key={index} title={award.title} criteria={award.criteria} />
      ))}
    </div>
  );
};

export default AwardsList;

