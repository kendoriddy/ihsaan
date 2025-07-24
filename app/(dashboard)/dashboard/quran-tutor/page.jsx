"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import QuranTutorApplicationModal from "@/components/QuranTutorApplicationModal";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePathname } from "next/navigation";
import {
  School,
  Person,
  Phone,
  Public,
  Language,
  MenuBook,
  AccountBalance,
  Schedule,
  Edit,
  CheckCircle,
  Pending,
  Cancel,
  Star,
  Verified,
  Assignment,
} from "@mui/icons-material";

export default function QuranTutorDashboardPage() {
  const currentRoute = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [isTutor, setIsTutor] = useState(false);
  const [isQuranTutor, setIsQuranTutor] = useState(false); // TODO: Replace with real check
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const roles = JSON.parse(localStorage.getItem("roles")) || [];
      setIsTutor(roles.includes("TUTOR"));
      setIsQuranTutor(roles.includes("QURAN_TUTOR"));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Pending className="w-4 h-4" />;
      case "REJECTED":
        return <Cancel className="w-4 h-4" />;
      default:
        return <Pending className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    async function fetchApp() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://ihsaanlms.onrender.com/api/my-quran-tutor-application/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setApplication(data);
        } else {
          setApplication(null);
        }
      } catch {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    }
    fetchApp();
  }, [showModal]);

  return (
    <>
      <Header />
      <main className=" py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />
        <div className="px-4  w-full py-8 lg:py-0">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <School className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Qur'an Tutor Application
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join our community of dedicated Qur'an educators and help students
              around the world deepen their understanding of the Holy Qur'an.
            </p>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Loading your application...
                </p>
              </div>
            </div>
          ) : application ? (
            /* Existing Application */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden m-auto w-[90%]">
              {/* Application Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Assignment className="w-6 h-6 text-red-800" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Your Application
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Submitted for review
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                      application.status || "PENDING"
                    )}`}
                  >
                    {getStatusIcon(application.status || "PENDING")}
                    {application.status || "PENDING"}
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="p-6">
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Person className="w-5 h-5 text-red-800" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">
                        Full Name
                      </div>
                      <div className="font-medium text-gray-800">
                        {application.first_name} {application.last_name}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Phone Number
                      </div>
                      <div className="font-medium text-gray-800">
                        {application.phone_number}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">Gender</div>
                      <div className="font-medium text-gray-800 capitalize">
                        {application.gender}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Public className="w-5 h-5 text-red-800" />
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-sm text-blue-600 mb-1">
                        Country of Origin
                      </div>
                      <div className="font-medium text-blue-800">
                        {application.country_of_origin}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-sm text-purple-600 mb-1">
                        Country of Residence
                      </div>
                      <div className="font-medium text-purple-800">
                        {application.country_of_residence}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-red-800" />
                    Qualifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <MenuBook className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm text-green-600 mb-1">
                        Ajzaa Memorized
                      </div>
                      <div className="text-xl font-bold text-green-800">
                        {application.ajzaa_memorized}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <Verified className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-sm text-orange-600 mb-1">
                        Tajweed Level
                      </div>
                      <div className="font-medium text-orange-800">
                        {application.tejweed_level}
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-4 text-center">
                      <AccountBalance className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <div className="text-sm text-indigo-600 mb-1">
                        Religion Sect
                      </div>
                      <div className="font-medium text-indigo-800">
                        {application.religion_sect}
                      </div>
                    </div>
                    <div className="bg-teal-50 rounded-xl p-4 text-center">
                      <Schedule className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                      <div className="text-sm text-teal-600 mb-1">
                        Experience
                      </div>
                      <div className="font-medium text-teal-800">
                        {application.years_of_experience} years
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Language className="w-5 h-5 text-red-800" />
                    Languages
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {application.languages?.split(",").map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                        >
                          {lang.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Summary
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {application.tutor_summary}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    className="bg-red-800 hover:bg-red-900 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    onClick={() => setShowModal(true)}
                  >
                    <Edit className="w-5 h-5" />
                    Edit Application
                  </button>
                </div>
              </div>
            </div>
          ) : isTutor && !isQuranTutor ? (
            /* Apply Button */
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <School className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Share Your Knowledge?
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Join our community of dedicated Qur'an tutors and help
                  students worldwide in their spiritual journey.
                </p>
                <button
                  className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 mx-auto"
                  onClick={() => setShowModal(true)}
                >
                  <Assignment className="w-6 h-6" />
                  Apply to become a Qur'an Tutor
                </button>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Share Your Knowledge
                  </h3>
                  <p className="text-sm text-gray-600">
                    Help students learn and memorize the Holy Qur'an with proper
                    Tajweed
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Schedule className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Flexible Schedule
                  </h3>
                  <p className="text-sm text-gray-600">
                    Teach at your own pace and set your own availability hours
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Public className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Global Impact
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connect with students from around the world and make a
                    difference
                  </p>
                </div>
              </div>
            </div>
          ) : isQuranTutor ? (
            /* Already a Tutor */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome, Qur'an Tutor!
              </h2>
              <p className="text-gray-600 mb-6">
                You are already an approved Qur'an Tutor. Continue making a
                positive impact in students' lives.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-xl font-medium">
                <Verified className="w-5 h-5" />
                Verified Tutor
              </div>
            </div>
          ) : (
            /* Not Eligible */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Cancel className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tutor Access Required
              </h2>
              <p className="text-gray-600 mb-6">
                Only registered tutors can apply to become a Qur'an Tutor.
                Please ensure you have tutor privileges first.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 rounded-xl font-medium">
                <Person className="w-5 h-5" />
                Tutor Registration Required
              </div>
            </div>
          )}

          {/* Additional Info */}
          {/* <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help with your application?{" "}
              <a
                href="#"
                className="text-red-800 hover:text-red-900 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div> */}
        </div>
      </main>
      {/* Render the modal outside of conditional rendering so it always mounts */}
      <QuranTutorApplicationModal
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
}
