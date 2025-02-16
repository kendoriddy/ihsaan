"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import { useEffect } from "react";
import FormikControl from "@/components/validation/FormikControl";
import { Form, Formik } from "formik";
import { useFetch, usePost, usePut, useDelete } from "@/hooks/useHttp/useHttp";
import Loader from "@/components/Loader";
import AuthButton from "@/components/AuthButton";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/validation/Modal";
import { catSchema } from "@/components/validationSchemas/ValidationSchema";

function Page() {
  const currentRoute = usePathname();
  const queryClient = useQueryClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [toEditCategory, setToEditCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const {
    isLoading,
    data: CategoriesList,
    isFetching,
    refetch,
  } = useFetch("category", `/category`);

  const Categories = CategoriesList && CategoriesList?.data;
  const [CategoryMode, setCategoryMode] = useState("create");
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setCategoryMode("");
    setOpen(false);
    setToEditCategory(null);
  };

  const CategoryInitialValues = {
    name: toEditCategory?.name || "",
  };

  const { mutate: createNewCategory, isLoading: isCreatingCategory } = usePost(
    "/category",
    {
      onSuccess: (response) => {
        toast.success("Category created successfully");
        queryClient.invalidateQueries("category");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const { mutate: updateCategory, isLoading: isUpdatingCategory } = usePut(
    "/category",
    {
      onSuccess: (response) => {
        const { data } = response;
        toast.success("Category updated successfully");
        queryClient.invalidateQueries("category");
        handleClose();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const { mutate: CategoryDelete, isLoading: isDeletingCategory } = useDelete(
    "/category",
    {
      onSuccess: (data) => {
        toast.success("deleted successfully");
        queryClient.invalidateQueries("category");
        setDeleteCategory(false);
        setDeletingCategory(null);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const handleSubmit = (values) => {
    const { name } = values;
    const payload = {
      name: name,
    };
    if (CategoryMode === "create") {
      createNewCategory(payload);
    } else {
      updateCategory({ id: toEditCategory?.id, data: payload });
    }
  };

  const handleDeleteCategory = (id) => {
    CategoryDelete(id);
  };

  useEffect(() => {
    refetch();
  }, [open, deleteCategory]);

  if (isLoading) return <Loader />;

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
            "@media (minWidth: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}>
          <div className="p-4">
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">Categories</div>
              <div
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setCategoryMode("create");
                  setOpen(true);
                }}>
                Add Category
              </div>
            </div>

            {/*  Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Name</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Categories?.length > 0 ? (
                    Categories.map((category, index) => (
                      <tr key={category.id} className="border">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{category.name}</td>
                        <td className="border px-4 py-2">
                          <div className="flex gap-2">
                            <div
                              className="px-2 py-1 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
                              onClick={() => {
                                setToEditCategory(category);
                                setCategoryMode("edit");
                                setOpen(true);
                              }}>
                              Edit
                            </div>
                            <div
                              className="px-2 py-1 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700 ml-1"
                              onClick={() => {
                                setDeleteCategory(true);
                                setDeletingCategory(category);
                              }}>
                              Delete
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No Categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Add and update Category */}
        <Modal
          isOpen={open}
          handleClose={handleClose}
          title={CategoryMode === "create" ? "Add Category" : "Edit Category"}>
          <Formik
            initialValues={CategoryInitialValues}
            validationSchema={catSchema}
            onSubmit={handleSubmit}>
            <Form className="flex flex-col gap-2">
              <FormikControl
                control="input"
                type="text"
                name="name"
                label="Category Name"
                placeholder="Enter category name"
              />
              <div className="w-full flex justify-center">
                <AuthButton
                  isLoading={isCreatingCategory || isUpdatingCategory}
                  text={CategoryMode === "create" ? "submit" : "Update"}
                />
              </div>
            </Form>
          </Formik>
        </Modal>

        {/* Delete Category */}
        <Modal
          isOpen={deleteCategory}
          handleClose={() => {
            setDeleteCategory(false);
            setDeletingCategory(null);
          }}
          title="Delete Category">
          <div>
            <div>Are you sure you want to delete this category?</div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => handleDeleteCategory(deletingCategory?.id)}
              variant="contained"
              sx={{
                textTransform: "initial",
                backgroundColor: "darkred !important",
                color: "white !important",
              }}>
              {isDeletingCategory ? "deleting" : "confirm"}
            </Button>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default Page;
