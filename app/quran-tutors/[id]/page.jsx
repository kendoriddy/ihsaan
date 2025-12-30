"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useFetch } from "@/hooks/useHttp/useHttp";
import Loader from "@/components/Loader";

const defaultFemaleAvatar = "/assets/images/user3.webp";

export default function TutorProfilePage({ params }) {
  const router = useRouter();
  const tutorId = params?.id;

  // Fetch tutor from API
  const {
    isLoading,
    data: tutorData,
    error,
    isError,
  } = useFetch(
    ["quran-tutor", tutorId],
    tutorId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quran-tutors/${tutorId}/`
      : null,
    () => {}
  );

  // Transform API data to match component expectations
  const tutor = React.useMemo(() => {
    // The API response is nested in data.data (axios response wrapper)
    const apiTutor = tutorData?.data || tutorData;
    if (!apiTutor) return null;

    // Parse languages from comma-separated string to array
    const languages = apiTutor.languages
      ? apiTutor.languages.split(",").map((lang) => lang.trim())
      : [];

    // Map religion_sect enum to display format
    const sectMap = {
      SUNNI: "Sunni",
      SHIA: "Shia",
      SUFI: "Sufi",
      OTHER: "Others",
    };
    const sect = apiTutor.religion_sect
      ? sectMap[apiTutor.religion_sect] || apiTutor.religion_sect
      : "";

    return {
      id: apiTutor.id,
      profile_picture: apiTutor.profile_picture_url || "/assets/images/user1.webp",
      gender: apiTutor.gender || "",
      display_face: apiTutor.display_profile_pic !== false,
      first_name: apiTutor.first_name || "",
      middle_name: apiTutor.middle_name || "",
      last_name: apiTutor.last_name || "",
      country_of_origin: apiTutor.country_of_origin || "",
      country_of_residence: apiTutor.country_of_residence || "",
      ajzaa_memorized: apiTutor.ajzaa_memorized || 0,
      languages: languages,
      sect: sect,
      available: true,
      bio: apiTutor.tutor_summary || "No bio available.",
      hourly_rate: 0,
      currency: "credits",
      years_of_experience: apiTutor.years_of_experience || 0,
      tejweed_level: apiTutor.tejweed_level || "",
    };
  }, [tutorData]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  if (isError || !tutor) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            className="mb-6 text-primary underline"
            onClick={() => router.push("/quran-tutors")}
          >
            ← Back to Tutor List
          </button>
          <div className="bg-white rounded shadow p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Tutor Not Found
            </h2>
            <p className="text-gray-600">
              {error?.response?.data?.message ||
                error?.message ||
                "The tutor you're looking for doesn't exist or has been removed."}
            </p>
          </div>
        </div>
      </>
    );
  }

  const showAvatar = tutor.gender === "female" && tutor.display_face === false;
  const imageSrc = showAvatar ? defaultFemaleAvatar : tutor.profile_picture;
  const fullName = [tutor.first_name, tutor.middle_name, tutor.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          className="mb-6 text-primary underline"
          onClick={() => router.push("/quran-tutors")}
        >
          ← Back to Tutor List
        </button>
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded shadow p-6">
          <img
            src={imageSrc}
            alt={fullName}
            className="w-32 h-32 rounded-full object-cover border self-center md:self-start"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{fullName}</h1>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Gender:</span>{" "}
              {tutor.gender.charAt(0).toUpperCase() + tutor.gender.slice(1)}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Country of Origin:</span>{" "}
              {tutor.country_of_origin || "N/A"}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Country of Residence:</span>{" "}
              {tutor.country_of_residence || "N/A"}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Ajzaa Memorized:</span>{" "}
              {tutor.ajzaa_memorized || 0}
            </div>
            {tutor.tejweed_level && (
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Tejweed Level:</span>{" "}
                {tutor.tejweed_level.charAt(0) +
                  tutor.tejweed_level.slice(1).toLowerCase()}
              </div>
            )}
            {tutor.years_of_experience > 0 && (
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Years of Experience:</span>{" "}
                {tutor.years_of_experience}
              </div>
            )}
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Languages:</span>{" "}
              {tutor.languages.length > 0
                ? tutor.languages.join(", ")
                : "N/A"}
            </div>
            {tutor.sect && (
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Sect:</span> {tutor.sect}
              </div>
            )}
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Availability:</span>{" "}
              {tutor.available ? "Available" : "Not Available"}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Bio:</span>
              <div className="mt-1 whitespace-pre-line">{tutor.bio}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
