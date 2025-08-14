// import { FaAward } from "react-icons/fa6";

// const awards = [
//   {
//     title: "Excellence Award",
//     criteria: [
//       "Engineering Notebook: Rank at or near the top for quality and completeness",
//       "Team Interview: Present a high-quality, professional, and impactful interview",
//       "Award Consideration: Be a contender for other judged awards",
//       "Student-Centered Ethos: Display a commitment to student-driven work and decision-making",
//       "Team Conduct: Exhibit positive behavior, sportsmanship, and professionalism",
//       "Qualification Rankings: Achieve a ranking in the top 30% of qualification matches",
//       "Robot Skills Challenge: Rank in the top 30% for overall skills and the Autonomous Coding Challenge scores."
//     ]
//   },
//   {
//     title: "Design Award",
//     criteria: [
//       "Demonstrates a clear, complete, and organized record of an iterative Engineering Design Process.",
//       "Achieves top rankings in the Engineering Notebook Rubric.",
//       "Shows effective and efficient use of available resources to achieve goals.",
//       "Clearly explains the robot design and game strategy.",
//       "Displays high-quality communication, teamwork, and professionalism."
//     ]
//   },
//   {
//     title: "Sportsmanship Award",
//     criteria: [
//       "Team is courteous, helpful, and respectful to everyone at the event, on and off the field.",
//       "Team interacts with others in the spirit of friendly competition and cooperation.",
//       "Team acts with honesty and integrity, enriching the event experience for all."
//     ]
//   },
//   {
//     title: "Judges Award",
//     criteria: [
//       "The team distinguishes themselves with unique qualities or attributes that set them apart.",
//       "Demonstrates high-quality communication skills, professionalism, teamwork, and a student-centered ethos.",
//       "Displays exemplary effort, perseverance, or a standout quality that adds value to the event.",
//       "Successfully overcomes an obstacle or challenge, achieving a significant goal or milestone."
//     ]
//   },
//   {
//     title: "Think Award",
//     criteria: [
//       "Actively participates in the Autonomous Coding Skills Challenge with consistent and reliable performance.",
//       "Code is cleanly written, well-annotated, and thoroughly documented.",
//       "Demonstrates strategic programming tailored to solving the game challenge effectively.",
//       "Clearly explains their management process, including version history and collaborative efforts.",
//       "Articulates their programming strategy and development process with clarity and professionalism."
//     ]
//   },
//   {
//     title: "Build Award",
//     criteria: [
//       "The robot is durable, robust, and performs consistently under the pressure of competition conditions.",
//       "The robot design incorporates careful attention to safety and design details, ensuring both functional and safe operation.",
//       "Students clearly understand and can explain how they worked together to develop the robot design, demonstrating effective teamwork.",
//       "The team presents a high-quality interview that demonstrates professionalism, effective communication, and a student-centered ethos."
//     ]
//   },
//   {
//     title: "Teamwork Award",
//     criteria: [
//       "The team's ability to collaborate and coordinate among its members.",
//       "Fair distribution of tasks among team members.",
//       "Listening to team members' opinions and solving problems with a team spirit.",
//       "Effective communication and mutual support within the team.",
//       "Ability to adapt to changes and new challenges during the competition."
//     ]
//   },
//   {
//     title: "Programming Excellence Award",
//     criteria: [
//       "Writing accurate and organized code with minimal errors.",
//       "Using efficient algorithms to enhance robot performance.",
//       "Applying programming to complete tasks effectively and efficiently.",
//       "Seamless interaction between programming and other systems within the robot.",
//       "Ability to modify programs to solve problems that arise during the competition."
//     ]
//   },
//   {
//     title: "Driver Skills Award",
//     criteria: [
//       "Precision and smooth control of the robot during competitions.",
//       "Ability to execute complex movements without errors.",
//       "Accuracy in navigating the robot between points and achieving goals.",
//       "Fast interaction with various directives in the competition environment."
//     ]
//   },
//   {
//     title: "Strategy Award",
//     criteria: [
//       "Developing a clear and effective strategic plan for all stages of the competition.",
//       "Ability to adapt to changing conditions and adjust strategies accordingly.",
//       "Balancing offensive and defensive objectives.",
//       "Ability to think ahead and make quick decisions in critical situations.",
//       "Using well-thought-out tactics to achieve the best possible result."
//     ]
//   },
//   {
//     title: "Rookie Team Award",
//     criteria: [
//       "Outstanding performance from a team participating for the first time in the competition.",
//       "Strong willingness to learn and develop.",
//       "Rapid adaptation to the competition environment and achieving encouraging results despite limited experience.",
//       "Demonstrating dedication and the ability to collaborate with other teams.",
//       "Notable improvement in performance from the start to the end of the competition."
//     ]
//   }
// ];

// const AwardCard = ({ title, criteria }) => (
//   <div className="bg-gray-100 text-black border-l-8 border-green-500 rounded-md px-4 py-3 w-full md:w-5/12 lg:w-3/12">
//     <h3 className="font-serif text-lg font-bold flex items-center gap-2">
//       <FaAward className="text-yellow-500" /> {title}
//     </h3>
//     <ul className="text-gray-500 font-thin text-sm pt-1 list-disc pl-4">
//       {criteria.map((item, index) => (
//         <li key={index}>{item}</li>
//       ))}
//     </ul>
//   </div>
// );

// const AwardsList = () => {
//   return (
//     <div className="flex flex-wrap gap-4 p-6 justify-center">
//       {awards.map((award, index) => (
//         <AwardCard key={index} title={award.title} criteria={award.criteria} />
//       ))}
//     </div>
//   );
// };

// export default AwardsList;





import { useState } from "react";
import { FaAward } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const awards = [
  { title: "Excellence Award", criteria: [
      "Engineering Notebook: Rank at or near the top for quality and completeness",
      "Team Interview: Present a high-quality, professional, and impactful interview",
      "Award Consideration: Be a contender for other judged awards",
      "Student-Centered Ethos: Display a commitment to student-driven work and decision-making",
      "Team Conduct: Exhibit positive behavior, sportsmanship, and professionalism",
      "Qualification Rankings: Achieve a ranking in the top 30% of qualification matches",
      "Robot Skills Challenge: Rank in the top 30% for overall skills and the Autonomous Coding Challenge scores."
    ]},
  { title: "Design Award", criteria: [
      "Demonstrates a clear, complete, and organized record of an iterative Engineering Design Process.",
      "Achieves top rankings in the Engineering Notebook Rubric.",
      "Shows effective and efficient use of available resources to achieve goals.",
      "Clearly explains the robot design and game strategy.",
      "Displays high-quality communication, teamwork, and professionalism."
    ]},
  { title: "Sportsmanship Award", criteria: [
      "Team is courteous, helpful, and respectful to everyone at the event, on and off the field.",
      "Team interacts with others in the spirit of friendly competition and cooperation.",
      "Team acts with honesty and integrity, enriching the event experience for all."
    ]},
  { title: "Judges Award", criteria: [
      "The team distinguishes themselves with unique qualities or attributes that set them apart.",
      "Demonstrates high-quality communication skills, professionalism, teamwork, and a student-centered ethos.",
      "Displays exemplary effort, perseverance, or a standout quality that adds value to the event.",
      "Successfully overcomes an obstacle or challenge, achieving a significant goal or milestone."
    ]},
  { title: "Think Award", criteria: [
      "Actively participates in the Autonomous Coding Skills Challenge with consistent and reliable performance.",
      "Code is cleanly written, well-annotated, and thoroughly documented.",
      "Demonstrates strategic programming tailored to solving the game challenge effectively.",
      "Clearly explains their management process, including version history and collaborative efforts.",
      "Articulates their programming strategy and development process with clarity and professionalism."
    ]},
  { title: "Build Award", criteria: [
      "The robot is durable, robust, and performs consistently under the pressure of competition conditions.",
      "The robot design incorporates careful attention to safety and design details, ensuring both functional and safe operation.",
      "Students clearly understand and can explain how they worked together to develop the robot design, demonstrating effective teamwork.",
      "The team presents a high-quality interview that demonstrates professionalism, effective communication, and a student-centered ethos."
    ]},
  { title: "Teamwork Award", criteria: [
      "The team's ability to collaborate and coordinate among its members.",
      "Fair distribution of tasks among team members.",
      "Listening to team members' opinions and solving problems with a team spirit.",
      "Effective communication and mutual support within the team.",
      "Ability to adapt to changes and new challenges during the competition."
    ]},
  { title: "Programming Excellence Award", criteria: [
      "Writing accurate and organized code with minimal errors.",
      "Using efficient algorithms to enhance robot performance.",
      "Applying programming to complete tasks effectively and efficiently.",
      "Seamless interaction between programming and other systems within the robot.",
      "Ability to modify programs to solve problems that arise during the competition."
    ]},
  { title: "Driver Skills Award", criteria: [
      "Precision and smooth control of the robot during competitions.",
      "Ability to execute complex movements without errors.",
      "Accuracy in navigating the robot between points and achieving goals.",
      "Fast interaction with various directives in the competition environment."
    ]},
  { title: "Strategy Award", criteria: [
      "Developing a clear and effective strategic plan for all stages of the competition.",
      "Ability to adapt to changing conditions and adjust strategies accordingly.",
      "Balancing offensive and defensive objectives.",
      "Ability to think ahead and make quick decisions in critical situations.",
      "Using well-thought-out tactics to achieve the best possible result."
    ]},
  { title: "Rookie Team Award", criteria: [
      "Outstanding performance from a team participating for the first time in the competition.",
      "Strong willingness to learn and develop.",
      "Rapid adaptation to the competition environment and achieving encouraging results despite limited experience.",
      "Demonstrating dedication and the ability to collaborate with other teams.",
      "Notable improvement in performance from the start to the end of the competition."
    ]},
  { title: "Mechanical Mastery Award", criteria: [
      "Innovative mechanical design with high technical performance.",
      "Execution of complex mechanisms that work smoothly and accurately.",
      "Focus on mechanical design to achieve maximum efficiency.",
      "Using appropriate materials and techniques to achieve optimal performance.",
      "The robot's ability to withstand various operational conditions without issues."
    ]},
  { title: "Best Use of Sensors Award", criteria: [
      "Effective use of multiple sensors to enhance robot performance.",
      "Innovative integration of sensors to solve problems and achieve goals.",
      "Accurate data reading from sensors and interaction with the robot.",
      "Maximizing sensor use to improve robot movement and interaction with the environment.",
      "Applying sensors in the robot to achieve better results and efficiency."
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

