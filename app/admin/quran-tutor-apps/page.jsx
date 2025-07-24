"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Modal from "@/components/validation/Modal";
import clsx from "clsx";
import TutorApplicationModal from "./TutorApplicationModal";

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
        const token = localStorage.getItem("token");
        const params = [];
        if (statusFilter) params.push(`application_status=${statusFilter}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (page) params.push(`page=${page}`);
        const url = `https://ihsaanlms.onrender.com/api/quran-tutors/?${params.join(
          "&"
        )}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tutors");
        const data = await res.json();
        setTutors(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, [actionLoading, statusFilter, search, page]);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id + status);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ihsaanlms.onrender.com/api/quran-tutors/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quran_tutor_application_status: status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      alert(err.message || "Failed to update status");
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
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ihsaanlms.onrender.com/api/quran-tutors/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch application");
      const data = await res.json();
      setSelectedTutor(data.results?.[0] || data);
      setRejectionReason("");
    } catch (err) {
      setModalError(err.message || "Failed to load application");
    } finally {
      setModalLoading(false);
    }
  };

  // Approve/Reject
  const handleAdminStatus = async (status) => {
    if (!selectedTutorId) return;
    setModalLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ihsaanlms.onrender.com/api/admin/quran-tutors/${selectedTutorId}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quran_tutor_application_status: status,
            quran_tutor_rejection_reason:
              status === "REJECTED" ? rejectionReason : "",
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      setViewModalOpen(false);
      setActionLoading(selectedTutorId + status); // trigger refetch
    } catch (err) {
      setModalError(err.message || "Failed to update status");
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
          <div className="flex flex-wrap gap-4 mb-4">
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
                      <td className="border px-4 py-2">{tutor.full_name}</td>
                      <td className="border px-4 py-2">{tutor.email}</td>
                      <td className="border px-4 py-2">
                        {tutor.country_of_origin} / {tutor.country_of_residence}
                      </td>
                      <td className="border px-4 py-2">{tutor.gender}</td>
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
