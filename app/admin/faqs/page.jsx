"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Modal from "@/components/validation/Modal";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import { useEffect } from "react";
import FormikControl from "@/components/validation/FormikControl";
import { Form, Formik } from "formik";
import { useFetch, usePost, usePut, useDelete } from "@/hooks/useHttp/useHttp";
import Loader from "@/components/Loader";
import AuthButton from "@/components/AuthButton";
import { faqSchema } from "@/components/validationSchemas/ValidationSchema";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function Page() {
  const queryClient = useQueryClient();
  const currentRoute = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [deleteFaq, setDeleteFaq] = useState(false);
  const [toEditFaq, setToEditFaq] = useState(null);
  const [deletingFaq, setDeletingFaq] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Extract base domain from API_BASE_URL (remove /api part for FAQ endpoints)
  const getFaqBaseUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return apiUrl.replace("/api", "");
  };

  const {
    isLoading,
    data: FaqsList,
    refetch,
  } = useFetch("faqs", `${getFaqBaseUrl()}/faqs/faq/`);

  const Faqs = FaqsList && FaqsList?.data?.results;

  const [FaqMode, setFaqMode] = useState("create");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setFaqMode("");
    setOpen(false);
    setToEditFaq(null);
  };

  const FaqInitialValues = {
    question: toEditFaq?.question || "",
    answer: toEditFaq?.answer || "",
  };

  const { mutate: createNewFaq, isLoading: isCreatingFaq } = usePost(
    `${getFaqBaseUrl()}/faqs/faq/`,
    {
      onSuccess: (response) => {
        toast.success("FAQ created successfully");
        queryClient.invalidateQueries("faqs");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create FAQ");
      },
    }
  );

  const [isUpdatingFaq, setIsUpdatingFaq] = useState(false);

  // Custom update function to handle trailing slash requirement
  const handleUpdateFaq = async (id, data) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsUpdatingFaq(true);
      await axios.patch(`${getFaqBaseUrl()}/faqs/faq/${id}/`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries("faqs");
      handleClose();
      setIsUpdatingFaq(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update FAQ");
    } finally {
      setIsUpdatingFaq(false);
    }
  };

  const { mutate: FaqDelete, isLoading: isDeletingFaq } = useDelete(
    `${getFaqBaseUrl()}/faqs/faq`,
    {
      onSuccess: (data) => {
        toast.success("FAQ deleted successfully");
        queryClient.invalidateQueries("faqs");
        setDeleteFaq(false);
        setDeletingFaq(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete FAQ");
      },
    }
  );

  // Custom delete function to handle trailing slash requirement
  const handleDeleteFaq = async (id) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.delete(`${getFaqBaseUrl()}/faqs/faq/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("FAQ deleted successfully");
      queryClient.invalidateQueries("faqs");
      setDeleteFaq(false);
      setDeletingFaq(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete FAQ");
    }
  };

  const handleSubmit = (values) => {
    const { question, answer } = values;
    const payload = {
      question: question,
      answer: answer,
    };

    if (FaqMode === "create") {
      createNewFaq(payload);
    } else {
      handleUpdateFaq(toEditFaq?.id, payload);
    }
  };

  useEffect(() => {
    refetch();
  }, [open, deleteFaq]);

  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />
        {/* Main Body */}
        <section
          className="lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          {/* Content goes here */}
          <div className="p-4">
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">FAQ Management</div>
              <div
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setFaqMode("create");
                  setOpen(true);
                }}
              >
                Add FAQ
              </div>
            </div>

            {/* Space */}
            <div className="py-4"></div>

            {/* FAQ Table */}
            <section className="rounded border px-4 py-4 overflow-x-scroll">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <table className="table-auto w-full rounded bg-gray-50">
                    <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                      <tr className="border text-red-600">
                        <th className="border px-4 py-2">Question</th>
                        <th className="border px-4 py-2">Answer</th>
                        <th className="border px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Faqs?.length > 0 ? (
                        Faqs?.map((Faq) => (
                          <tr className="even:bg-gray-100" key={Faq?.id}>
                            <td className="border px-4 py-2">
                              {Faq?.question}
                            </td>
                            <td className="border px-4 py-2 max-w-xs truncate">
                              {Faq?.answer}
                            </td>
                            <td className="border pl-4 py-2 w-[170px]">
                              <span
                                className="px-2 py-1 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
                                onClick={() => {
                                  setToEditFaq(Faq);
                                  setFaqMode("edit");
                                  setOpen(true);
                                }}
                              >
                                Edit
                              </span>
                              <span
                                className="px-2 py-1 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700 ml-1"
                                onClick={() => {
                                  setDeletingFaq(Faq);
                                  setDeleteFaq(true);
                                }}
                              >
                                Delete
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="border px-4 py-2 text-center"
                          >
                            No FAQs to show at the moment
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </section>

            {/* Add/Update FAQ Modal */}
            <Modal
              isOpen={open}
              handleClose={handleClose}
              title={FaqMode === "create" ? "New FAQ" : "Update FAQ"}
            >
              <div className="my-2 flex flex-col gap-2">
                <Formik
                  initialValues={FaqInitialValues}
                  validationSchema={faqSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className="flex flex-col gap-2">
                      <div>
                        <FormikControl
                          name="question"
                          placeholder="FAQ Question"
                        />
                      </div>
                      <div>
                        <FormikControl
                          name="answer"
                          multiline
                          minRows={4}
                          placeholder="FAQ Answer"
                        />
                      </div>

                      <div className="w-full flex justify-center">
                        <AuthButton
                          isLoading={isCreatingFaq || isUpdatingFaq}
                          text={FaqMode === "create" ? "Submit" : "Update"}
                        />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
              isOpen={deleteFaq}
              handleClose={() => {
                setDeleteFaq(false);
                setDeletingFaq(null);
              }}
              title="Delete FAQ"
            >
              <div>
                <p>Are you sure you want to delete this FAQ?</p>
                <p className="font-semibold mt-2">{deletingFaq?.question}</p>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => handleDeleteFaq(deletingFaq?.id)}
                  variant="contained"
                  sx={{
                    textTransform: "initial",
                    backgroundColor: "darkred !important",
                    color: "white !important",
                  }}
                >
                  {isDeletingFaq ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </Modal>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
