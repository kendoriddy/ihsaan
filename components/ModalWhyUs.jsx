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
    <div className="text-sm">
      <div onClick={openModal} className="cursor-pointer link">
        Read more ...
      </div>

      <div
        className={`${
          isModalOpen ? "flex" : "hidden"
        } fixed top-0 left-0 w-screen h-full bg-neutral-800/80 z-20 justify-center items-center `}
        onClick={closeModal}
      >
        <div
          className="w-4/5 max-w-[500px] rounded-md bg-neutral-50 p-4 overflow-y-scroll h-3/4 z-30"
          onClick={(e) => stopPropagation(e)}
        >
          <div className="flex justify-between items-center">
            <span className="text-primary">Why Choose Us</span>
            <span className="cursor-pointer navlink">
              <CloseIcon onClick={closeModal} sx={{ fontSize: 30 }} />
            </span>
          </div>
          <Divider className="py-2" />
          <div className="text-sm">
            <ul>
              <li className="py-2">
                <span className="font-bold">Authentic Islamic Education: </span>
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
                  Our teachers and staff are committed to providing a welcoming and encouraging
                  atmosphere for all students.
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
