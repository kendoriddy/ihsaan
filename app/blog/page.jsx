"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { IMAGES, breadcrumbData } from "@/constants";
import MainTop from "@/components/MainTop";
import Link from "next/link";
import Image from "next/image";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/utilFunctions";
import Loader from "@/components/Loader";

function Page() {
  const [blogpostIdx, setBlogpostIdxIdx] = useState([0, 6]);
  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event, value) => {
    setBlogpostIdxIdx([(value - 1) * 6, value * 6]);
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const blogResponse = await fetch(
        "https://yrms-api.onrender.com/api/blogs"
      );
      const blog = await blogResponse.json();
      setBlog(blog);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Fetch Data
    fetchData();
  }, []);
  if (isLoading) return <Loader />;
  return (
    <div>
      <div className="relative">
        <Header />
        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData.blog} />

          {/* BLOGPOST */}
          <section className="py-6 w-full">
            {/* Top */}

            <div className="flex flex-wrap justify-center gap-6 flex-col md:flex-row items-center ">
              {/* POSTS */}
              {blog?.slice(blogpostIdx[0], blogpostIdx[1]).map((post) => {
                return (
                  <Link
                    key={post?.id}
                    href={{
                      pathname: `/blog/${post?.id}`,
                    }}
                    as={`/blog/${post?.id}`}
                    className="group border w-1/4 h-[400px] overflow-y-scroll min-w-[300px] max-w-[500px] rounded-md overflow-hidden cursor-pointer shadow-md hover:bg-neutral-200 transition-all duration-300 lg:mt-4"
                  >
                    <div className="overflow-hidden">
                      <Image
                        src={post?.blogimage_url || IMAGES.logo}
                        alt="blog1"
                        width={500}
                        height={300}
                        // className="group-hover:scale-150 duration-300"
                      />
                    </div>
                    <div className="px-2 py-2 text-sm">
                      <div className="uppercase text-gray-700">
                        {post?.category}
                      </div>
                      <div className="capitalize font-bold text-neutral-800 py-2 text-xl h-[72px]">
                        {post?.title.slice(0, 40)}{" "}
                        {post?.title.length > 40 ? "..." : ""}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={IMAGES.logo}
                            alt="author"
                            width={30}
                            height={30}
                            className="rounded-full"
                          />
                          <div className="text-primary text-xs">
                            {post?.author}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div>
                            <DateRangeIcon
                              className="text-gray-400 "
                              sx={{ fontSize: 18 }}
                            />
                          </div>
                          <div className="text-gray-500 text-xs">
                            {formatDate(post?.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Pagination */}
          <section className="pt-4 pb-12">
            <div className="w-4/5 mx-auto border py-6 flex  justify-center items-center rounded">
              <Pagination
                count={Math.ceil(blog?.length / 6)}
                variant="outlined"
                shape="rounded"
                onChange={handleChange}
              />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Page;

{
  /* <Link
key={post?.id}
href={{
  pathname: `/blog/${post?.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`,
  query: { id: post?.id },
}}
as={`/blog/${post?.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")}`}
className="group border w-1/4 min-w-[300px] max-w-[500px] rounded-md overflow-hidden cursor-pointer shadow-md hover:bg-neutral-200 transition-all duration-300 lg:mt-4"
>
<div className="overflow-hidden">
  <Image
    src={post?.blog_image || IMAGES.logo}
    alt="blog1"
    width={500}
    height={300}
    className="group-hover:scale-150 duration-300"
  />
</div>
<div className="px-2 py-2 text-sm">
  <div className="uppercase text-gray-700">
    {post?.category}
  </div>
  <div className="capitalize font-bold text-neutral-800 py-2 text-xl h-[72px]">
    {post?.title.slice(0, 40)}{" "}
    {post?.title.length > 40 ? "..." : ""}
  </div>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Image
        src={IMAGES.logo}
        alt="author"
        width={30}
        height={30}
        className="rounded-full"
      />
      <div className="text-primary text-xs">
        {post?.author}
      </div>
    </div>
    <div className="flex items-center gap-1">
      <div>
        <DateRangeIcon
          className="text-gray-400 "
          sx={{ fontSize: 18 }}
        />
      </div>
      <div className="text-gray-500 text-xs">
        {formatDate(post?.created_at)}
      </div>
    </div>
  </div>
</div>
</Link> */
}
