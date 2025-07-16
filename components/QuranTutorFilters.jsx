"use client";

import {
  Person,
  Public,
  Home,
  Language,
  Schedule,
  AccountBalance,
  MenuBook,
} from "@mui/icons-material";

export default function QuranTutorFilters({ filters, setFilters }) {
  const filterOptions = [
    {
      key: "gender",
      label: "Gender",
      icon: <Person className="w-5 h-5 text-emerald-600" />,
      type: "select",
      options: [
        { value: "", label: "Any Gender" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    {
      key: "country_of_origin",
      label: "Country of Origin",
      icon: <Public className="w-5 h-5 text-blue-600" />,
      type: "input",
      placeholder: "e.g., Nigeria, Pakistan",
    },
    {
      key: "country_of_residence",
      label: "Country of Residence",
      icon: <Home className="w-5 h-5 text-purple-600" />,
      type: "input",
      placeholder: "e.g., USA, UK",
    },
    {
      key: "language",
      label: "Languages",
      icon: <Language className="w-5 h-5 text-orange-600" />,
      type: "input",
      placeholder: "e.g., Arabic, English",
    },
    {
      key: "available",
      label: "Availability",
      icon: <Schedule className="w-5 h-5 text-green-600" />,
      type: "select",
      options: [
        { value: "", label: "Any Availability" },
        { value: "true", label: "Available Now" },
        { value: "false", label: "Not Available" },
      ],
    },
    {
      key: "sect",
      label: "Islamic Sect",
      icon: <AccountBalance className="w-5 h-5 text-indigo-600" />,
      type: "select",
      options: [
        { value: "", label: "Any Sect" },
        { value: "Sunni", label: "Sunni" },
        { value: "Shia", label: "Shia" },
        { value: "Sufi", label: "Sufi" },
        { value: "Ahmadiyya", label: "Ahmadiyya" },
        { value: "Others", label: "Others" },
      ],
    },
    {
      key: "ajaza_memorized",
      label: "Ajaza Memorized",
      icon: <MenuBook className="w-5 h-5 text-teal-600" />,
      type: "number",
      placeholder: "1-30",
      min: 1,
      max: 30,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Person className="w-5 h-5 text-red-800" />
            </div>
            Filter Tutors
          </h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-800 hover:text-red-900 font-medium transition-colors"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 space-y-6">
        {filterOptions.map((option) => (
          <div key={option.key} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              {option.icon}
              {option.label}
            </label>

            {option.type === "select" ? (
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 bg-white text-gray-700 hover:border-gray-300"
                value={filters[option.key] || ""}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
              >
                {option.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={option.type}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-300"
                placeholder={option.placeholder}
                value={filters[option.key] || ""}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
                min={option.min}
                max={option.max}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
