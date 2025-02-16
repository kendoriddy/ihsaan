"use client";

// Components
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainTop from "@/components/MainTop";
import { useSearchParams } from "next/navigation";
import { BOOKS, COURSES, MENTORS, breadcrumbData } from "@/constants";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Rating } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function Page() {
  const searchRef = useRef(null);
  const [searchIdx, setSearchIdx] = useState([0, 10]);

  const searchParams = useSearchParams();
  const [searchedResults, setSearchedResults] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search"));

  const handleChange = (event, value) => {
    setSearchIdx([(value - 1) * 10, value * 10]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = [...BOOKS, ...COURSES, ...MENTORS].filter((item) => {
      if (item.title.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (item?.name?.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
    });

    if (search !== "") {
      setSearchedResults(data);
    }
  };

  useEffect(() => {
    // Create a new array from the filtered results of the books, courses, and mentors
    const data = [...BOOKS, ...COURSES, ...MENTORS].filter((item) => {
      if (item.title.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (item?.name?.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (item?.author?.name?.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
    });
    setSearchedResults(data);
  }, [search]);

  return (
    <div>
      <div className="relative">
        <Header />
        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData.search} />

          {/* Search bar */}
          <div className="py-8 max-w-[700px] m-auto">
            <form
              action=""
              method="post"
              className="w-full flex justify-center gap-2"
              onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                placeholder="Search for mentors, courses, books..."
                className="w-full  border border-red-600 rounded-md py-2 px-2"
                ref={searchRef}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <button type="submit" className="theme-btn">
                Search
              </button> */}
            </form>
          </div>

          {/* Sections */}
          <div className="p-4">
            <section className="py-2">
              <div className="text-xl">
                {searchedResults.length} results for{" "}
                <span className="font-bold">"{search}"</span>
              </div>
            </section>

            <section className="flex gap-4">
              {/* Left */}
              {/* <div className="w-[300px] bg-gray-100">Filter</div> */}
              {/* Right */}
              <div className="flex-1 ">
                {searchedResults
                  .slice(searchIdx[0], searchIdx[1])
                  .map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex mb-4 w-full bg-gray-100 rounded p-4">
                        <div className=" flex-1 ">
                          <Link href={`/${item.uri}`} className="flex gap-4 ">
                            <div>
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className="text-lg">
                              <div className="font-bold">{item?.name}</div>
                              <div className="font-bold">{item?.title}</div>
                              <div>{item?.field}</div>
                              <div className="">
                                <Rating
                                  name="half-rating-read"
                                  defaultValue={item?.rating}
                                  precision={0.5}
                                  readOnly
                                  size="large"
                                  // sx={{ color: "#f34103" }}
                                />
                              </div>
                              <div className="capitalize">{item?.type}</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          </div>

          {/* Pagination */}
          <section className="pt-4 pb-12">
            <div className="w-4/5 mx-auto border flex flex-col lg:flex-row justify-between items-center px-4 rounded">
              <div>Total Books: {searchedResults.length}</div>
              <div>
                <Stack spacing={2} className="py-5">
                  <Pagination
                    count={Math.ceil(searchedResults.length / 10)}
                    variant="outlined"
                    shape="rounded"
                    onChange={handleChange}
                  />
                </Stack>
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
