"use client";

import { useEffect, useState } from "react";

function Page() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const generateFetchData = async () => {
    try {
      const response = await fetch("/api/resources/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const fetchedData = await response.json();
      console.log(fetchedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const formData = new FormData(e.target);
      // const data = Object.fromEntries(formData.entries());

      // const { file: myfile } = { ...data };

      // console.log("Local file");
      // console.log(myfile);
      // console.log("Global File");
      // console.log(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", "Test Title");
      formData.append("type", "IMAGE");

      const response = await fetch("/api/resources/", {
        method: "POST",
        // body: file,
        body: formData,
      });
      const fetchedData = await response.json();
      const { media_url } = { ...fetchedData };

      console.log({ ...fetchedData });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // generateFetchData();
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      {/* Form to upload image */}
      <form
        // action="/api/resources/"
        onSubmit={handleSubmit}
        // method="POST"
        // encType="multipart/form-data"
      >
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Page;
