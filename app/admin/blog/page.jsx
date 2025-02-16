"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Image from "next/image";
import cardImage from "../../../assets/images/noImage.jpg";
import serverErrorImage from "../../../assets/images/serverErrorImage.jpg";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, IconButton } from "@mui/material";
import Modal from "@/components/validation/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import { Formik, Form } from "formik";
import SearchComponent from "@/components/validation/SearchComponent";
import FormikControl from "@/components/validation/FormikControl";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  catSchema,
  addBlog,
} from "@/components/validationSchemas/ValidationSchema";
import AuthButton from "@/components/AuthButton";
import Loader from "@/components/Loader";
import { usePost, useDelete, useFetch, usePut } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import ButtonWithForwardBackWordIcon from "@/components/ButtonWithForwardBackWordIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

function Page() {
  const queryClient = useQueryClient();
  const { isLoading, data, isError, refetch } = useFetch("blogs", `/blogs`);
  const {
    isLoading: isCatListLoading,
    data: createdCategories,
    refetch: reFetchCat,
  } = useFetch("categories", `/category`);
  const blogsList = data && data?.data;
  const createdCategoryList = createdCategories && createdCategories?.data;
  const options = createdCategoryList?.map((item) => {
    return {
      key: item?.name,
      value: item?.name,
    };
  });
  const currentRoute = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [addCat, setAddNewCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState(null);
  const [deletingBlogPost, setDeletingBlogPost] = useState(null);
  const handleToggleAddCat = () => {
    setAddNewCat(!addCat);
  };
  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [openBlog, setOpenBlog] = useState(false);
  const [deleteBlog, setDeleteBlog] = useState(false);
  const [blogMode, setBlogMode] = useState("create");
  const [openBlogSetting, setOpenBlogSetting] = useState(false);
  const [toEditBlog, setToEditBlog] = useState(null);
  const intialValues = {
    catName: "",
  };
  const handleCloseBlog = () => {
    setToEditBlog(null);
    setOpenBlog(false);
  };
  const addBlogInitialValues = {
    category: "" || toEditBlog?.category,
    title: "" || toEditBlog?.title,
    author: "" || toEditBlog?.author,
    content: "" || toEditBlog?.content,
    created_at: new Date().toISOString(),
    blogimageurl: "" || toEditBlog?.blogimage_url,
  };
  const { mutate, isLoading: isCreatingNewCat } = usePost("/category", {
    onSuccess: (response) => {
      const { data } = response;
      toast.success("category added successfully");
      queryClient.invalidateQueries("categories");
      handleToggleAddCat();
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const { mutate: createNewBlog, isLoading: isCreatingBlog } = usePost(
    "/blogs/create",
    {
      onSuccess: (response) => {
        const { data } = response;
        toast.success("blog created successfully");
        queryClient.invalidateQueries("blogs");
        setOpenBlog(false);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const { mutate: updateBlogPost, isLoading: isUpdatingBlog } = usePut(
    "/blogs",
    {
      onSuccess: (response) => {
        const { data } = response;
        toast.success("blog updated successfully");
        queryClient.invalidateQueries("blogs");
        setOpenBlog(false);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const handleSubmit = (values) => {
    const { catName } = values;
    const payload = {
      name: catName,
    };
    mutate(payload);
  };
  const handleCreateBlog = (values) => {
    const { author, blogimageurl, title, category, content } = values;
    const payload = {
      author: author,
      blogimage_url: blogimageurl,
      title: title,
      category: category,
      content: content,
      created_at: new Date().toISOString(),
    };
    if (blogMode === "create") {
      createNewBlog(payload);
    } else {
      updateBlogPost({ id: toEditBlog?.id, data: payload });
    }
  };
  const { mutate: deleteCat, isLoading: isDeletingCat } = useDelete(
    "/category",
    {
      onSuccess: (data) => {
        toast.success("deleted successfully");
        queryClient.invalidateQueries("categories");
        setDeletingCatId(null);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const { mutate: deleteBlogPost, isLoading: isDeletingBlogPost } = useDelete(
    "/blogs",
    {
      onSuccess: (data) => {
        toast.success("blog deleted successfully");
        // queryClient.invalidateQueries("blogs");
        setDeletingBlogPost(null);
        setDeleteBlog(false);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
  const handleDeleteCat = (id) => {
    setDeletingCatId(id);
    deleteCat(id);
  };
  const handleDeleteBlogPost = (id) => {
    deleteBlogPost(id);
  };
  useEffect(() => {
    refetch();
  }, [createNewBlog, deleteBlogPost, updateBlogPost]);
  useEffect(() => {
    reFetchCat();
  }, [mutate, deleteCat]);
  if (isLoading) return <Loader />;
  return (
    <div className="relative">
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />
      <main className="flex relative">
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />
        <section className=" lg:ml-[250px] w-screen px-2">
          <div>
            <div className="flex flex-col gap-2 mb-6">
              <div className="p-2 font-bold bg-white text-lg text-blue-500">
                Manage Blog{" "}
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <SearchComponent placeholder={"search by blog name"} />
                </div>
                <div>
                  <ButtonWithForwardBackWordIcon
                    text={"Add Blog"}
                    showStartIcon={true}
                    onClick={() => {
                      setBlogMode("create");
                      setOpenBlog(true);
                    }}
                  />
                </div>
                <div>
                  <IconButton onClick={() => setOpenBlogSetting(true)}>
                    <SettingsIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              {blogsList && blogsList?.length === 0 ? (
                <p className="col-span-12 text-center text-red-500">
                  No data to show at the moment
                </p>
              ) : (
                blogsList?.map((item) => (
                  <div
                    key={item?.id}
                    className="group relative h-[600px] overflow-y-scroll col-span-4 my-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="absolute top-0 right-0 bg-gray-200 p-2 rounded-lg hidden group-hover:flex items-center gap-2">
                      <IconButton
                        onClick={() => {
                          setDeleteBlog(true);
                          setDeletingBlogPost(item);
                        }}
                      >
                        <DeleteForeverIcon
                          sx={{
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setToEditBlog(item);
                          setBlogMode("edit");
                          setOpenBlog(true);
                        }}
                      >
                        <EditIcon sx={{ color: "black", cursor: "pointer" }} />
                      </IconButton>
                    </div>
                    <div>
                      <div>
                        <Image
                          src={item?.blogimage_url || cardImage}
                          alt="Blog Image"
                          width={500}
                          height={500}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div class="p-5">
                        <div className="flex flex-col gap-1 my-2">
                          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <Link
                              href={{
                                pathname: `/blog/${item?.id}`,
                              }}
                              as={`/blog/${item?.id}`}
                            >
                              {item?.title}{" "}
                            </Link>
                          </h5>
                          <h6 className="font-semibold text-xs text-red-300">
                            by {item?.author}
                          </h6>
                        </div>
                        <p class="mb-3 font-normal text-justify text-gray-700 dark:text-gray-400">
                          {item?.content}
                        </p>
                        {/* <ButtonWithForwardBackWordIcon
                          text={"View More"}
                          showEndIcon={true}
                        /> */}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isError && (
                <div className="col-span-12 flex justify-center">
                  <Image
                    src={serverErrorImage}
                    alt="serverErrorImage"
                    width={500}
                    height={400}
                  />
                </div>
              )}
            </div>
          </div>
          <Modal
            isOpen={openBlogSetting}
            handleClose={() => setOpenBlogSetting(false)}
            title={"Settings"}
          >
            <div className="flex justify-between items-center my-2">
              <h1 className="text-lg ">Available Category</h1>
              <ButtonWithForwardBackWordIcon
                showStartIcon={true}
                text={addCat ? "Close" : "Add Categories"}
                onClick={handleToggleAddCat}
              />
            </div>
            {addCat && (
              <div className="my-2">
                <Formik
                  initialValues={intialValues}
                  validationSchema={catSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className="flex flex-col gap-2">
                      <div>
                        <FormikControl
                          name="catName"
                          placeholder="category name"
                        />
                      </div>
                      <div className="w-full flex justify-center">
                        <AuthButton
                          text={"submit"}
                          isLoading={isCreatingNewCat}
                          disabled={isCreatingNewCat}
                        />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            )}
            <div>
              <ul className="bg-gray-300 p-3">
                {isCatListLoading ? (
                  <Loader />
                ) : createdCategoryList && createdCategoryList?.length === 0 ? (
                  <p className="text-center text-red-500">Nothing here yet</p>
                ) : (
                  createdCategoryList?.map((item, index) => (
                    <li key={item?.id} className="flex items-center gap-4">
                      <span>
                        {index + 1} - {item?.name}
                      </span>
                      <span>
                        <IconButton onClick={() => handleDeleteCat(item?.id)}>
                          {deletingCatId == item?.id && isDeletingCat ? (
                            <p className="text-xs text-red-500">deleting...</p>
                          ) : (
                            <CancelIcon color="error" />
                          )}
                        </IconButton>
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Modal>
          <Modal
            isOpen={openBlog}
            handleClose={handleCloseBlog}
            title={blogMode === "create" ? "New Blog Post" : "Update Blog Post"}
          >
            {options && options?.length === 0 ? (
              <div>
                <p className="text-red-500 text-center">
                  kindly create categories before creating blogs, use the
                  setting icon to begin.
                </p>
              </div>
            ) : (
              <div className="my-2 flex flex-col gap-2">
                <Formik
                  initialValues={addBlogInitialValues}
                  validationSchema={addBlog}
                  onSubmit={handleCreateBlog}
                >
                  <Form>
                    <div className="flex flex-col gap-2">
                      <div>
                        <FormikControl name="title" placeholder=" Title" />
                      </div>
                      <div>
                        <FormikControl
                          name="category"
                          placeholder="Category"
                          control={"select"}
                          options={options}
                        />
                      </div>
                      <div>
                        <FormikControl
                          name="author"
                          placeholder="Authors Name"
                        />
                      </div>

                      <div>
                        <FormikControl
                          name="content"
                          multiline
                          minRows={4}
                          placeholder="blog content"
                        />
                      </div>
                      <div>
                        <FormikControl
                          name="blogimageurl"
                          placeholder="image url"
                        />
                      </div>
                      <div className="w-full flex justify-center">
                        <AuthButton
                          text={blogMode === "create" ? "submit" : "update"}
                          isLoading={isCreatingBlog || isUpdatingBlog}
                          disabled={isCreatingBlog || isUpdatingBlog}
                        />
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            )}
          </Modal>
          <Modal
            isOpen={deleteBlog}
            handleClose={() => setDeleteBlog(false)}
            title={"Delete Blog Post"}
          >
            <div>
              <p>
                Are you sure you want to delete{" "}
                <span className="text-red-500">{deletingBlogPost?.title}</span>{" "}
                blog post ?
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => handleDeleteBlogPost(deletingBlogPost?.id)}
                variant="contained"
                sx={{
                  textTransform: "initial",
                  backgroundColor: "darkred !important",
                  color: "white !important",
                }}
              >
                {isDeletingBlogPost ? "deleting" : "confirm"}
              </Button>
            </div>
          </Modal>
        </section>
      </main>
    </div>
  );
}

export default Page;
