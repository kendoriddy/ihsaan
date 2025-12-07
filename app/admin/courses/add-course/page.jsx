"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import axios from "axios";
import { fetchProgrammes } from "@/utils/redux/slices/programmeSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { getAuthToken } from "@/hooks/axios/axios";
import { normalizeUrl } from "@/utils/utilFunctions";
import { useFetch } from "@/hooks/useHttp/useHttp";

function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    image_url: "",
    name: "",
    code: "",
    programme: "",
    term: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [previewImage, setPreviewImage] = useState(""); // Store preview image

  const { programmes } = useSelector((state) => state.programme);
  console.log(programmes, "programmes:");
  useEffect(() => {
    dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  // Fetch terms
  const { data: termsData, isLoading: termsLoading } = useFetch(
    "terms",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/`
  );
  const terms = termsData?.data?.results || [];

  useEffect(() => {
    let storedToken = localStorage.getItem("token");
    if (storedToken) {
      storedToken = storedToken.trim();
      setToken(storedToken);
      console.log("Token set in state:", storedToken);
    }
  }, []);

  const [imageUploadSuccessful, setImageUploadSuccessful] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    const token = getAuthToken();
    setImageUploadLoading(true);
    setImageUploadSuccessful(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "IMAGE");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/resource/course-materials/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      console.log("Upload result:", response);
      toast.success("Image uploaded successfully!");
      setImageUploadSuccessful(true);
      const normalizedUrl = normalizeUrl(response.data.media_url);
      setPreviewImage(normalizedUrl || response.data.media_url);
      return normalizedUrl || response.data.media_url;
    } catch (error) {
      console.error("Image upload error:", error.message);
      throw new Error("Failed to upload image: " + error.message);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log("File selected:", file.name);

        // Show preview immediately
        const localPreviewUrl = URL.createObjectURL(file);

        // Upload image to Cloudinary
        const mediaUrl = await uploadImageToCloudinary(file);
        setCourseData({ ...courseData, image_url: mediaUrl });

        // Revoke the preview URL after upload (optional, for memory cleanup)
        URL.revokeObjectURL(localPreviewUrl);
      } catch (error) {
        toast.error(
          error.message || "An error occurred during the file upload"
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare payload - term is optional, send null if empty, convert to number if selected
      const payload = {
        ...courseData,
        term: courseData.term ? parseInt(courseData.term, 10) : null,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response from server:", response.data);

      if (response.status === 201) {
        toast.success("Course creation successful!");

        router.push(`/admin/courses`);
      } else {
        throw new Error(
          response.data.detail ||
            response.data.message ||
            "Failed to create course"
        );
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
      setPreviewImage("");
      setImageUploadSuccessful(false);
      setCourseData({
        title: "",
        description: "",
        image_url: "",
        name: "",
        code: "",
        programme: "",
        term: "",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Title + Home Icon */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add Course</h1>
        <AiOutlineHome
          className="text-3xl text-gray-600 cursor-pointer hover:text-gray-900"
          onClick={() => router.push("/admin/courses")}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) =>
                setCourseData({ ...courseData, title: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) =>
                setCourseData({ ...courseData, description: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Order
            </label>
            <input
              type="number"
              value={courseData.order}
              onChange={(e) =>
                setCourseData({ ...courseData, order: Number(e.target.value) })
              }
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={courseData.name}
              onChange={(e) =>
                setCourseData({ ...courseData, name: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              type="text"
              value={courseData.code}
              onChange={(e) =>
                setCourseData({ ...courseData, code: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Programme
            </label>
            <select
              value={courseData.programme}
              onChange={(e) =>
                setCourseData({ ...courseData, programme: e.target.value })
              }
              required
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="" disabled>
                Select a programme
              </option>
              {programmes.map((programme) => (
                <option key={programme.id} value={programme.id}>
                  {programme.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Term <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <select
              value={courseData.term}
              onChange={(e) =>
                setCourseData({ ...courseData, term: e.target.value })
              }
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select a term (optional)</option>
              {termsLoading ? (
                <option disabled>Loading terms...</option>
              ) : terms.length > 0 ? (
                terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name} ({term.session?.year || "N/A"})
                    {term.is_active && " [ACTIVE]"}
                  </option>
                ))
              ) : (
                <option disabled>No terms found</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Caption
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
            {/* Show preview if an image is selected */}
            {previewImage && imageUploadSuccessful ? (
              <Image
                width={40}
                height={40}
                src={previewImage}
                alt="Preview"
                className="mt-3 w-40 h-40 object-cover border rounded-md"
              />
            ) : imageUploadLoading ? (
              <div>Loading...</div>
            ) : null}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save and Continue"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Page;
