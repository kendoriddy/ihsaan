

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const PlayButton = () => {
  return (
    <>
      <style>
        {`
          .ripple-text-container {
            position: relative;
            display: inline-block;
            font-size: 36px;
          }

          .ripple-text {
            display: inline-block;
            position: relative;
            overflow: hidden;
            animation: ripple-animation 2s linear infinite;
          }

          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }

          .icon_container {
            position: relative;
            z-index: 1;
          }
        `}
      </style>
      <div className="ripple-text-container cursor-pointer">
        <div className="ripple-text">
          <span className="icon_container text-primary hover:text-red-600">
            <PlayArrowIcon />
          </span>
        </div>
      </div>
    </>
  );
};

export default PlayButton;
