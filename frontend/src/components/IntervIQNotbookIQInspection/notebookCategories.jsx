// notebookCategories.js
export const notebookCategories = [
  {
    title: "Identify the Problem",
    description: "(Engineering Design Process)",
    category: "identify_problem",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Identifies the game and robot design challenges in detail at the start of each design process cycle with words and pictures. States the goals for accomplishing the challenge.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Identifies the challenge at the start of each design cycle. Lacking details in words, pictures, or goals.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not identify the challenge at the start of each design cycle.",
      },
    ],
  },
  {
    title: "Brainstorm, Diagram, or Prototype Solutions",
    description: "(Engineering Design Process)",
    category: "brainstorm_solutions",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Lists three or more possible solutions to the challenge with labeled diagrams. Citations provided for ideas from outside sources such as online videos or other teams.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Lists one or two possible solutions to the challenge. Citations provided for ideas that came from outside sources.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not list any solutions to the challenge.",
      },
    ],
  },
  {
    title: "Select Best Solution and Plan",
    description: "(Engineering Design Process)",
    category: "select_solution",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Explains why the solution was selected through testing and/or a decision matrix. Fully describes the plan to implement the solution.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Explains why the solution was selected. Mentions the plan.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not explain any plan or why the solution or plan was selected.",
      },
    ],
  },
  {
    title: "Build and Program the Solution",
    description: "(Engineering Design Process)",
    category: "build_program",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Records the steps to build and program the solution. Includes enough detail for the reader to follow the logic used by the team to develop their robot design and recreate it from the documentation.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records the key steps to build and program the solution. Lacks sufficient detail for the reader to follow the design process.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not record the key steps to build and program the solution.",
      },
    ],
  },
  {
    title: "Test Solution",
    description: "(Engineering Design Process)",
    category: "test_solution",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Records all the steps to test the solution, including test results.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records the key steps to test the solution.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not record steps to test the solution.",
      },
    ],
  },
  {
    title: "Repeat Design Process",
    description: "(Engineering Design Process)",
    category: "repeat_design",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Shows that the design process is repeated multiple times to improve performance on a design goal or robot/game performance.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Design process is not often repeated for design goals or robot/game performance.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not show that the design process is repeated.",
      },
    ],
  },
  {
    title: "Independent Inquiry",
    description: "(Engineering Design Process)",
    category: "independent_inquiry",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Team shows evidence of independent inquiry from the beginning stages of their design process. Notebook documents whether the implemented ideas have their origin with students on the team or if students found inspiration elsewhere.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Team shows evidence of independent inquiry for some elements of their design process. Ideas and information from outside the team are documented.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Team shows little to no evidence of independent inquiry in their design process. Ideas from outside the team are not properly credited.",
      },
    ],
  },
  {
    title: "Usability and Completeness",
    description: "(Engineering Design Process)",
    category: "usability_completeness",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Records the entire design and development process in such clarity and detail that the reader could recreate the project’s history.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records the design and development process completely but lacks sufficient detail.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Lacks sufficient detail to understand the design process.",
      },
    ],
  },
  {
    title: "Record of Team and Project Management",
    description: "(Engineering Design Process)",
    category: "team_management",
    options: [
      {
        level: "expert",
        label: "Expert (4,5)",
        message: "Provides a complete record of team and project assignments, team meeting notes including goals, decisions, and accomplishments. Design cycles are easily identified. Resource constraints including time and materials are noted throughout.",
      },
      {
        level: "proficient",
        label: "Proficient (2,3)",
        message: "Records most of the information listed at the left. Level of detail is inconsistent, or some aspects are missing.",
      },
      {
        level: "emerging",
        label: "Emerging (0,1)",
        message: "Does not record most of the information listed at the left. Not organized.",
      },
    ],
  },
  {
  title: "Notebook Format",
  description: "(Engineering Design Process)",
  category: "notebook_format",
  options: [
    {
      level: "expert_proficient",
      label: "Expert/Proficient (5 or Partial Points)",
      message: "Five (5) points if the notebook has evidence that documentation was done in sequence with the design process. This can take the form of dated entries with the names of contributing students included and an overall system of organization. For example, numbered pages and a table of contents with entries organized for future reference. Partial points may be awarded if this is inconsistent or incomplete.",
    },
    {
      level: "emerging",
      label: "Emerging (0 Points)",
      message: "Does not meet the criteria for organization and documentation.",
    },
  ],
}
];