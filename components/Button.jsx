"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Button = ({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  onClick,
  className,
  style,
}) => {
  const [ripples, setRipples] = useState([]);

  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded transition-all focus:outline-none overflow-hidden";

  const variantStyles = {
    contained: "text-white",
    outlined: "border-2",
    text: "",
  };

  const colorStyles = {
    primary: {
      contained: "theme-btn",
      outlined:
        "border-gray-500 text-gray-500 hover:bg-gray-50 active:bg-gray-100",
      text: "text-gray-500 hover:bg-gray-50 active:bg-gray-100",
    },
    secondary: {
      contained: "bg-blue-600 hover:bg-blue-600 active:bg-blue-700",
      outlined:
        "border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100",
      text: "text-blue-500 hover:bg-blue-50 active:bg-blue-100",
    },
  };

  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-5 py-3 text-lg",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  const handleRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
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
    baseStyles,
    variantStyles[variant],
    colorStyles[color][variant],
    sizeStyles[size],
    { [disabledStyles]: disabled },
    className
  );

  return (
    <button
      className={classes}
      style={style}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) {
          handleRipple(e);
          if (onClick) onClick(e);
        }
      }}>
      {children}
      <span className="absolute inset-0 overflow-hidden">
        {ripples.map((ripple) => (
          <span key={ripple.key} className="ripple" style={ripple.style} />
        ))}
      </span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  color: PropTypes.oneOf(["primary", "secondary"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Button;
