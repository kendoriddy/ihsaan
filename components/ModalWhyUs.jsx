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
          <div className="flex justify-between items-center mt-7">
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
