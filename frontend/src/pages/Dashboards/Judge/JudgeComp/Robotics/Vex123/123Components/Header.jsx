import Back from "../../../../../../../components/Back/Back";

export default function Header() {
  return (
    <>
      <Back />
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 mb-1 sm:mb-2">🤖 VEX123 Robotics</h1>
        <p className="text-sm sm:text-base md:text-xl text-gray-600">Performance Score Sheet</p>
      </div>
    </>
  );
}