"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Ripple = ({ children, className, style, onClick, disabled }) => {
  const [ripples, setRipples] = useState([]);

  const handleRipple = (event) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const rippleX = event.clientX - rect.left - rippleSize / 2;
    const rippleY = event.clientY - rect.top - rippleSize / 2;

    const newRipple = {
      key: Date.now(),
      style: {
        width: rippleSize,
        height: rippleSize,
        top: rippleY,
        left: rippleX,
      },
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    setTimeout(() => {
      setRipples((prevRipples) =>
        prevRipples.filter((r) => r.key !== newRipple.key)
      );
    }, 600);
  };

  const classes = clsx(
    "relative inline-flex items-center justify-center font-medium rounded transition-all focus:outline-none overflow-hidden",
    className
  );

  return (
    <div
      className={classes}
      style={style}
      onClick={(e) => {
        handleRipple(e);
        if (onClick) onClick(e);
      }}>
      {children}
      <span className="absolute inset-0 overflow-hidden">
        {ripples.map((ripple) => (
          <span key={ripple.key} className="ripple" style={ripple.style} />
        ))}
      </span>
    </div>
  );
};

Ripple.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Ripple;
