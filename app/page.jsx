"use client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IMAGES } from "@/constants";
import VideoModal from "@/components/VideoModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@mui/material";
import { logoutAfterSixHours } from "@/utils/utilFunctions";
import { useFetch } from "@/hooks/useHttp/useHttp";
import Loader from "@/components/Loader";

function Page() {
  const router = useRouter();
  const searchRef = useRef(null);
  const [searchVariable, setSearchVariable] = useState("");
  const [FAQs, setFAQs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const { data: quotesList, isLoading } = useFetch("quotes", `/quotes`);
  const [quotes, setQuotes] = useState(null);
  useEffect(() => {
    if (quotesList?.data?.length) {
      const randomIndex = Math.floor(Math.random() * quotesList?.data?.length);
      setQuotes(quotesList?.data[randomIndex]);
    }
  }, [quotesList]);

  const slides = [
    <span key="1">
      We mentor from <span className="text-primary"> ZERO </span> or little experience to{" "}
      <span className="text-primary"> JOB </span> and{" "}
      <span className="text-primary">PROFESSIONALISM</span>
    </span>,
    ,
    <span key="2">
      Mentorship is
      <span className="text-primary"> KEY </span> to unlocking your
      <span className="text-primary"> POTENTIALS </span> and achieving your
      <span className="text-primary"> GOALS </span>
    </span>,
    <span key="3">
      The Right
      <span className="text-primary"> COUNSELLOR </span> will help resolve the concerns between you
      and your
      <span className="text-primary"> GOALS </span>
    </span>,
  ];
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    fade: true,
  };
  // Fetch suggested courses
  const fetchSuggestedCourses = async () => {
    const courseResponse = await fetch(`https://yrms-api.onrender.com/api/courses`);
    const course = await courseResponse.json();
    setSuggestedCourses(course.results);
  };
  // Fetch Data
  const fetchData = async () => {
    try {
      // Courses
      const coursesResponse = await fetch("https://yrms-api.onrender.com/api/courses");
      const courses = await coursesResponse.json();
      setCourses(courses.result);
      // FAQs
      const FAQsResponse = await fetch("https://yrms-api.onrender.com/api/faqs");
      const FAQs = await FAQsResponse.json();
      setFAQs(FAQs.results);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Fetch data
    fetchData();
    fetchSuggestedCourses();
    // Log out after 6 hours
    logoutAfterSixHours();
  }, []);
  useEffect(() => {
    if (searchVariable.length >= 3) {
      fetchSuggestedCourses(searchVariable);
    } else {
      setSuggestedCourses([]);
    }
  }, [searchVariable]);
  const handleSearchChange = (e) => {
    setSearchVariable(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your form submission logic here
  };
  return (
    <div>
      <div className="relative">
        {/* Header */}
        <Header />

        {/* main */}
        <main className="">
          {/* Hero */}
          <section className="flex flex-col lg:flex-row text-sm px-6 py-4 gap-4 items-center w-screen justify-center  max-w-[1500px] mx-auto">
            {/* Hero left */}
            <div className="flex-1 text-center lg:text-left w-full">
              <div
                className="text-[55px] font-extrabold text-neutral-800 lg:mt-4 w-full lg:max-w-[600px] leading-[32px]"
                style={{ lineHeight: "1.5" }}
              >
                <Slider {...settings}>
                  {slides.map((slide, index) => (
                    <div key={index} className="slide">
                      <h2>{slide}</h2>
                    </div>
                  ))}
                </Slider>
              </div>
              <div className="py-2 text-neutral-700">
                The Right COUNSELLOR will help resolve all the concerns that stand between you and
                your GOALS.
              </div>

              <div className="py-2">
                <form
                  action=""
                  method="post"
                  className="w-full flex flex-col sm:flex-row justify-center gap-2 relative"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full border border-red-600 rounded-md py-2 px-2">
                    <input
                      type="text"
                      placeholder="Search for mentors, courses, books..."
                      className="flex-1 outline-none bg-transparent border-none w-full"
                      ref={searchRef}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div
                    className={`absolute top-12 left-0 bg-gray-200 rounded z-10 w-[calc(100%)]
            sm:w-[calc(100%-78px)] 
            ${searchVariable.length >= 3 ? "block" : "hidden"}`}
                  >
                    <ul className="w-full">
                      {suggestedCourses?.slice(0, 6).map((course, index) => (
                        <li key={index} className="py-2 px-2 hover:bg-gray-300 cursor-pointer">
                          <Link href={`/courses/${course.id}`}>{course.title}</Link>
                        </li>
                      ))}
                      <li className="py-2 px-2">
                        Can't find what you are looking for?{" "}
                        <Link href="/courses" className="link">
                          Click here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>

            {/* Hero right */}
            <div className="flex-1 ">
              <Image src={IMAGES.banner1} width={500} height={500} alt="Your-right-mentors" />
            </div>
          </section>

          {/* Quotes */}
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {quotes && (
                <section className="py-6 px-4">
                  <div className="text-center text-primary py-3 text-sm">Daily Quote</div>
                  <div>
                    <div className="text-center text-2xl font-bold text-neutral-800 flex justify-center">
                      {quotes?.content || (
                        <Skeleton animation="wave" width={500} height={60} className="block" />
                      )}
                    </div>
                    <div className="text-center text-sm text-neutral-700 py-4 flex justify-center">
                      {quotes?.quote_author || (
                        <Skeleton animation="wave" width={200} height={30} className="block" />
                      )}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}

          {/* Intro video */}
          <section className="py-4">
            <div className="text-center text-primary py-3 text-sm">Intro</div>
            <VideoModal url={"videos/intro.mp4"} />
          </section>

          {/* FAQ */}
          <section className="py-6 flex flex-col justify-center items-center">
            <div className="text-center text-primary py-3 text-sm">Frequently Asked Questions</div>
            <div className="w-4/5 max-w-[850px] text-sm">
              {FAQs && (
                <>
                  {FAQs?.map((faq) => {
                    return (
                      <Accordion key={faq?.id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          {faq?.title}
                        </AccordionSummary>
                        <AccordionDetails>{faq?.content}</AccordionDetails>
                      </Accordion>
                    );
                  })}
                </>
              )}
            </div>
          </section>

          {/* COURSES */}
          <section className="py-6 w-full">
            {/* Top */}
            <div className="text-center max-w-[500px] m-auto">
              <p className="uppercase text-primary text-sm">Courses</p>
              <p className="font-bold text-2xl py-2">Check Out Our Certified Courses</p>
              <p className="text-sm text-gray-500">
                Our courses are consistently updated with information that can help you.
              </p>
            </div>
            {/* Bottom */}
            <div className="flex flex-wrap justify-center gap-6 flex-col md:flex-row items-center ">
              {courses && (
                <>
                  {courses?.slice(0, 6)?.map((course) => {
                    return (
                      <Link
                        key={course?.id}
                        href={`/courses/${course?.id}`}
                        className="group border w-1/4 min-w-[300px] max-w-[500px] rounded-md overflow-hidden cursor-pointer  shadow-md  hover:bg-neutral-200  transition-all duration-300 lg:mt-4 "
                      >
                        <div className="overflow-hidden">
                          <Image
                            src={course?.blog_image || IMAGES.logo}
                            alt={course?.title}
                            width={500}
                            height={300}
                            className="group-hover:scale-150 duration-300"
                          />
                        </div>
                        <div className="px-2 py-2 text-sm">
                          <div className="uppercase text-gray-700">{course?.category}</div>
                          <div className="capitalize font-bold  py-2 text-xl h-[72px] ">
                            {course?.title.slice(0, 40)} {course?.title.length > 40 ? "..." : ""}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={course?.author?.image || IMAGES.logo}
                                alt="author"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                              <div className="text-primary text-xs">{course?.instructor_name}</div>
                            </div>
                            {/* Date */}
                            {/* <div className="flex items-center gap-1">
                          <div>
                            <DateRangeIcon
                              className="text-gray-400 "
                              sx={{ fontSize: 18 }}
                            />
                          </div>
                          <div className="text-gray-500 text-xs">
                            
                            {formatDate(post.created_at)}
                          </div>
                        </div> */}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Page;
