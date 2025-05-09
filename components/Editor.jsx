"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useField } from "formik";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    [{ direction: "rtl" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const Editor = ({ name, className }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <ReactQuill
      value={field.value}
      onChange={(val) => helpers.setValue(val)}
      modules={modules}
      theme="snow"
      className={`border-0 p-0 m-0 ${className}`}
      placeholder="Type in English or Arabic..."
    />
  );
};

export default Editor;
