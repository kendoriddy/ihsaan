"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, FilterList } from "@mui/icons-material";
import QuranTutorFilters from "@/components/QuranTutorFilters";
import QuranTutorCard from "@/components/QuranTutorCard";
import Header from "@/components/Header";
import { useFetch } from "@/hooks/useHttp/useHttp";
import Loader from "@/components/Loader";

export default function QuranTutorsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Build query parameters from filters and search
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    // Add search
    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }

    // Add filters
    if (filters.gender) {
      params.append("gender", filters.gender);
    }
    if (filters.country_of_origin) {
      params.append("country_of_origin", filters.country_of_origin);
    }
    if (filters.country_of_residence) {
      params.append("country_of_residence", filters.country_of_residence);
    }
    if (filters.language) {
      params.append("languages", filters.language);
    }
    if (filters.sect) {
      // Map filter sect values to API enum values
      const sectMap = {
        Sunni: "SUNNI",
        Shia: "SHIA",
        Sufi: "SUFI",
        Others: "OTHER",
      };
      params.append("religion_sect", sectMap[filters.sect] || filters.sect);
    }
    if (filters.ajzaa_memorized) {
      params.append("ajzaa_memorized_min", filters.ajzaa_memorized);
    }
    // Only show accepted tutors (approved tutors)
    params.append("application_status", "ACCEPTED");

    return params.toString();
  }, [debouncedSearch, filters]);

  // Fetch tutors from API
  const {
    isLoading,
    data: tutorsData,
    error,
    isError,
  } = useFetch(
    ["quran-tutors", queryParams],
    queryParams
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quran-tutors/?${queryParams}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quran-tutors/?application_status=ACCEPTED`,
    () => {}
  );

  // Transform API data to match component expectations
  const tutors = useMemo(() => {
    // The API response is nested in data.data (axios response wrapper)
    const apiResponse = tutorsData?.data || tutorsData;
    if (!apiResponse?.results) return [];

    return apiResponse.results.map((tutor) => {
      // Parse languages from comma-separated string to array
      const languages = tutor.languages
        ? tutor.languages.split(",").map((lang) => lang.trim())
        : [];

      // Map religion_sect enum to display format
      const sectMap = {
        SUNNI: "Sunni",
        SHIA: "Shia",
        SUFI: "Sufi",
        OTHER: "Others",
      };
      const sect = tutor.religion_sect
        ? sectMap[tutor.religion_sect] || tutor.religion_sect
        : "";

      return {
        id: tutor.id,
        profile_picture:
          tutor.profile_picture_url || "/assets/images/user1.webp",
        gender: tutor.gender || "",
        display_face: tutor.display_profile_pic !== false,
        first_name: tutor.first_name || "",
        middle_name: tutor.middle_name || "",
        last_name: tutor.last_name || "",
        country_of_origin: tutor.country_of_origin || "",
        country_of_residence: tutor.country_of_residence || "",
        ajzaa_memorized: tutor.ajzaa_memorized || 0,
        languages: languages,
        sect: sect,
        available: true, // Default to true, API doesn't provide this field
        bio: tutor.tutor_summary || "",
        hourly_rate: 0, // API doesn't provide this field
        currency: "credits", // Default currency
        years_of_experience: tutor.years_of_experience || null,
        tejweed_level: tutor.tejweed_level || "",
        is_verified: tutor.is_verified || false,
      };
    });
  }, [tutorsData]);

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

                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{tutors.length}</span>{" "}
                    tutors
                    {(() => {
                      const apiResponse = tutorsData?.data || tutorsData;
                      return apiResponse?.total !== undefined ? (
                        <span className="text-gray-500">
                          {" "}
                          of {apiResponse.total} total
                        </span>
                      ) : null;
                    })()}
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

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader />
                </div>
              )}

              {/* Error State */}
              {isError && !isLoading && (
                <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-12 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading tutors
                  </h3>
                  <p className="text-gray-500">
                    {error?.response?.data?.message ||
                      error?.message ||
                      "Failed to load tutors. Please try again later."}
                  </p>
                </div>
              )}

              {/* Tutors Grid */}
              {!isLoading && !isError && (
                <div className="space-y-6">
                  {tutors.length === 0 ? (
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
                    tutors.map((tutor) => (
                      <QuranTutorCard key={tutor.id} tutor={tutor} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
