"use client";
// Components
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
//Courses_import
//import { COURSES } from "@/constants";
//useState
import { useState, useRef, useEffect } from "react";
//import icons
import StarIcon from "@mui/icons-material/Star";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import InfoIcon from "@mui/icons-material/Info";

//pagination
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Image from "next/image";

export default function Courses() {
  const [courseIndex, setCourseIndex] = useState([0, 3]);
  const [page, setPage] = useState(1);
  const searchRef = useRef(null);
  //const [courses, setCourses] = useState(COURSES);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //setSearch(searchRef.current.value);
  };

  function handlePageChange(event, value) {
    setPage(value);
    setCourseIndex([(value - 1) * 3, value * 3]);
  }

  useEffect(() => {
    const fetchData = async () => {
      //Courses

      const res = await fetch("/api/courses");

      const courses = await res.json();
      setCourses(courses.courses);
    };
    fetchData();
  }, [search]);

  console.log(courses);

  //   const data = [...COURSES].filter((item) => {
  //     if (item.title.toLowerCase().includes(search.toLowerCase())){
  //       return item;
  //     }
  //   });
  //   setCourses(data);
  // }, [search]);

  return (
    <div>
      <div className="relative">
        <Header />
        <main
          className="min-h-[500px] flex flex-col  align-start
          p-[30px] md:flex-row gap-2 "
        >
          <section className="flex flex-col lg:flex-row md:w-[300px] lg:w-[360px] h-[195px]">
            <div className="flex-col flex border  lg:w-[333px] p-6 justify-center gap-2">
              <h4 className="text-lg">Filter by Field</h4>
              <div>
                <form
                  action=""
                  method="post"
                  onSubmit={(e) => handleSubmit(e)}
                  className="flex-col"
                >
                  <input
                    type="text"
                    className="w-full border border-inherit-400 h-[40px] bg-white-500 outline-none box-border shadow p-2"
                    placeholder="Filter by title or field"
                    ref={searchRef}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
              </div>
              {/* <button
                type="submit"
                ref={searchRef}
                onclick={(e) => setSearch(e.target.value)}
                className="bg-blue-500 h-[46px] py-2 rounded text-white text-lg "
              >
                Search
              </button> */}
            </div>
          </section>

          <section className="flex flex-col min-h-[800px] lg:w-full gap-5">
            <article className="flex flex-col">
              {courses.slice(courseIndex[0], courseIndex[1]).map((course) => {
                return (
                  <div
                    className="flex flex-col lg:flex-row lg:justify-between border lg:h-[193px] gap-2 p-2 mb-2
                  w-full items-center"
                    key={course.id}
                  >
                    <div className="flex flex-col lg:flex-row gap-3">
                      <div>
                        <Image src={course.image} width={145} alt={course.title} />
                        {/* <img
                          src={COURSE.image}
                          className="rounded-md w-[145px] h-[145px]"
                        /> */}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-lg capitalize">{course.title}</div>
                        <div className="text-slate-500">IHSAAN</div>
                        <div>
                          {[1, 2, 3, 4, 5].map((index) => (
                            <span key={index}>
                              <StarIcon
                                className={`${
                                  index <= course.stars ? "text-yellow-500" : "text-slate-400"
                                } text-base`}
                              />
                            </span>
                          ))}
                        </div>
                        <div className="flex lg:w-full">
                          <Link href={`courses/${course.id}`} className="w-full">
                            <button className="bg-blue-500 h-10 p-2 text-white rounded w-full">
                              DETAILS
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className=" flex flex-col lg:flex-col gap-3 lg:w-[210px]">
                      <div className="flex gap-4 text-gray-500 justify-bottom">
                        <span className="">
                          <ReviewsOutlinedIcon className="text-[16px]" />
                        </span>
                        {/* <span>{course.reviews.length} Reviews</span> */}
                      </div>
                      <div className="flex text-gray-500 gap-4 justify-bottom">
                        <span>
                          <PaymentsOutlinedIcon className="text-[16px]" />
                        </span>
                        <span className="flex items-center gap-1">
                          NGN {course.price} <InfoIcon className="text-[16px]" />
                        </span>
                      </div>
                      <Link href="/cart" className="w-full">
                        <button className="bg-blue-500 w-full text-white h-10 p-2 rounded">
                          ADD TO CART
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </article>

            <section className="flex gap justify-between border items-center h-[110px] p-2.5">
              <div>Courses:16</div>
              <Stack spacing={2}>
                <Pagination
                  count={6}
                  variant="outlined"
                  shape="rounded"
                  onChange={handlePageChange}
                />
              </Stack>
            </section>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
