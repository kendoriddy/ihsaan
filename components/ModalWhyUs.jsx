"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

function ModalWhyUs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(false);
  const stopPropagation = (e) => e.stopPropagation();

  return (
<<<<<<< HEAD
    <div className="text-sm">
      <div onClick={openModal} className="cursor-pointer link">
=======
    <div className="test-sm ">
      <div onClick={openModal} className=" cursor-pointer link">
>>>>>>> 18fd2aa (initial)
        Read more ...
      </div>

      <div
        className={`${
          isModalOpen ? "flex" : "hidden"
        } fixed top-0 left-0 w-screen h-full bg-neutral-800/80 z-20 justify-center items-center `}
<<<<<<< HEAD
        onClick={closeModal}
      >
        <div
          className="w-4/5 max-w-[500px] rounded-md bg-neutral-50 p-4 overflow-y-scroll h-3/4 z-30"
          onClick={(e) => stopPropagation(e)}
        >
          <div className="flex justify-between items-center">
            <span className="text-primary">Why Choose Us</span>
=======
        onClick={closeModal}>
        <div
          className="w-4/5 max-w-[500px] rounded-md bg-neutral-50 p-4 overflow-y-scroll h-3/4  z-30"
          onClick={(e) => stopPropagation(e)}>
          <div className=" flex justify-between items-center">
            <span className="text-primary">Why choose us</span>
>>>>>>> 18fd2aa (initial)
            <span className="cursor-pointer navlink">
              <CloseIcon onClick={closeModal} sx={{ fontSize: 30 }} />
            </span>
          </div>
          <Divider className="py-2" />
          <div className="text-sm">
            <ul>
              <li className="py-2">
<<<<<<< HEAD
                <span className="font-bold">Authentic Islamic Education: </span>
                <span>
                  Our curriculum is rooted in authentic Islamic teachings, ensuring students receive
                  accurate and reliable knowledge.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Experienced Instructors: </span>
                <span>
                  Our teachers are well-trained in Arabic and Islamic studies, bringing years of
                  experience to help students excel.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Flexible Learning Options: </span>
                <span>
                  We offer both online and in-person classes to cater to students from different
                  backgrounds and schedules.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Comprehensive Curriculum: </span>
                <span>
                  From Arabic language to Qur’anic studies and Fiqh, our courses cover essential
                  aspects of Islamic knowledge.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Interactive Learning: </span>
                <span>
                  Our lessons incorporate interactive activities to make learning engaging and
                  effective.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Affordable Tuition: </span>
                <span>
                  We strive to make Islamic education accessible to everyone by offering affordable
                  courses without compromising quality.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Ethical and Spiritual Development: </span>
                <span>
                  Beyond academics, we focus on character-building and spiritual growth to nurture
                  well-rounded individuals.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Supportive Learning Environment: </span>
                <span>
                  Our teachers and staff are committed to providing a welcoming and encouraging
                  atmosphere for all students.
=======
                <span className="font-bold">Affordable services: </span>
                <span>
                  our products and services are designed to be affordable for
                  everyone, so you can get professional mentoring experience,
                  courses and books without breaking the bank.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">
                  Professionals with years of experience:{" "}
                </span>
                <span>
                  Our mentors are industry experts who have years of experience
                  in their fields. They know exactly what you need to succeed.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Trained mentors: </span>
                <span>
                  All of our mentors have undergone adequate training to ensure
                  they can provide the best mentoring experience while upholding
                  professional ethics.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Multiple available mentors: </span>
                <span>
                  You are not limited to just few mentors. You have access to
                  variety of mentors from different parts of the world.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Exquisite program: </span>
                <span>
                  We have one of the best mentor-mentee programmes in the world.
                  We monitor the mentorship relationship and give all the
                  supports needed to make sure it is successful.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">
                  Simple and user-friendly platform:{" "}
                </span>
                <span>
                  We put a lot of thoughts into creating a platform that is easy
                  to navigate and understand. We designed it to be simple to
                  use, so you can focus on your mentoring experience instead of
                  struggling with complicated software.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">
                  Quick response to mentees' concerns:{" "}
                </span>
                <span>
                  We provide swift response to mentees’ concerns since we know
                  that it will increase their satisfaction which is our major
                  concern. This will also ensure their mentorship programme is
                  scuccessful.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Trained mentors: </span>
                <span>
                  All of our mentors have undergone adequate training to ensure
                  they can provide the best mentoring experience while upholding
                  professional ethics.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Tailored training: </span>
                <span>
                  Another wonderful thing about our platform is that your mentor
                  holds your hand until you achieve your goal. If a method
                  fails, we invent another until you succeed.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Priviledge access: </span>
                <span>
                  On our platform, you have access to world-class professionals
                  who you may normally not have access to.
                </span>
              </li>
              <li className="py-2">
                <span className="font-bold">Confidential: </span>
                <span>
                  We value confidentiality and data protection. Thus, a number
                  of measures have been put in place to protect the information
                  of both the mentors and mentees.
>>>>>>> 18fd2aa (initial)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalWhyUs;
