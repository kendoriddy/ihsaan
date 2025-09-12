import Loader from "@/components/Loader";
import React from "react";

const AuditDashboard = ({ dashboardIndicators, isLoading, isFetching }) => {
  const getCardColors = (color) => {
    const colors = {
      red: "from-red-50 to-red-100 border-red-200",
      blue: "from-blue-50 to-blue-100 border-blue-200",
      green: "from-green-50 to-green-100 border-green-200",
      purple: "from-purple-50 to-purple-100 border-purple-200",
    };
    return colors[color] || colors.blue;
  };

  const getIconColors = (color) => {
    const colors = {
      red: "bg-red-200 text-red-700",
      blue: "bg-blue-200 text-blue-700",
      green: "bg-green-200 text-green-700",
      purple: "bg-purple-200 text-purple-700",
    };
    return colors[color] || colors.blue;
  };

  const getValueColors = (color) => {
    const colors = {
      red: "text-red-700",
      blue: "text-blue-700",
      green: "text-green-700",
      purple: "text-purple-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-red-900 to-blue-600 bg-clip-text text-transparent mb-8">
        System Performance Indicators
      </h2>
      {isFetching || isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={20} />
          <p className="animate-pulse">Fetching activity and errors logs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardIndicators.map((indicator, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${getCardColors(
                indicator.color
              )} border rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`${getIconColors(
                    indicator.color
                  )} p-3 rounded-full mr-4`}
                >
                  {indicator.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {indicator.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {indicator.trend}
                  </span>
                </div>
              </div>
              <div
                className={`text-4xl font-bold ${getValueColors(
                  indicator.color
                )}`}
              >
                {indicator.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditDashboard;
