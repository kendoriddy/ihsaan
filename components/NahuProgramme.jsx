import React from "react";

const NahuProgramme = ({ setOpen }) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-0">
        {/* Header with decorative Islamic pattern */}
        <div className="bg-primary text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Welcome to Nahu Programme</h2>
        </div>

        {/* Decorative divider */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary to-primary"></div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6 text-primary font-arabic text-xl">
            بسم الله الرحمن الرحيم
          </div>

          <h3 className="text-2xl font-semibold text-primary mb-4">
            Illuminating Minds Through Classical Arabic Grammar
          </h3>

          <div className="space-y-4 text-gray-700">
            <p>
              The Nahu Programme invites sincere seekers of knowledge to embark
              on a transformative journey through the beautiful intricacies of
              Arabic grammar - the key to unlocking the treasures of the Quran
              and Hadith.
            </p>

            <p>
              Guided by qualified scholars with traditional ijazah chains of
              knowledge, our comprehensive curriculum follows the time-tested
              methods that have preserved Islamic scholarship for centuries.
            </p>

            <div className="my-6 bg-primary p-4 rounded-lg border border-primary">
              <h4 className="font-semibold text-white mb-2">
                Programme Highlights:
              </h4>
              <ul className="text-left space-y-2">
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Master the fundamentals of Arabic grammar (Nahw) essential
                    for Quranic understanding
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Study classical texts with proper understanding and context
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Join a supportive community of dedicated students of
                    knowledge
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-white">
                    Weekly live sessions with opportunities for questions and
                    discussion
                  </span>
                </li>
              </ul>
            </div>

            <p className="italic">
              "Whoever travels a path in search of knowledge, Allah makes easy
              for them a path to Paradise." - Hadith, Sahih Muslim
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="bg-primary hover:bg-primary text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Register Now
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Classes begin the first week of Muharam. Limited spaces available.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NahuProgramme;
