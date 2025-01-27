"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  //   height: "80%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: ".5px solid #333333",
  boxShadow: 24,
  borderRadius: 3,
  p: 2,
  //   oveflow: "scroll",
};

export default function ModalWhyUs() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div onClick={handleOpen}>Read More</div>
      <Modal open={open} onClose={handleClose} sx={{ overflowY: "scroll" }}>
        <Box sx={style}>
          <div className="flex justify-between items-center ">
            <span className="text-primary">Why choose us</span>
            <span className="cursor-pointer hover:text-red-500 duration-300">
              <CloseIcon onClick={handleClose} sx={{ fontSize: 30 }} />
            </span>
          </div>
          <Divider className="py-2" />
          <div className="text-sm">
            <ul>
              <li className="py-2">
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
                </span>
              </li>
            </ul>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
