"use client";
export const dynamic = "force-dynamic";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainTop from "@/components/MainTop";
import { BLOG } from "@/constants";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import { useFetch } from "@/hooks/useHttp/useHttp";
import CategoryIcon from "@mui/icons-material/Category";
import DateRangeIcon from "@mui/icons-material/DateRange";
import dummyImage from "../../../assets/images/noImage.jpg";
import userImage from "../../../assets/images/user.jpg";
import { Button } from "@mui/material";
import Loader from "@/components/Loader";
import { formatDate } from "@/utils/utilFunctions";
import { useEffect, useState } from "react";
import FormikControl from "@/components/validation/FormikControl";
import { Formik, Form } from "formik";
import AuthButton from "@/components/AuthButton";
import { blogCommentSchema } from "@/components/validationSchemas/ValidationSchema";
import { usePost } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectIsAuth } from "@/utils/redux/slices/auth.reducer";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  currentlyLoggedInUser,
  currentlyLoggedInUserEmail,
} from "@/utils/redux/slices/auth.reducer";
import { QueryClient } from "@tanstack/react-query";

function Page({ params }) {
  const {
    isLoading,
    data: blogList,
    isFetching,
    refetch,
  } = useFetch("blog", `/blogs/${params.id}`);
  useEffect(() => {
    refetch();
  }, [params.id]);
  const isAuth = useSelector(selectIsAuth);
  const router = useRouter();
  const userName = useSelector(currentlyLoggedInUser);
  const userEmail = useSelector(currentlyLoggedInUserEmail);
  const queryClient = useQueryClient();
  const { isLoading: isBlogCommentsLoading, data: comments } = useFetch(
    "blogs-comments",
    `/blogs/comment/${params.id}`
  );
  const blogComments = comments && comments?.data;
  const post = blogList && blogList?.data;
  const breadcrumbData = [
    { name: "Blog", path: "/blog" },
    { name: post?.title, path: "/blog/" + post?.title },
  ];
  const [leaveComment, setLeaveComment] = useState(false);
  const toggleLeaveComment = () => {
    setLeaveComment(!leaveComment);
  };

  const { mutate, isLoading: isPosting } = usePost("/blogs/comment/create", {
    onSuccess: (response) => {
      const { data } = response;
      toast.success("comment posted successfully");
      queryClient.invalidateQueries("blogs-comments");
      setLeaveComment(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const intialValues = {
    name: userName || "",
    email: userEmail || "",
    content: "",
  };
  const handleSubmit = (values) => {
    const payload = {
      author: values.name,
      email: values.email,
      created_at: new Date().toISOString(),
      content: values.comment,
      blog: params?.id,
    };
    if (isAuth) {
      mutate(payload);
    } else {
      toast.error("kindly login to comment");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };
  if (isLoading || isFetching) return <Loader />;
  return (
    <div>
      <div className="relative">
        <Header />
        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData} />
          {/* BLOGPOST */}
          <section className="flex flex-col lg:flex-row gap-2 py-8 px-6">
            {/* Left */}
            <div className=" flex-1">
              <div>
                <div className="flex justify-center">
                  <Image
                    src={post?.blogimage_url || dummyImage}
                    alt={post?.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-3 flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      <CategoryIcon sx={{ fontSize: 35 }} />
                    </span>
                    <div className="flex flex-col">
                      <span className="uppercase text-primary">Category</span>
                      <span>{post?.category || "N/a"}</span>
                    </div>
                  </div>
                  <div class="border-l"></div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      <DateRangeIcon sx={{ fontSize: 35 }} />
                    </span>
                    <div className="flex flex-col">
                      <span className="uppercase text-primary">
                        Last updated
                      </span>
                      <span>{post?.updatedDate || "N/a"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="py-3">
                    <h1 className="text-xl font-bold">{post?.title}</h1>
                  </div>
                  <div className="py-3">
                    <p>{post?.content}</p>
                  </div>
                </div>
                <div className="py-4">
                  <Divider />
                </div>
                <div>
                  <div className="flex gap-6 items-center flex-wrap my-2">
                    <h1 className="text-xl font-bold">Comments</h1>
                    <Button
                      variant="contained"
                      className="theme-btn"
                      sx={{ textTransform: "initial" }}
                      onClick={toggleLeaveComment}
                      type="button"
                    >
                      {leaveComment ? "Close" : "Leave a Comment"}
                    </Button>
                  </div>
                  {leaveComment && (
                    <>
                      <div
                        className={`my-2 ${
                          leaveComment ? "tilt-in-fwd-bl" : ""
                        }`}
                      >
                        <Formik
                          initialValues={intialValues}
                          onSubmit={handleSubmit}
                          validationSchema={blogCommentSchema}
                        >
                          {({ values }) => {
                            return (
                              <Form>
                                <div className="flex flex-col gap-6 p-3">
                                  <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-6">
                                      <FormikControl
                                        name="name"
                                        placeholder="Name"
                                      />
                                    </div>
                                    <div className="col-span-6">
                                      <FormikControl
                                        name="email"
                                        placeholder="Email"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <FormikControl
                                      name="comment"
                                      placeholder="Comment"
                                      multiline
                                      minRows={4}
                                    />
                                  </div>
                                  <div>
                                    <AuthButton
                                      type="submit"
                                      text="Post Comment"
                                      isLoading={isPosting}
                                      disabled={isPosting}
                                      onClick={handleSubmit}
                                    />
                                  </div>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </>
                  )}
                  {blogComments == undefined && !isBlogCommentsLoading && (
                    <div className="text-center text-sm">
                      No comment to show for this post
                    </div>
                  )}
                  <div>
                    {isBlogCommentsLoading ? (
                      <p>loading comments.....</p>
                    ) : (
                      blogComments && (
                        <>
                          <div className="py-4 flex gap-4 odd:bg-gray-50">
                            <div>
                              <Image
                                src={blogComments?.author?.image || userImage}
                                alt={blogComments?.author}
                                width={50}
                                height={50}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className=" text-lg">
                                  {blogComments?.author}
                                </h3>
                                <p className="text-gray-400 text-xs">
                                  {formatDate(blogComments?.created_at)}
                                </p>
                              </div>
                              <p>{blogComments?.content}</p>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className=" lg:w-[300px] py-8 lg:py-0 flex flex-col gap-6">
              {/* Search */}
              <div className="border-2 py-8 px-4 rounded ">
                <div className="">
                  <form action="" className=" border-b  flex items-center">
                    <input
                      type="text"
                      placeholder="Search"
                      className="  p-2 focus:outline-none flex-1  focus:bg-blue-200"
                    />
                    <span className="px-2 cursor-pointer hover:text-3xl scale-125">
                      <SearchIcon className="" />
                    </span>
                  </form>
                </div>
              </div>

              {/* Latest Posts */}
              <div className="border-2 pt-8  rounded">
                <div className="px-4 text-lg">Latest Posts</div>

                <Divider className="py-2" />

                {/* Posts */}
                <div>
                  {BLOG.posts.slice(0, 3).map((post) => {
                    return (
                      <div
                        className="cursor-pointer flex gap-4 py-4 px-1 hover:bg-blue-200 hover:text-red-500 transition-all duration-300"
                        key={post.id}
                      >
                        {/* Left */}
                        <div className="w-[100px] overflow-x-hidden h-auto relative bg-primary rounded ">
                          <Image
                            src={post.image}
                            alt="blog1"
                            fill
                            objectFit="cover"
                            objectPosition="center"
                          />
                        </div>
                        {/* Right */}
                        <div>
                          <div className="text-gray-400">{post.date}</div>
                          <div>
                            {" "}
                            <h3>
                              {post.title.slice(0, 40)}{" "}
                              {post.title.length > 40 ? "..." : ""}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <div className="border-2 pt-8  rounded">
                <div className="px-4 text-lg">Blog Categories</div>

                <Divider className="py-2" />

                {/* Categories list */}
                <div>
                  {BLOG.categories.map((category, index) => {
                    return (
                      <div
                        className="cursor-pointer flex gap-4 py-2 px-4 hover:bg-blue-200 hover:text-red-500 transition-all duration-300"
                        key={index}
                      >
                        {category}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="border-2 pt-8  rounded">
                <div className="px-4 text-lg">Popular Tags</div>

                <Divider className="py-2" />

                {/* tag list */}
                <div className="flex flex-wrap gap-4 py-4 px-2">
                  {BLOG.tags.map((tag, index) => {
                    return (
                      <div
                        className="cursor-pointer bg-gray-200 py-2 px-2 rounded hover:bg-blue-200 hover:text-red-500 transition-all duration-300 text-xs"
                        key={index}
                      >
                        {tag}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Page;
