import { CheckCircle, PeopleAlt, VerifiedUser } from "@mui/icons-material";
import React from "react";

const NewsletterStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Total Subscribers
            </h3>
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
          </div>
          <div className="bg-blue-200 text-blue-700 p-3 rounded-full">
            <PeopleAlt className="text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-green-700">{stats.active}</p>
          </div>
          <div className="bg-green-200 text-green-700 p-3 rounded-full">
            <CheckCircle className="text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Verified
            </h3>
            <p className="text-3xl font-bold text-purple-700">
              {stats.verified}
            </p>
          </div>
          <div className="bg-purple-200 text-purple-700 p-3 rounded-full">
            <VerifiedUser className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterStats;
