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
<<<<<<< HEAD
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
=======
>>>>>>> 18fd2aa (initial)

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
<<<<<<< HEAD
    <div key="1" className="p-0 text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#7e1a0b]">
        Enroll for fully online self-paced Arabic School and get Certified.
      </h1>
      <p>
        <span className="text-[#7e1a0b] block mt-2">
          Ibtidaaiyah (Primary), I'idaadiyah (Junior Sec), Thaanawiyah (Senior
          Sec)
        </span>
        <span className="block mt-2">
          المرحلة الابتدائية والإعدادية والثانوية
        </span>
      </p>
    </div>,
    <div key="2" className="p-4 text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#7e1a0b]">
        You can pick a Course or Module and get Certified in it.
      </h1>
      <p>
        <span className="text-[#7e1a0b] block mt-2">
          فقه (Jurisprudence), توحيد (Belief), نحو (Grammar), صرف (Morphology),
          تجويد (Qur'an Principles), حديث (Tradition) etc.
        </span>
      </p>
    </div>,
    <div key="3" className="p-4 text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#7e1a0b]">
        Create and Sell an Islamic Course on this Platform
      </h1>
      <p>
        <span className="text-[#7e1a0b] block mt-2">
          As a sound Islamic Tutor, you can create and sell your course on this
          platform (learn more)
        </span>
      </p>
    </div>,
  ];

  // Dummy data for new sections:
  const instructors = [
    {
      id: 1,
      name: "Sheikh Ahmed",
      subject: "Arabic & Islamic Studies",
      image:
        "https://cdn.sanity.io/images/7gucqrpj/production/fee103ecdeaf692228b2cee3811996e6478053b8-740x740.jpg",
    },
    {
      id: 2,
      name: "Ustaz Fatima",
      subject: "Quran Recitation",
      image:
        "https://cdn.sanity.io/images/7gucqrpj/production/fee103ecdeaf692228b2cee3811996e6478053b8-740x740.jpg",
    },
    {
      id: 3,
      name: "Dr. Yusuf",
      subject: "History & Culture",
      image:
        "https://cdn.sanity.io/images/7gucqrpj/production/fee103ecdeaf692228b2cee3811996e6478053b8-740x740.jpg",
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "IHSAAN ACADEMIA has transformed my learning journey. The passion and dedication of the instructors are unmatched.",
      author: "Aisha Bello",
      role: "Student",
    },
    {
      id: 2,
      quote:
        "An excellent blend of traditional Islamic teachings and modern education methods.",
      author: "Ali Musa",
      role: "Parent",
    },
    {
      id: 3,
      quote:
        "The quality of the courses and the supportive community at IHSAAN ACADEMIA are simply outstanding.",
      author: "Hassan Suleiman",
      role: "Alumni",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Quran Recitation Competition",
      date: "March 20, 2025",
      location: "Main Auditorium",
    },
    {
      id: 2,
      title: "Islamic History Workshop",
      date: "April 15, 2025",
      location: "Conference Hall",
    },
    {
      id: 3,
      title: "Arabic Language Bootcamp",
      date: "May 10, 2025",
      location: "Room 101",
    },
  ];

=======
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
>>>>>>> 18fd2aa (initial)
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
<<<<<<< HEAD
    const courseResponse = await fetch(
      `https://yrms-api.onrender.com/api/courses`
    );
=======
    const courseResponse = await fetch(`https://yrms-api.onrender.com/api/courses`);
>>>>>>> 18fd2aa (initial)
    const course = await courseResponse.json();
    setSuggestedCourses(course.results);
  };
  // Fetch Data
  const fetchData = async () => {
    try {
      // Courses
<<<<<<< HEAD
      const coursesResponse = await fetch(
        "https://yrms-api.onrender.com/api/courses"
      );
      const courses = await coursesResponse.json();
      setCourses(courses.result);
      // FAQs
      const FAQsResponse = await fetch(
        "https://yrms-api.onrender.com/api/faqs"
      );
=======
      const coursesResponse = await fetch("https://yrms-api.onrender.com/api/courses");
      const courses = await coursesResponse.json();
      setCourses(courses.result);
      // FAQs
      const FAQsResponse = await fetch("https://yrms-api.onrender.com/api/faqs");
>>>>>>> 18fd2aa (initial)
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
<<<<<<< HEAD
        <main className="max-w-full md:max-w-[90%] mx-auto px-2 md:px-6 py-10 overflow-hidden">
          {/* Hero */}
          <section className="flex flex-col lg:flex-row items-center gap-6 px-0 md:px-8 md:pr-0 lg:px-12 py-0 md:py-8">
            {/* Hero Left */}
            <div className="flex-1 text-center lg:text-left w-full">
              <div className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-neutral-800 w-[83%] m-auto lg:mt-4 lg:max-w-[600px]">
                <Slider
                  {...settings}
                  className="max-w-2xl mx-auto"
                  nextArrow={<div className="custom-arrow slick-next" />}
                  prevArrow={<div className="custom-arrow slick-prev" />}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="slide">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                        {slide}
                      </h2>
=======
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
>>>>>>> 18fd2aa (initial)
                    </div>
                  ))}
                </Slider>
              </div>
<<<<<<< HEAD

              <p className="py-2 text-neutral-700 text-sm sm:text-base">
                A place to strengthen faith and knowledge through quality
                Islamic education.
              </p>

              {/* Search Bar */}
=======
              <div className="py-2 text-neutral-700">
                The Right COUNSELLOR will help resolve all the concerns that stand between you and
                your GOALS.
              </div>

>>>>>>> 18fd2aa (initial)
              <div className="py-2">
                <form
                  action=""
                  method="post"
<<<<<<< HEAD
                  className="w-full flex flex-col sm:flex-row justify-start items-center gap-2"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full sm:w-[70%] border border-red-600 rounded-md py-2 px-3 flex items-center">
                    <input
                      type="text"
                      placeholder="Search for courses..."
                      className="flex-1 outline-none bg-transparent border-none w-full text-sm sm:text-base"
=======
                  className="w-full flex flex-col sm:flex-row justify-center gap-2 relative"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full border border-red-600 rounded-md py-2 px-2">
                    <input
                      type="text"
                      placeholder="Search for mentors, courses, books..."
                      className="flex-1 outline-none bg-transparent border-none w-full"
>>>>>>> 18fd2aa (initial)
                      ref={searchRef}
                      onChange={handleSearchChange}
                    />
                  </div>
<<<<<<< HEAD

                  {/* Search Suggestions */}
                  <div
                    className={`absolute top-12 left-0 bg-gray-200 rounded z-10 w-[calc(100%)] sm:w-[calc(70%-78px)] 
=======
                  <div
                    className={`absolute top-12 left-0 bg-gray-200 rounded z-10 w-[calc(100%)]
            sm:w-[calc(100%-78px)] 
>>>>>>> 18fd2aa (initial)
            ${searchVariable.length >= 3 ? "block" : "hidden"}`}
                  >
                    <ul className="w-full">
                      {suggestedCourses?.slice(0, 6).map((course, index) => (
<<<<<<< HEAD
                        <li
                          key={index}
                          className="py-2 px-2 hover:bg-gray-300 cursor-pointer"
                        >
                          <Link href={`/courses/${course.id}`}>
                            {course.title}
                          </Link>
=======
                        <li key={index} className="py-2 px-2 hover:bg-gray-300 cursor-pointer">
                          <Link href={`/courses/${course.id}`}>{course.title}</Link>
>>>>>>> 18fd2aa (initial)
                        </li>
                      ))}
                      <li className="py-2 px-2">
                        Can't find what you are looking for?{" "}
<<<<<<< HEAD
                        <Link
                          href="/courses"
                          className="text-blue-600 underline"
                        >
=======
                        <Link href="/courses" className="link">
>>>>>>> 18fd2aa (initial)
                          Click here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>

<<<<<<< HEAD
            {/* Hero Right - Image */}
            <div className="flex-1 flex justify-center pr-4">
              <Image
                src={IMAGES.banner1}
                width={500}
                height={500}
                alt="IHSAAN ACADEMIA Learning"
                className="w-[90%] md:w-[60%] lg:w-[500px] h-auto"
              />
            </div>
          </section>

          {/* Video Section (Intro Video) */}
          <section className="py-12 bg-gray-100">
            <div
              className="text-center mb-6"
              style={{ color: "#7e1a0b", fontWeight: "600" }}
            >
              Intro
            </div>
            <div className="flex justify-center">
              <div className="border-4 border-[#ff6600] rounded-lg overflow-hidden shadow-lg w-full max-w-3xl">
                <VideoModal url={"videos/intro.mp4"} />
              </div>
            </div>
          </section>

          {/* About IHSAAN ACADEMIA Section */}
          <section className="py-4 md:py-12 md:px-6 bg-white">
            <div className="md:max-w-[70%] mx-auto text-center">
              <h2
                className="text-3xl font-bold mb-0 py-4"
                style={{ color: "#7e1a0b" }}
              >
                About IHSAAN ACADEMIA
              </h2>
              <p className="text-lg text-gray-700">
                IHSAAN ACADEMIA is a dynamic Islamic school dedicated to
                providing comprehensive education in Arabic language, Quranic
                studies, and other subjects. We blend traditional Islamic
                teachings with modern educational methodologies to help our
                students excel academically and spiritually.
              </p>
              <p className="mt-4 text-gray-600 text-base">
                Our mission is to nurture a generation of knowledgeable,
                compassionate, and resilient individuals who carry forward the
                values of excellence and integrity.
              </p>
            </div>
          </section>

          <section className="py-6 bg-gray-100 mt-4">
            <div className="text-center text-primary py-3 text-3xl mb-4">
              Why Choose IHSAAN ACADEMIA?
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="p-4 border rounded-lg shadow-md w-80 text-center bg-white ml-6 mr-6 md:mx-0">
                <h3 className="font-bold text-lg"> Expert Teachers </h3>
                <p>
                  Learn from highly qualified and experienced Islamic scholars
                  and Arabic tutors.
                </p>
              </div>
              <div className="p-4 border rounded-lg shadow-md w-80 text-center bg-white ml-6 mr-6 md:mx-0">
                <h3 className="font-bold text-lg"> Flexible Learning </h3>
                <p>
                  Study at your own pace with our structured and interactive
                  courses.
                </p>
              </div>
              <div className="p-4 border rounded-lg shadow-md w-80 text-center bg-white ml-6 mr-6 md:mx-0">
                <h3 className="font-bold text-lg"> Community Support </h3>
                <p>
                  Join a like-minded community focused on personal and spiritual
                  growth.
                </p>
              </div>
            </div>
          </section>

          {/* Instructors Section */}
          <section className="py-12 px-0 md:px-6 bg-white">
            <div className="max-w-full md:max-w-[70%] mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: "#7e1a0b" }}>
                Meet Our Instructors
              </h2>
              <p className="text-gray-700 mt-4 text-base">
                Our passionate instructors bring together years of experience in
                Islamic studies, Arabic language, and more.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {instructors.map((inst) => (
                <div
                  key={inst.id}
                  className="w-64 bg-gray-50 rounded-lg shadow-lg p-6 text-center"
                >
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    width={120}
                    height={120}
                    className="mx-auto rounded-full mb-4"
                  />
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#7e1a0b" }}
                  >
                    {inst.name}
                  </h3>
                  <p className="text-gray-600">{inst.subject}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12 bg-gray-100">
            <div className="max-w-full md:max-w-[70%] mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: "#7e1a0b" }}>
                What Our Community Says
              </h2>
            </div>
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={7000}
              className="max-w-2xl mx-auto"
              nextArrow={<div className="custom-arrow slick-next" />}
              prevArrow={<div className="custom-arrow slick-prev" />}
            >
              {testimonials.map((testi) => (
                <div key={testi.id} className="px-2 md:px-6">
                  <blockquote className="italic text-lg text-gray-800 mb-4">
                    “{testi.quote}”
                  </blockquote>
                  <p className="font-bold" style={{ color: "#ff6600" }}>
                    {testi.author}
                  </p>
                  <p className="text-sm text-gray-600">{testi.role}</p>
                </div>
              ))}
            </Slider>
          </section>

          {/* Upcoming Events Section */}
          <section className="py-12 px-0 md:px-6 bg-white">
            <div className="max-w-full md:max-w-[70%] mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold" style={{ color: "#7e1a0b" }}>
                Upcoming Events
              </h2>
              <p className="text-gray-700 mt-4">
                Join us for our upcoming events and workshops to enrich your
                learning journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-6 shadow-md hover:shadow-xl transition"
                >
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#7e1a0b" }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-1">Date: {event.date}</p>
                  <p className="text-gray-600 mb-4">
                    Location: {event.location}
                  </p>
                  <Link
                    href="/events"
                    className="text-sm font-semibold"
                    style={{ color: "#ff6600" }}
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          {/* <section className="py-12">
            <div className="text-center mb-6" style={{ color: "#7e1a0b", fontWeight: "600" }}>
              Frequently Asked Questions
            </div>
            <div className="w-full max-w-3xl mx-auto">
              {FAQs &&
                FAQs.map((faq) => (
                  <Accordion
                    key={faq.id}
                    className="mb-4 rounded-md shadow-sm"
                    sx={{
                      border: "1px solid #ff6600",
                      "&::before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon style={{ color: "#ff6600" }} />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <span style={{ fontWeight: 600, color: "#7e1a0b" }}>{faq.title}</span>
                    </AccordionSummary>
                    <AccordionDetails style={{ color: "#555" }}>{faq.content}</AccordionDetails>
                  </Accordion>
                ))}
            </div>
          </section> */}

          {/* COURSES */}
          <section className="py-6 w-full">
            {/* Top */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <p
                className="uppercase text-sm"
                style={{ color: "#ff6600", letterSpacing: "0.1em" }}
              >
                Courses
              </p>
              <h2
                className="text-3xl font-bold py-2"
                style={{ color: "#7e1a0b" }}
              >
                Check Out Our Certified Courses
              </h2>
              <p className="text-sm text-gray-600">
                Our courses are consistently updated with information that can
                help you.
=======
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
>>>>>>> 18fd2aa (initial)
              </p>
            </div>
            {/* Bottom */}
            <div className="flex flex-wrap justify-center gap-6 flex-col md:flex-row items-center ">
              {courses && (
                <>
                  {courses?.slice(0, 6)?.map((course) => {
<<<<<<< HEAD
                    console.log(course, "coursess");
=======
>>>>>>> 18fd2aa (initial)
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
<<<<<<< HEAD
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="px-2 py-2 text-sm">
                          <div className="uppercase text-gray-700">
                            {course?.category}
                          </div>
                          <div className="capitalize font-bold  py-2 text-xl h-[72px] ">
                            {course?.title.slice(0, 40)}{" "}
                            {course?.title.length > 40 ? "..." : ""}
=======
                            className="group-hover:scale-150 duration-300"
                          />
                        </div>
                        <div className="px-2 py-2 text-sm">
                          <div className="uppercase text-gray-700">{course?.category}</div>
                          <div className="capitalize font-bold  py-2 text-xl h-[72px] ">
                            {course?.title.slice(0, 40)} {course?.title.length > 40 ? "..." : ""}
>>>>>>> 18fd2aa (initial)
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
<<<<<<< HEAD
                              <div className="text-primary text-xs">
                                {course?.instructor_name}
                              </div>
                            </div>
=======
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
>>>>>>> 18fd2aa (initial)
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
