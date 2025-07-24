"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const mockTutor = {
  id: 1,
  profile_picture: "/assets/images/user1.webp",
  gender: "male",
  display_face: true,
  first_name: "Abu (Abdir Rahman)",
  middle_name: "",
  last_name: "Riyadh",
  date_of_birth: "1985-01-01",
  country_of_origin: "Nigeria",
  country_of_residence: "Nigeria",
  ajzaa_memorized: 8,
  languages: ["Arabic", "English"],
  sect: "Sunni",
  available: true,
  bio: "As Salaam Alaykum. This is Abu AbdirRahman, a good speaker of English and Arabic language. I teach adults and kids. I can teach you the recitation of the Qur'an from scratch, assist you with your memorization of the Qur'an, perfect your recitation...",
  hourly_rate: 8.4,
  currency: "credits",
  additional_notes:
    "I am passionate about teaching and helping students achieve their Quranic goals.",
};

const defaultFemaleAvatar = "/assets/images/user3.webp";

export default function TutorProfilePage({ params }) {
  // In real app, fetch tutor by params.id
  const tutor = mockTutor;
  const router = useRouter();
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
              <span className="font-semibold">Date of Birth:</span>{" "}
              {tutor.date_of_birth}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Country of Origin:</span>{" "}
              {tutor.country_of_origin}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Country of Residence:</span>{" "}
              {tutor.country_of_residence}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Ajzaa Memorized:</span>{" "}
              {tutor.ajzaa_memorized}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Languages:</span>{" "}
              {tutor.languages.join(", ")}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Sect:</span> {tutor.sect}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Availability:</span>{" "}
              {tutor.available ? "Available" : "Not Available"}
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Hourly Rate:</span>{" "}
              {tutor.hourly_rate} {tutor.currency}/hr
            </div>
            <div className="mb-2 text-gray-700">
              <span className="font-semibold">Bio:</span>
              <div className="mt-1 whitespace-pre-line">{tutor.bio}</div>
            </div>
            {tutor.additional_notes && (
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Additional Notes:</span>
                <div className="mt-1 whitespace-pre-line">
                  {tutor.additional_notes}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
