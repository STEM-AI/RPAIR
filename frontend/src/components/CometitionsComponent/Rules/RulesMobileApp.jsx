import React, { useState } from "react";

const Rules = () => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  // Content for the rules section
  const rulesContent = {
    title: "COMPETITION RULES",
    summary: "📢 Flutter Challenge 2025 🎉 Participate in our exciting mobile app development competition using Flutter! Showcase your skills, creativity, and technical abilities for a chance to win amazing prizes.",
    fullText: `
      ✅ Eligibility:
      - Participants must be between 10 and 18 years old
      - Participants can join individually or in teams (max 3 students per team)
      - All projects must be original work (no plagiarism)
      - Open-source libraries allowed with proper attribution
      
      📌 Competition Rules:
      - Submit a fully functional mobile app using Flutter
      - Submission must include:
        * Complete source code
        * Demo video of the application
        * Presentation for the judging panel
      - Online test on Flutter theoretical knowledge
      - 10-minute presentation time limit per participant/team
      
      🏆 Evaluation Criteria:
      - Code quality and organization (20%)
      - Creativity and originality (20%)
      - UI/UX design (20%)
      - Application stability (20%)
      - Presentation skills (20%)
      - Online test results
      
      🎁 Prizes:
      - 1st Place: Certificate + Cash Prize
      - 2nd Place: Certificate + Cash Prize
      - 3rd Place: Certificate + Cash Prize
      - All participants receive Certificate of Participation
      
      ✨ Competition Objectives:
      - Enhance Flutter programming skills
      - Encourage innovation and creativity
      - Promote teamwork and collaboration
      - Discover new talents in mobile development
    `
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="w-full max-w-7xl px-5 mx-auto">
        <div className="w-fullitems-start">

          <div className="w-full">
           
            
           
            <h3 className="mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
                   {rulesContent.title}
                </h3>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <p className="text-gray-700 text-base font-normal leading-relaxed mb-4">
                {rulesContent.summary}
              </p>
              
              {showFullText && (
                <div className="text-gray-700 text-base font-normal leading-relaxed space-y-4 mb-6">
                  {rulesContent.fullText.split('\n').map((line, index) => (
                    <p key={index}>{line.trim() || <br />}</p>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={toggleText}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 transition-all duration-300 ease-in-out rounded-lg text-white font-medium flex items-center justify-center"
                >
                  <span className="mr-2">{showFullText ? "↑" : "↓"}</span>
                  {showFullText ? "Show Less" : "Read Full Rules"}
                </button>
                
                <button className="px-5 py-2.5 border border-cyan-600 text-cyan-600 hover:bg-cyan-50 transition-all duration-300 ease-in-out rounded-lg font-medium flex items-center justify-center">
                  <span className="mr-2">📄</span>
                  Download Rulebook
                </button>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Rules;