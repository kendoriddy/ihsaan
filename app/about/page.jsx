"use client";
// Components
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainTop from "@/components/MainTop";
import { COURSES, IMAGES, breadcrumbData } from "@/constants";
import Image from "next/image";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ModalWhyUs from "@/components/ModalWhyUs";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";

function Page() {
  const [courses, setCourses] = useState([]);
  const [FAQs, setFAQs] = useState([]);

  // Fetch courses
  const fetchData = async () => {
    try {
      // Courses
      const coursesResponse = await fetch("/api/courses");
      const courses = await coursesResponse.json();
      setCourses(() => courses.courses);

      // FAQs
      const FAQsResponse = await fetch("/api/faqs");
      const FAQs = await FAQsResponse.json();
      setFAQs(FAQs.FAQs);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="relative">
        <Header />
        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData.about} />

          {/* Section 1 */}
          <section className="flex flex-col lg:flex-row py-4">
            {/* Left */}
            <div className="flex-1 ">
              <div className="flex flex-wrap p-8 max-w-[500px] m-auto">
                <Image
                  src={IMAGES.aboutImg1}
                  alt="about"
                  width={200}
                  className="w-1/2"
                />
                <Image
                  src={IMAGES.aboutImg2}
                  alt="about"
                  width={150}
                  className="w-1/2"
                />
                <Image
                  src={IMAGES.aboutImg3}
                  alt="about"
                  width={150}
                  className="w-1/2"
                />
                <Image
                  src={IMAGES.aboutImg4}
                  alt="about"
                  width={150}
                  className="w-1/2"
                />
              </div>
            </div>
            {/* Right */}
            <div className="flex-1 pr-6 px-3 text-sm">
              <div className="text-sm text-primary py-2">Who we are</div>
              <div className="py-4 font-bold text-2xl text-neutral-800">
<<<<<<< HEAD
                IHSAAN ACADEMIA is dedicated to providing high-quality Islamic
                education, focusing on Arabic, Quranic studies, and essential
                Islamic sciences.
              </div>
              <p className="py-2">
                Our mission is to equip students with profound knowledge of the
                Arabic language and Islamic teachings, ensuring they develop
                strong faith, character, and academic excellence.
              </p>
              <p>
                We offer structured courses in Quran recitation, Arabic grammar,
                Hadith, Fiqh, and more, making it accessible for learners at
                different levels to deepen their understanding of Islam.
=======
                Your Right Mentors (YRM) is a Mentorship Program, founded with
                the mission of providing support and guidance to students at all
                levels.
              </div>
              <p className="py-2">
                This platform was founded by Mr Oladitan Saliu who is an
                exceptional Software Engineer and AI Researcher and has acquired
                a decade of experience. Being a certified mentor himself, he has
                successfully mentored several individuals who are doing great in
                their respective domains.
              </p>
              <p>
                In order to make the world a better place, he decided to invite
                professionals around the world and recruit mentors to provide
                people with the best mentorship experience. Being an author who
                has published several beneficial books, those books and other
                resources would be displayed on the platform to help people
                achieve success and happiness which is the main goal of this
                platform.
>>>>>>> 18fd2aa (initial)
              </p>
              {/* Bottom */}
              <div className="flex flex-wrap py-4">
                <div className="w-1/2 flex items-center gap-2">
                  <SchoolIcon className="text-primary" />
<<<<<<< HEAD
                  <div className="text-lg">Qualified Scholars</div>
                </div>
                <div className="w-1/2 flex items-center gap-2">
                  <AccessTimeIcon className="text-primary" />
                  <div className="text-lg">Flexible Learning</div>
                </div>
                <div className="w-1/2 flex items-center gap-2 py-2">
                  <ConnectWithoutContactIcon className="text-primary" />
                  <div className="text-lg">Online & Offline Classes</div>
                </div>
                <div className="w-1/2 flex items-center gap-2 py-2">
                  <LocalLibraryIcon className="text-primary" />
                  <div className="text-lg">Comprehensive Curriculum</div>
=======
                  <div className="text-lg">Expert Trainers</div>
                </div>
                <div className="w-1/2 flex items-center gap-2">
                  <AccessTimeIcon className="text-primary" />
                  <div className="text-lg">Lifetime Access</div>
                </div>
                <div className="w-1/2 flex items-center gap-2 py-2">
                  <ConnectWithoutContactIcon className="text-primary" />
                  <div className="text-lg">Remote Learning</div>
                </div>
                <div className="w-1/2 flex items-center gap-2 py-2">
                  <LocalLibraryIcon className="text-primary" />
                  <div className="text-lg">Self Development</div>
>>>>>>> 18fd2aa (initial)
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="text-sm flex px-8 py-12 flex-col lg:flex-row justify-center gap-8">
            {/* Left */}
            <div className="">
              <div className="text-primary py-2">Why Choose Us</div>
              <div className="max-w-[500px]">
                <ul>
                  <li className="py-2">
<<<<<<< HEAD
                    <span className="font-bold">
                      Authentic Islamic Education:{" "}
                    </span>
                    <span>
                      Our curriculum is rooted in authentic Islamic teachings,
                      ensuring students receive accurate and reliable knowledge.
                    </span>
                  </li>
                  <li className="py-2">
                    <span className="font-bold">Experienced Instructors: </span>
                    <span>
                      Our teachers are well-trained in Arabic and Islamic
                      studies, bringing years of experience to help students
                      excel.
=======
                    <span className="font-bold">Affordable services: </span>
                    <span>
                      our products and services are designed to be affordable
                      for everyone, so you can get professional mentoring
                      experience, courses and books without breaking the bank.
>>>>>>> 18fd2aa (initial)
                    </span>
                  </li>
                  <li className="py-2">
                    <span className="font-bold">
<<<<<<< HEAD
                      Flexible Learning Options:{" "}
                    </span>
                    <span>
                      We offer both online and in-person classes to cater to
                      students from different backgrounds and schedules.
=======
                      Professionals with years of experience:{" "}
                    </span>
                    <span>
                      Our mentors are industry experts who have years of
                      experience in their fields. They know exactly what you
                      need to succeed.
                    </span>
                  </li>
                  <li className="py-2">
                    <span className="font-bold">Trained mentors: </span>
                    <span>
                      All of our mentors have undergone adequate training to
                      ensure they can provide the best mentoring experience
                      while upholding professional ethics.
>>>>>>> 18fd2aa (initial)
                    </span>
                  </li>
                </ul>

                <div>
                  <ModalWhyUs />
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="">
              <div>
                <Image
                  src={IMAGES.banner1}
                  width={300}
                  // height={300}
                  alt="banner"
                  className="m-auto"
                />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-8 flex flex-col lg:flex-row justify-center max-w-[1000px] m-auto items-center">
            {/* left */}
            <div className="flex-1">
              <div className="max-w-[400px] shadow-xl rounded-md py-6 px-4">
                <div className="bg-primary w-[100px] h-[100px] relative m-auto rounded-full p-4">
                  <Image
                    src={IMAGES.mission}
                    fill
                    alt="Our mission"
                    objectFit="contain"
                    className="p-4"
                  />
                </div>
                <div className="text-center py-4 font-bold">Our Mission</div>
                <div className="text-center">
<<<<<<< HEAD
                  At IHSAAN ACADEMIA, our mission is to provide accessible and
                  high-quality Islamic education, equipping students with a deep
                  understanding of Arabic, Qur'an, and Islamic sciences while
                  fostering a love for lifelong learning and spiritual growth.
=======
                  We aim to empower individuals to reach their full potential
                  through accessible and inclusive mentorship, fostering a world
                  where everyone can succeed and thrive.
>>>>>>> 18fd2aa (initial)
                </div>
              </div>
            </div>
            {/* right */}
            <div className="flex-1">
              <div className="max-w-[400px] shadow-xl rounded-md py-6 px-4">
                <div className="bg-primary w-[100px] h-[100px] relative m-auto rounded-full p-4">
                  <Image
                    src={IMAGES.vission}
                    fill
                    alt="Our mission"
                    objectFit="contain"
                    className="p-4"
                  />
                </div>
                <div className="text-center py-4 font-bold">Our Vission</div>
                <div className="text-center">
<<<<<<< HEAD
                  Our vision is to become a leading Islamic learning
                  institution, empowering students with authentic knowledge,
                  moral excellence, and a strong connection to their faith, so
                  they can contribute positively to their communities and the
                  world.
=======
                  To provide mentees with the resources, tools, encouragement
                  and guidance they need to achieve their goals and reach their
                  full potential.
>>>>>>> 18fd2aa (initial)
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-8">
            <div>
              {/* Top */}
              <div className="top max-w-[500px] mx-auto text-center">
                <div className="text-primary py-4">Courses</div>
<<<<<<< HEAD
                <div className="text-lg pb-2">Explore Our Islamic Courses</div>
                <div>
                  At IHSAAN ACADEMIA, we offer a diverse range of courses in
                  Arabic, Qur'an, and Islamic studies, tailored to different
                  levels of learners.
=======
                <div className="text-lg pb-2">
                  Different Professional Courses Available
                </div>
                <div>
                  Looking for something specific? Our platform offers a variety
                  of courses to choose from, covering a wide range of topics.
>>>>>>> 18fd2aa (initial)
                </div>
              </div>

              {/* Bottom */}
              <div className="bottom py-8">
                <div className="flex flex-wrap justify-center gap-6 flex-col md:flex-row items-center ">
                  {courses.slice(0, 6).map((course) => (
                    <Link
                      key={course?.id}
                      href={`/courses/${course?.id}`}
<<<<<<< HEAD
                      className="group border w-1/4 min-w-[300px] max-w-[500px] rounded-md overflow-hidden cursor-pointer  shadow-md  hover:bg-neutral-200  transition-all duration-300 lg:mt-4 "
                    >
=======
                      className="group border w-1/4 min-w-[300px] max-w-[500px] rounded-md overflow-hidden cursor-pointer  shadow-md  hover:bg-neutral-200  transition-all duration-300 lg:mt-4 ">
>>>>>>> 18fd2aa (initial)
                      <div className="h-[200px] w-full overflow-hidden relative">
                        <Image
                          src={course?.image || IMAGES.logo}
                          alt="course"
                          // width={250}
                          // height={200}
                          fill
                          objectFit="cover"
                          className="transform group-hover:scale-125 transition-all duration-600"
                        />
                      </div>
                      {/* Link Bottom */}
                      <div className="p-2">
                        <div className="font-bold py-2">
                          {course.title.slice(0, 25)}{" "}
                          {course.title.length > 25 ? "..." : ""}
                        </div>
                        <div className="text-sm">
                          <Rating
                            name="half-rating-read"
                            defaultValue={course.rating}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                        </div>
                        <div className="pt-4">
                          <span>
                            <CreditCardIcon className="text-neutral-400" />
                          </span>{" "}
                          <span>NGN</span>{" "}
                          {course.price.toLocaleString("en-US")}.00
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-6 pb-2 flex justify-center ">
                  <Link href="/courses" className="block theme-btn">
                    View all
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
<<<<<<< HEAD
          {/* <section className="py-6 flex flex-col justify-center items-center">
            <div className="text-center text-primary py-3 text-sm">Frequently Asked Questions</div>
=======
          <section className="py-6 flex flex-col justify-center items-center">
            <div className="text-center text-primary py-3 text-sm">
              Frequently Asked Questions
            </div>
>>>>>>> 18fd2aa (initial)
            <div className="w-4/5 max-w-[850px] text-sm">
              {FAQs.map((faq) => {
                return (
                  <Accordion key={faq.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
<<<<<<< HEAD
                      id="panel1-header"
                    >
=======
                      id="panel1-header">
>>>>>>> 18fd2aa (initial)
                      {faq?.title}
                    </AccordionSummary>
                    <AccordionDetails>{faq.content}</AccordionDetails>
                  </Accordion>
                );
              })}
<<<<<<< HEAD
            </div>
          </section> */}
=======

              {/* <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header">
                  What is “Your Right Mentors” all about?
                </AccordionSummary>
                <AccordionDetails>
                  Our mission is to provide a platform where mentors,
                  counsellors, and mentees can connect for growth and
                  development. We believe that mentorship and counselling are
                  powerful tools for personal and professional growth and we are
                  dedicated to making them accessible to everyone.
                </AccordionDetails>
              </Accordion> */}
            </div>
          </section>
>>>>>>> 18fd2aa (initial)
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Page;
