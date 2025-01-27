"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { IMAGES } from "@/constants";
import Image from "next/image";
import PlayButton from "./AnimPlayButton";
import ReactPlayer from "react-player";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "60%",
  // minWidth: 800,
  // minheight: 600,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  // p: 4,
};

export default function VideoModal({ url }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div
        className="m-auto relative w-full max-w-[500px] group overflow-hidden px-2"
        onClick={handleOpen}>
        <div className="group-hover:scale-125 duration-300 relative w-full h-[350px]">
          <Image
            src={IMAGES.intro}
            fill
            alt="Intro video"
            className="m-auto"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton />
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <ReactPlayer
            className="react-player"
            url={url}
            width="100%"
            height="100%"
            controls={true}
          />
        </Box>
      </Modal>
    </div>
  );
}
