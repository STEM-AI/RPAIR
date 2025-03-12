import { jsPDF } from "jspdf";

const tasks = [
  { title: "Move purple sensor to the fish habitat", points: 1 },
  { title: "Move blue sensor to the pipeline", points: 1 },
  { title: "Move the orange sensor to the volcano tile", points: 1 },
  { title: "Orange sensor placed on top of the volcano", points: 2 },
  { title: "Align the turbines", points: "1 per turbine", isDynamic: true },
  { title: "Open the clam", points: 1 },
  { title: "Remove the pearl from the clam", points: 1 },
  { title: "Deliver the pearl to the green starting tile", points: 1 },
  { title: "End with the robot on the green tile", points: 1 },
];

const SheetGO = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Ocean Science Exploration Competition", 20, 20);
  doc.setFontSize(14);

  doc.setFontSize(12);
  let y = 30;
  tasks.forEach((task, index) => {
    doc.text(`${task.title}: ${task.points} points`, 20, y);
    y += 10;
  });

  doc.save("Score_Sheet.pdf");
};

export default function VexGoScoreSheet() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Ocean Science Exploration Competition
      </h2>

      {/* Score Table */}
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-4 py-2">Task</th>
            <th className="border border-gray-300 px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className="bg-gray-100 border border-gray-300">
              <td className="px-4 py-2 border">{task.title}</td>
              <td className="px-4 py-2 border text-center">{task.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => alert("Score Submitted Successfully!")}
          className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
          Done
        </button>
        <button
          onClick={SheetGO}
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
