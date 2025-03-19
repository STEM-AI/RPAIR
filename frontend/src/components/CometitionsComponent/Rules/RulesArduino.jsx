import React, { useState } from 'react';
import pdfFile from '../../../assets/PDFS/arduino-ruless.pdf'; 

const RulesArduino = () => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <section className="py-12 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
          {/* Text Section */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                <h3 className="mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
                  COMPETITION RULES
                </h3>
                <p className="text-gray-700 text-base font-normal leading-relaxed lg:text-start text-center">
                  {showFullText
                    ? `The Arduino competition is designed for teams of 2–3 students who must create functional and safe projects using only the components provided in the kit.
                     All code must be written during the competition, and no internet access is allowed, though teams can bring printed reference materials.
                      The competition is divided into two age categories: Lower Level (13–15 years old) and Upper Level (16–18 years old).
                       Each level has two matches where teams design and build Arduino-based circuits to solve specific challenges, such as creating smart solutions or interactive systems.
                        Projects are judged on functionality, code logic, creativity, wiring, and presentation, with bonus points for exceptional innovation.
                    Safety is a priority, and judges are available to assist with any concerns. The judges' decisions are final, and teams must ensure their projects are completed within the allotted time.`
                    : `The Arduino competition is designed for teams of 2–3 students who must create functional and safe projects using only the components provided in the kit.
                     All code must be written during the competition...`}
                </p>
              </div>
            </div>

            <button
              onClick={toggleText}
              className="sm:w-fit w-full px-3.5 py-2 bg-cyan-600 hover:bg-cyan-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex"
            >
              <span className="px-1.5 text-white text-sm font-medium leading-6">
                {showFullText ? 'Read Less' : 'Read More'}
              </span>
            </button>
          </div>

          {/* PDF Section */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
              <h4 className="text-gray-700 text-xl font-semibold mb-4">View and Download Competition Rules</h4>
              {/* Display PDF */}
              <iframe
                src={pdfFile}
                title="Rules of VEX IQ Competition"
                className="w-full h-96 rounded-lg border"
              ></iframe>
              {/* Download PDF */}
              <a
                href={pdfFile}
                download
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-800 text-white rounded-lg block text-center"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesArduino;


