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
import { quoteSchema } from "@/components/validationSchemas/ValidationSchema";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
function Page() {
  const queryClient = useQueryClient();
  const currentRoute = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [deleteQuote, setDeleteQuote] = useState(false);
  const [toEditQuote, setToEditQuote] = useState(null);
  const [deletingQuote, setDeletingQuote] = useState(null);
  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const {
    isLoading,
    data: quotesList,
    isFetching,
    refetch,
  } = useFetch("quotes", `/quotes/all`);
  const quotes = quotesList && quotesList?.data;
  const [quoteMode, setQuoteMode] = useState("create");
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setQuoteMode("");
    setOpen(false);
    setToEditQuote(null);
  };
  const quoteInitialValues = {
    quote_author: toEditQuote?.quote_author || "",
    content: toEditQuote?.content || "",
  };
  const { mutate: createNewQuote, isLoading: isCreatingQuote } = usePost(
    "/quotes/create",
    {
      onSuccess: (response) => {
        toast.success("quote created successfully");
        queryClient.invalidateQueries("quotes");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const { mutate: updateQuote, isLoading: isUpdatingQuote } = usePut(
    "/quotes",
    {
      onSuccess: (response) => {
        const { data } = response;
        toast.success("quote updated successfully");
        queryClient.invalidateQueries("quotes");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const { mutate: quoteDelete, isLoading: isDeletingQuote } = useDelete(
    "/quotes",
    {
      onSuccess: (data) => {
        toast.success("deleted successfully");
        queryClient.invalidateQueries("quotes");
        setDeleteQuote(false);
        setDeletingQuote(null);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const handleSubmit = (values) => {
    const { content, quote_author } = values;
    const payload = {
      quote_author: quote_author,
      content: content,
    };
    if (quoteMode === "create") {
      createNewQuote(payload);
    } else {
      updateQuote({ id: toEditQuote?.id, data: payload });
    }
  };
  const handleDeleteQuote = (id) => {
    quoteDelete(id);
  };
  useEffect(() => {
    refetch();
  }, [open, deleteQuote]);
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
                  setQuoteMode("create");
                  setOpen(true);
                }}
              >
                Add Quote
              </div>
            </div>

            <div className="py-4 font-bold text-lg">Quotes</div>

            {/* Space */}
            <div className="py-4"></div>

            {/* Quote  */}
            <section className="rounded border px-4 py-4 overflow-x-scroll">
              {isLoading ? (
                <Loader />
              ) : (
                <table className="table-auto w-full rounded bg-gray-50 ">
                  <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                    <tr className="border text-red-600">
                      <th className=" border px-4 py-2">Quotes</th>
                      <th className=" border px-4 py-2">Author</th>
                      <th className=" border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes?.length > 0 ? (
                      quotes.map((quote) => (
                        <tr className="even:bg-gray-100" key={quote?.id}>
                          <td className="border px-4 py-2">{quote?.content}</td>
                          <td className="border px-4 py-2">
                            {quote?.quote_author}
                          </td>
                          <td className="border pl-4 py-2 w-[170px]">
                            <span
                              className="px-2 py-1 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
                              onClick={() => {
                                setToEditQuote(quote);
                                setQuoteMode("edit");
                                setOpen(true);
                              }}
                            >
                              Edit
                            </span>
                            <span
                              className="px-2 py-1 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700 ml-1"
                              onClick={() => {
                                setDeletingQuote(quote);
                                setDeleteQuote(true);
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
            {/* ADD,UPDATE QUOTE */}
            <Modal
              isOpen={open}
              handleClose={handleClose}
              title={quoteMode === "create" ? "New Quote" : "Update Quote"}
            >
              <div className="my-2 flex flex-col gap-2">
                <Formik
                  initialValues={quoteInitialValues}
                  validationSchema={quoteSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className="flex flex-col gap-2">
                      <div>
                        <FormikControl
                          name="content"
                          multiline
                          minRows={4}
                          placeholder="Quote content"
                        />
                      </div>
                      <div>
                        <FormikControl
                          name="quote_author"
                          placeholder="Authors Name"
                        />
                      </div>
                      <div className="w-full flex justify-center">
                        <AuthButton
                          isLoading={isCreatingQuote || isUpdatingQuote}
                          text={quoteMode === "create" ? "submit" : "update"}
                        />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </Modal>
            <Modal
              isOpen={deleteQuote}
              handleClose={() => {
                setDeleteQuote(false);
                setDeletingQuote(null);
              }}
              title={"Delete Quote"}
            >
              <div>
                <p>Are you sure you want to delete quote </p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => handleDeleteQuote(deletingQuote?.id)}
                  variant="contained"
                  sx={{
                    textTransform: "initial",
                    backgroundColor: "darkred !important",
                    color: "white !important",
                  }}
                >
                  {isDeletingQuote ? "deleting" : "confirm"}
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
