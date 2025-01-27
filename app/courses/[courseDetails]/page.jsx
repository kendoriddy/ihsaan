"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COURSES } from "@/constants";
import { useState, useEffect } from "react";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import { usePathname } from "next/navigation";

function Page({ params }) {
  const pathname = usePathname();
  console.log(pathname);

  const getIdFromURL = pathname.split("/").pop();
  console.log(getIdFromURL);
  const [course, setCourse] = useState({});

  // Fetch Data

  useEffect(() => {
    const fetchData = async (id) => {
      //Mentors
      const courseResponse = await fetch(`/api/courses/${id}`);
      console.log(courseResponse);
      const course = await courseResponse.json();
      setCourse(course.course);

      console.log(course);
    };
    fetchData(getIdFromURL);
  }, [getIdFromURL]);

  // const COURSE = COURSES.filter((course) => {
  //   return course.courseDetails == params.courseDetails;
  // });

  return (
    <div>
      <div className="relative">
        <Header />
        <main className="min-h-[500px] flex items-center justify-center  pt-[15px]">
          <div className="text-3xl flex flex-col items-center justify-center w-full gap-8 px-[15px] pb-[12px] my-[12px]">
            <section
              className="flex h-[405px] flex-col lg:flex-row w-full lg:w-[932.26px] lg:h-[200px] 
            mx-[12px] p-[20px] border justify-center items-center">
              <div className="flex flex-col justify-center items-center lg:flex-row  lg:justify-between lg:gap-80">
                <div className="flex flex-col justify-center items-center lg:flex-row">
                  <div className="h-[145px] w-[145px] mb-5">
                    {/* <img href="" /> */}
                  </div>
                  <div className="flex flex-col justify-center items-left w-full ">
                    <p className="">{course.title}</p>
                    <p className="text-[14px] ">5000: Students</p>
                    <p>Instructor: {course.instructor_name}</p>
                    <p>{course.price}</p>
                    <p>{course.total_duration}</p>
                    <div className="mb-[10px]">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <span key={index}>
                          {/* <StarIcon
                            className={`${
                              index <= course.stars
                                ? "text-yellow-500"
                                : "text-slate-400"
                            }  pr-[5px]`}
                          /> */}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 lg:gap-0">
                  <span className="pb-[15px] lg:hide"></span>
                  <Link
                    href=""
                    className="bg-blue-500 text-[18px] text-white rounded-full py-[10px] px-[40px]">
                    Buy
                  </Link>
                </div>
              </div>
            </section>
            <section className="flex flex-col justify-center items-center border pt-6 px-6 w-full lg:w-[932.26px] border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full">
                <h4 className="mb-15px text-[18px]">Course Summary</h4>
                <hr className="my-4" />
                <p className="text-[14px] mb-4">{course.summary}</p>
              </div>
            </section>
            <section className="flex flex-col justify-center items-center border pt-6 px-6 w-full lg:w-[932.26px] border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full mb-0 justify-center">
                <h4 className="mb-15px text-[18px]">Preview Course</h4>
                <hr className="my-4" />
                <video controls className="mb-2">
                  <source src={course.videoLink} type="video/mp4" />
                </video>
              </div>
            </section>
            <section className="flex flex-col justify-center items-center border pt-6 px-6 w-full lg:w-[932.26px] border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full justify-center">
                <h4 className="mb-15px text-[18px]">What you will learn</h4>
                <hr className="my-4" />
                <div>{course.what_to_learn}</div>

                {/* <div className="list-none flex flex-col text-[14px] lg:flex-row lg:w-full gap-6 justify-between w-full">
                  <div className="flex gap-6 justify-between lg:w-[630px] lg:justify-between">
                    <li className="flex justify-start w-1/2">
                      <span className="text-[14px] flex">
                        <StarIcon className="text-yellow-500" />
                        Business Management
                      </span>
                    </li>
                    <li className="flex no-wrap justify-start w-1/2">
                      <span>
                        <StarIcon className="text-yellow-500" />
                        Communication Skills{" "}
                      </span>
                    </li>
                  </div>
                  <div>
                    <li>
                      <span className="text-[14px]">
                        <StarIcon className="text-yellow-500" />
                        Marketing Skills
                      </span>
                    </li>
                  </div>
                </div> */}

                {/* <li className="list-none w-1/2"><span className="text-[13px]"><StarIcon className="text-yellow-500"/>Business Management</span></li>
              <li className="list-none"><span className="text-[13px]"><StarIcon className="text-yellow-500"/>Communication Skills</span></li>
              <li className="list-none"><span className="text-[13px]"><StarIcon className="text-yellow-500"/>Marketing Skills</span></li> */}
              </div>
            </section>
            <section className="flex flex-col justify-center items-center border pt-6 px-6 w-full lg:w-[932.26px] border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full justify-center list-none">
                <h4 className="mb-15px text-[18px]">Course Requirements</h4>
                <hr className="my-4" />

                <div>{course.requirements}</div>

                {/* <div className="flex flex-col lg:flex-row">
                  <div className="flex gap-6 justify-between lg:w-1/2 lg:justify-between">
                    <li className="w-1/2 relative">
                      <div className="w-full">
                        <span className="text-[14px]">
                          <StarIcon className="text-yellow-500" />
                          Working Laptop
                        </span>
                      </div>
                    </li>
                    <li className="w-1/2 relative">
                      <div className="w-full">
                        <span className="text-[14px]">
                          <StarIcon className="text-yellow-500" />
                          Textbooks
                        </span>
                      </div>
                    </li>
                  </div>
                  <div className="flex gap-6 justify-between lg:w-1/2 lg:justify-between">
                    <li className="w-1/2 relative">
                      <div className="w-full">
                        <span className="text-[14px]">
                          <StarIcon className="text-yellow-500" />
                          Notebooks
                        </span>
                      </div>
                    </li>
                    <li className="w-1/2 relative">
                      <div className="w-full">
                        <span className="text-[14px]">
                          <StarIcon className="text-yellow-500" />
                          Pencil
                        </span>
                      </div>
                    </li>
                  </div>
                </div> */}
              </div>
            </section>

            <section className="flex flex-col justify-center items-center border pt-6 px-6 w-full lg:w-[932.26px] border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full">
                <h4 className="mb-15px text-[18px]">Course Reviews</h4>
                <hr className="my-4" />
                {course.summary}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Page;
