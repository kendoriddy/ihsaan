"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import clsx from "clsx";
import TutorApplicationModal from "./TutorApplicationModal";
import http from "@/hooks/axios/axios";

export default function AdminQuranTutorAppsPage() {
  const currentRoute = usePathname();

  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  // Filters and pagination
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (statusFilter) {
          params.quran_tutor_application_status = statusFilter;
        }
        if (search) {
          params.search = search;
        }
        if (page) {
          params.page = page;
        }
        const response = await http.get("/list-quran-tutor-applications/", {
          params,
        });
        const data = response.data;
        setTutors(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(
          err.response?.data?.detail || err.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, [actionLoading, statusFilter, search, page]);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id + status);
    try {
      await http.patch(`/quran-tutors/${id}/`, {
        quran_tutor_application_status: status,
      });
    } catch (err) {
      alert(
        err.response?.data?.detail || err.message || "Failed to update status"
      );
    } finally {
      setActionLoading("");
    }
  };

  // Modal: fetch by id
  const openViewModal = async (id) => {
    setSelectedTutorId(id);
    setModalLoading(true);
    setModalError("");
    setViewModalOpen(true);
    try {
      const response = await http.get(`/admin/quran-tutors/${id}/`);
      const data = response.data;
      setSelectedTutor(data.results?.[0] || data);
      setRejectionReason("");
    } catch (err) {
      setModalError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load application"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Approve/Reject
  const handleAdminStatus = async (status) => {
    if (!selectedTutorId) return;
    setModalLoading(true);
    try {
      await http.patch(`/admin/quran-tutors/${selectedTutorId}/status/`, {
        quran_tutor_application_status: status,
        quran_tutor_rejection_reason:
          status === "REJECTED" ? rejectionReason : "",
      });
      setViewModalOpen(false);
      setActionLoading(selectedTutorId + status); // trigger refetch
    } catch (err) {
      setModalError(
        err.response?.data?.detail || err.message || "Failed to update status"
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Status badge
  const getStatusColor = (status) =>
    clsx("px-3 py-1 rounded-full font-semibold text-xs", {
      "bg-green-100 text-green-800 border border-green-200":
        status?.toUpperCase() === "ACCEPTED",
      "bg-yellow-100 text-yellow-800 border border-yellow-200":
        status?.toUpperCase() === "PENDING",
      "bg-red-100 text-red-800 border border-red-200":
        status?.toUpperCase() === "REJECTED",
      "bg-gray-100 text-gray-800 border border-gray-200": ![
        "ACCEPTED",
        "PENDING",
        "REJECTED",
      ].includes(status?.toUpperCase()),
    });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  return (
    <>
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      <main className=" py-2 flex">
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          <h1 className="text-2xl font-bold mb-6">Qur'an Tutor Applications</h1>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <input
              type="text"
              placeholder="Search by name or email"
              className="border px-3 py-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border px-3 py-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {(search || statusFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border bg-white rounded shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Country</th>
                    <th className="px-4 py-2 border">Gender</th>
                    <th className="px-4 py-2 border">Ajzaa</th>
                    <th className="px-4 py-2 border">Tejweed</th>
                    <th className="px-4 py-2 border">Sect</th>
                    <th className="px-4 py-2 border">Yrs Exp</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map((tutor) => (
                    <tr key={tutor.id} className="even:bg-gray-50">
                      <td className="border px-4 py-2">
                        {[tutor.first_name, tutor.middle_name, tutor.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </td>
                      <td className="border px-4 py-2">{tutor.email}</td>
                      <td className="border px-4 py-2">
                        {tutor.country_of_origin} / {tutor.country_of_residence}
                      </td>
                      <td className="border px-4 py-2 capitalize">
                        {tutor.gender}
                      </td>
                      <td className="border px-4 py-2">
                        {tutor.ajzaa_memorized}
                      </td>
                      <td className="border px-4 py-2">
                        {tutor.tejweed_level}
                      </td>
                      <td className="border px-4 py-2">
                        {tutor.religion_sect}
                      </td>
                      <td className="border px-4 py-2">
                        {tutor.years_of_experience}
                      </td>
                      <td className="border px-4 py-2 font-semibold">
                        <span
                          className={getStatusColor(
                            tutor.quran_tutor_application_status
                          )}
                        >
                          {tutor.quran_tutor_application_status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => openViewModal(tutor.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <span className="px-3 py-1">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      {/* View/Edit Modal */}
      <TutorApplicationModal
        isOpen={viewModalOpen}
        handleClose={() => setViewModalOpen(false)}
        modalLoading={modalLoading}
        modalError={modalError}
        selectedTutor={selectedTutor}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleAdminStatus={handleAdminStatus}
        getStatusColor={getStatusColor}
      />
    </>
  );
}
