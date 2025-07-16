"use client";

import { useState } from "react";
import { Search, FilterList } from "@mui/icons-material";
import QuranTutorFilters from "@/components/QuranTutorFilters";
import QuranTutorCard from "@/components/QuranTutorCard";
import Header from "@/components/Header";

// Mock data for tutors
const mockTutors = [
  {
    id: 1,
    profile_picture: "/assets/images/user1.webp",
    gender: "male",
    display_face: true,
    first_name: "Abu (Abdir Rahman)",
    middle_name: "",
    last_name: "Riyadh",
    country_of_origin: "Nigeria",
    country_of_residence: "Nigeria",
    ajaza_memorized: 8,
    languages: ["Arabic", "English"],
    sect: "Sunni",
    available: true,
    bio: "As Salaam Alaykum. This is Abu AbdirRahman, a good speaker of English and Arabic language. I teach adults and kids. I can teach you the recitation of the Qur'an from scratch, assist you with your memorization of the Qur'an, perfect your recitation...",
    hourly_rate: 20000,
    currency: "naira",
  },
  {
    id: 2,
    profile_picture: "/assets/images/user2.webp",
    gender: "male",
    display_face: true,
    first_name: "Muhammad",
    middle_name: "",
    last_name: "Sufyan",
    country_of_origin: "Pakistan",
    country_of_residence: "Pakistan",
    ajaza_memorized: 5,
    languages: ["English", "Urdu", "Hindi"],
    sect: "Sunni",
    available: false,
    bio: "Assalamu alaikum. If the heart is hardened, the soul is weakened, and the stimuli of desires and worldly affairs fall into it, then we need to reform the soul, soften the heart and strengthen the relationship with Allah. Reading the Quran and understanding it...",
    hourly_rate: 50000,
    currency: "naira",
  },
];

export default function QuranTutorsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredTutors = mockTutors.filter((tutor) => {
    // Search logic
    const searchLower = search.toLowerCase();
    const matchesSearch =
      tutor.first_name.toLowerCase().includes(searchLower) ||
      tutor.last_name.toLowerCase().includes(searchLower) ||
      (tutor.middle_name &&
        tutor.middle_name.toLowerCase().includes(searchLower)) ||
      tutor.country_of_origin.toLowerCase().includes(searchLower) ||
      tutor.country_of_residence.toLowerCase().includes(searchLower) ||
      tutor.languages.some((lang) => lang.toLowerCase().includes(searchLower));

    // Apply filters
    if (filters.gender && tutor.gender !== filters.gender) return false;
    if (
      filters.country_of_origin &&
      !tutor.country_of_origin
        .toLowerCase()
        .includes(filters.country_of_origin.toLowerCase())
    )
      return false;
    if (
      filters.country_of_residence &&
      !tutor.country_of_residence
        .toLowerCase()
        .includes(filters.country_of_residence.toLowerCase())
    )
      return false;
    if (
      filters.language &&
      !tutor.languages.some((lang) =>
        lang.toLowerCase().includes(filters.language.toLowerCase())
      )
    )
      return false;
    if (filters.available && String(tutor.available) !== filters.available)
      return false;
    if (filters.sect && tutor.sect !== filters.sect) return false;
    if (
      filters.ajaza_memorized &&
      String(tutor.ajaza_memorized) !== String(filters.ajaza_memorized)
    )
      return false;

    return matchesSearch;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Qur'an Tutors
            </h1>
            <p className="text-gray-600">
              Find the perfect tutor to guide your Qur'an learning journey
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <QuranTutorFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Controls */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, language, or country..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-red-700 focus:border-red-700 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <FilterList className="w-5 h-5" />
                    Filters
                  </button>

                  {/* Sort */}
                  <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-red-700 focus:border-red-700 transition-all duration-200 bg-white text-gray-700">
                    <option>Sort by Rate</option>
                    <option>Sort by Rating</option>
                    <option>Sort by Experience</option>
                  </select>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">{filteredTutors.length}</span>{" "}
                    tutors
                  </p>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6">
                  <QuranTutorFilters
                    filters={filters}
                    setFilters={setFilters}
                  />
                </div>
              )}

              {/* Tutors Grid */}
              <div className="space-y-6">
                {filteredTutors.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tutors found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                ) : (
                  filteredTutors.map((tutor) => (
                    <QuranTutorCard key={tutor.id} tutor={tutor} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
