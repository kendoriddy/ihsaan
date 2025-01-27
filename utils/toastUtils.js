"use client";
export const showToast = (message, type = "info") => {
  const event = new CustomEvent("showToast", {
    detail: { message, type },
  });
  window.dispatchEvent(event);
};
