"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainTop from "@/components/MainTop";
import { BLOG, IMAGES } from "@/constants";
import Image from "next/image";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CategoryIcon from "@mui/icons-material/Category";
import Divider from "@mui/material/Divider";

import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";

function Page({ params }) {
  const pathname = usePathname();
  const postID = pathname.split("/")[3];
  const [post, setPost] = useState({});

  const breadcrumbData = [
    { name: "Blog", path: "/blog" },
    { name: params.title, path: "/blog/" + params.title },
  ];

  const postComment = (e) => {
    e.preventDefault();
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      // Fetch Books
      const postResponse = await fetch(`/api/blog/${postID}`);
      const post = await postResponse.json();
      setPost(post.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch Data
    fetchData();
  }, []);

  return (
    <div>
      <div className="relative">
        <Header />

        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData} />

          {/* BLOGPOST */}
          <section className="flex flex-col lg:flex-row py-8 px-6">
            {/*  Left */}
            <div className=" flex-1">
              <div>
                {/* Image Top */}
                <div className="flex justify-center">
                  <Image
                    src={post?.blog_image || IMAGES.logo}
                    alt={post?.title}
                    width={500}
                    height={300}
                    className=""
                  />
                </div>

                {/* Mid */}
                <div className="py-3 flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      <CategoryIcon sx={{ fontSize: 35 }} />
                    </span>
                    <div className="flex flex-col">
                      <span className="uppercase text-primary">Category</span>
                      <span>{post?.category}</span>
                    </div>
                  </div>
                  <div class="border-l"></div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      <DateRangeIcon sx={{ fontSize: 35 }} />
                    </span>
                    <div className="flex flex-col">
                      <span className="uppercase text-primary">Posted on</span>
                      <span>{post?.created_at}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="py-3">
                    <h1 className="text-xl font-bold">{post?.title}</h1>
                  </div>
                  <div className="py-3">
                    <p>{post?.content}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-4/5 max-w-[700px] mx-auto py-4">
                  <Divider />
                </div>

                {/* Comments */}
                <div>
                  {/* Top */}
                  <div>
                    <h1 className="text-xl font-bold">
                      {post?.comments?.length} Comments
                    </h1>
                  </div>

                  {/* Comment */}
                  {post?.comments?.map((comment) => {
                    return (
                      <div
                        className="py-4 flex gap-4 odd:bg-gray-50"
                        key={comment.id}>
                        {/* Left */}
                        <div>
                          <Image
                            src={comment?.author?.image}
                            alt={comment?.author?.name}
                            width={50}
                            height={50}
                          />
                        </div>
                        {/* Right */}
                        <div>
                          <h3 className=" text-lg">{comment?.author?.name}</h3>

                          <p className="text-gray-400">{comment?.date}</p>
                          <p>{comment?.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="w-4/5 max-w-[700px] mx-auto py-4">
                  <Divider />
                </div>

                {/* Comment Form */}
                <div className="max-w-[800px]">
                  {/* Top */}
                  <div>
                    <h3 className="text-xl font-bold">Leave a Comment</h3>
                    <p>
                      Your email address will not be published.Required fields
                      are marked{" "}
                      <span className="text-red-400 text-lg">
                        {" "}
                        <sup>*</sup>{" "}
                      </span>
                    </p>
                  </div>

                  {/* Form */}
                  <form
                    action="post"
                    onSubmit={(e) => postComment(e)}
                    className=" lg:pr-8">
                    {/* First row */}
                    <div className="flex flex-col lg:flex-row gap-4 py-4">
                      <div className="flex-1">
                        <input
                          placeholder="Name * "
                          type="text"
                          className="w-full p-2 rounded border-b border-gray-300 focus:outline-none focus:bg-blue-200"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          placeholder="Email * "
                          type="email"
                          className="w-full p-2 rounded border-b border-gray-300 focus:outline-none focus:bg-blue-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Comment row */}
                    <div className="flex flex-col lg:flex-row gap-4 py-4">
                      <div className="flex-1">
                        <textarea
                          name="body"
                          id="comment_body"
                          placeholder="Your comment ... * "
                          className="w-full p-2 rounded border-b border-gray-300 focus:outline-none focus:bg-blue-200 h-[100px]"
                          required></textarea>
                      </div>
                    </div>

                    {/* Check box */}
                    <div className="py-2 text-gray-500">
                      <input
                        type="checkbox"
                        name="check"
                        id="check"
                        className="mr-2"
                        required
                      />
                      <label htmlFor="check">
                        Save my name, email, and website in this browser for the
                        next time I comment.
                      </label>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center py-4">
                      <Button type="submit" className="theme-btn">
                        Post Comment
                      </Button>
                    </div>
                  </form>
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
                        key={post.id}>
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
                        key={index}>
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
                        key={index}>
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
