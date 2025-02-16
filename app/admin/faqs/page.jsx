"use client";
import { useState, useRef } from "react";
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
  const {
    isLoading,
    data: FaqsList,
    isFetching,
    refetch,
  } = useFetch("faqs", `/faqs`);
  const Faqs = FaqsList && FaqsList?.data;
  const [FaqMode, setFaqMode] = useState("create");
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setFaqMode("");
    setOpen(false);
    setToEditFaq(null);
  };
  const FaqInitialValues = {
    title: toEditFaq?.title || "",
    content: toEditFaq?.content || "",
  };
  const { mutate: createNewFaq, isLoading: isCreatingFaq } = usePost(
    "/faqs/create",
    {
      onSuccess: (response) => {
        toast.success("Faq created successfully");
        queryClient.invalidateQueries("faqs");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const { mutate: updateFaq, isLoading: isUpdatingFaq } = usePut("/faqs", {
    onSuccess: (response) => {
      const { data } = response;
      toast.success("Faq updated successfully");
      queryClient.invalidateQueries("faqs");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const { mutate: FaqDelete, isLoading: isDeletingFaq } = useDelete("/faqs", {
    onSuccess: (data) => {
      toast.success("deleted successfully");
      queryClient.invalidateQueries("faqs");
      setDeleteFaq(false);
      setDeletingFaq(null);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const handleSubmit = (values) => {
    const { content, title } = values;
    const payload = {
      title: title,
      content: content,
    };
    if (FaqMode === "create") {
      createNewFaq(payload);
    } else {
      updateFaq({ id: toEditFaq?.id, data: payload });
    }
  };
  const handleDeleteFaq = (id) => {
    FaqDelete(id);
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
          className=" lg:ml-[250px] w-screen px-2"
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
              <div className="text-lg font-bold"></div>
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

            <div className="py-4 font-bold text-lg">FAQS</div>

            {/* Space */}
            <div className="py-4"></div>

            {/* Faq  */}
            <section className="rounded border px-4 py-4 overflow-x-scroll">
              {isLoading ? (
                <Loader />
              ) : (
                <table className="table-auto w-full rounded bg-gray-50 ">
                  <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                    <tr className="border text-red-600">
                      <th className=" border px-4 py-2">Question</th>
                      <th className=" border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Faqs?.length > 0 ? (
                      Faqs?.map((Faq) => (
                        <tr className="even:bg-gray-100" key={Faq?.id}>
                          <td className="border px-4 py-2">{Faq?.title}</td>
                          <td className="border px-4 py-2">{Faq?.content}</td>
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
                          No data to show at the moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </section>
            {/* ADD,UPDATE Faq */}
            <Modal
              isOpen={open}
              handleClose={handleClose}
              title={FaqMode === "create" ? "New Faq" : "Update Faq"}
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
                        <FormikControl name="title" placeholder="FAQ Title" />
                      </div>
                      <div>
                        <FormikControl
                          name="content"
                          multiline
                          minRows={4}
                          placeholder="Faq content"
                        />
                      </div>

                      <div className="w-full flex justify-center">
                        <AuthButton
                          isLoading={isCreatingFaq || isUpdatingFaq}
                          text={FaqMode === "create" ? "submit" : "update"}
                        />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Modal>
            <Modal
              isOpen={deleteFaq}
              handleClose={() => {
                setDeleteFaq(false);
                setDeletingFaq(null);
              }}
              title={"Delete Faq"}
            >
              <div>
                <p>Are you sure you want to delete Faq </p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => handleDeleteFaq(deletingFaq?.id)}
                  variant="contained"
                  sx={{
                    textTransform: "initial",
                    backgroundColor: "darkred !important",
                    color: "white !important",
                  }}
                >
                  {isDeletingFaq ? "deleting" : "confirm"}
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
