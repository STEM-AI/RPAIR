

import React, { useState } from 'react';
import pdfFile from '../../../assets/PDFS/ProgrammingComp.pdf';

const RulesProgramming = () => {
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
                    ? `This coding competition tests your programming skills under time pressure. You'll solve multiple technical problems within a fixed time limit, showing how well you can think logically and solve challenges quickly. The contest evaluates both your knowledge and your ability to work efficiently when time matters most.

                   Each question checks different programming skills, from basic concepts to more advanced problem-solving. Since time is limited, you'll need to think carefully but also work fast - just like real-world coding situations where speed and accuracy are both important.
`
                    : `This coding competition tests your programming skills under time pressure. You'll solve multiple technical problems within a fixed time limit, showing how well you can think logically and solve challenges quickly. The contest evaluates both your knowledge and your ability to work efficiently when time matters most....`}
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

export default RulesProgramming;