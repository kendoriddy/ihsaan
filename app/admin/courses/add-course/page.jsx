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
  const [previewImage, setPreviewImage] = useState("");
  const [imageUploadSuccessful, setImageUploadSuccessful] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  
  // Dynamic State: Initialized empty to ensure we only use fetched data
  const [fileConfigs, setFileConfigs] = useState({});
  const [configLoaded, setConfigLoaded] = useState(false);

  const { programmes } = useSelector((state) => state.programme);

  // 1. Fetch Programmes
  useEffect(() => {
    dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  // 2. Fetch Terms
  const { data: termsData, isLoading: termsLoading } = useFetch(
    "terms",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/`
  );
  const terms = termsData?.data?.results || [];

  // 3. EFFECT: Fetch ALL 4 File Type Limits from API
  useEffect(() => {
    const fetchSecurityConfigs = async () => {
      let storedToken = localStorage.getItem("token");
      if (!storedToken) return;
      setToken(storedToken.trim());

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/resource/config/`,
          { headers: { Authorization: `Bearer ${storedToken.trim()}` } }
        );

        // Transform array [ {resource_type: 'IMAGE', max_size: 1048...} ] 
        // into object { IMAGE: 1048576, VIDEO: 52428800 }
        const mappedLimits = response.data.results.reduce((acc, item) => {
          acc[item.resource_type] = item.max_size;
          return acc;
        }, {});

        setFileConfigs(mappedLimits);
        setConfigLoaded(true);
        console.log("✅ Security Configs Loaded:", mappedLimits);
      } catch (error) {
        console.error("❌ Failed to fetch file limits.");
        toast.error("Critical: Could not load upload security settings.");
      }
    };

    fetchSecurityConfigs();
  }, []);

  const uploadToBunny = async (file, detectedType) => {
    let rawToken = getAuthToken() || token || localStorage.getItem("token");
    if (rawToken?.startsWith("Bearer ")) rawToken = rawToken.split(" ")[1];

    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", detectedType);
    formData.append("use_streaming", true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/resource/course-materials/`,
        formData,
        {
          headers: { Authorization: `Bearer ${rawToken.trim()}` },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`${detectedType} Progress: ${percent}%`);
          },
        }
      );
      
      setImageUploadSuccessful(true);
      toast.success(`${detectedType} upload successful!`);
      return response.data.media_url;
    } catch (error) {
      const is413 = error.response?.status === 413;
      toast.error(is413 ? "Server rejected file: Payload Too Large (413)." : "Upload failed.");
      throw error;
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!configLoaded) {
      toast.warn("Waiting for security configurations to load...");
      e.target.value = "";
      return;
    }

    // A. IDENTIFY FILE TYPE
    let detectedType = "DOCUMENT"; // Default
    if (file.type.startsWith("image/")) detectedType = "IMAGE";
    else if (file.type.startsWith("video/")) detectedType = "VIDEO";
    else if (file.type.startsWith("audio/")) detectedType = "AUDIO";
    else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) detectedType = "DOCUMENT";

    // B. FETCH LIMIT FOR THIS SPECIFIC TYPE
    const limit = fileConfigs[detectedType];

    if (!limit) {
      toast.error(`Error: No database limit set for ${detectedType} files.`);
      e.target.value = "";
      return;
    }

    // C. VALIDATE SIZE
    if (file.size > limit) {
      const limitMB = (limit / (1024 * 1024)).toFixed(2);
      toast.error(`File too large! Your limit for ${detectedType} is ${limitMB}MB.`);
      e.target.value = "";
      return;
    }

    try {
      // Show preview only if it's an image
      if (detectedType === "IMAGE") {
        setPreviewImage(URL.createObjectURL(file));
      }

      const mediaUrl = await uploadToBunny(file, detectedType);
      setCourseData({ ...courseData, image_url: mediaUrl });
    } catch (error) {
      setPreviewImage("");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.image_url) {
      return toast.error("Please upload the course material/image first.");
    }
    
    setIsLoading(true);
    try {
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

      if (response.status === 201) {
        toast.success("Course created successfully!");
        router.push(`/admin/courses`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add Course</h1>
        <AiOutlineHome
          className="text-3xl text-gray-600 cursor-pointer hover:text-gray-900"
          onClick={() => router.push("/admin/courses")}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} required className="mt-1 block w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={courseData.name} onChange={(e) => setCourseData({ ...courseData, name: e.target.value })} required className="mt-1 block w-full p-2 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={courseData.description} onChange={(e) => setCourseData({ ...courseData, description: e.target.value })} required className="mt-1 block w-full p-2 border rounded-md h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input type="text" value={courseData.code} onChange={(e) => setCourseData({ ...courseData, code: e.target.value })} required className="mt-1 block w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Programme</label>
              <select value={courseData.programme} onChange={(e) => setCourseData({ ...courseData, programme: e.target.value })} required className="mt-1 block w-full p-2 border rounded-md">
                <option value="" disabled>Select programme</option>
                {programmes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Term (Optional)</label>
            <select value={courseData.term} onChange={(e) => setCourseData({ ...courseData, term: e.target.value })} className="mt-1 block w-full p-2 border rounded-md">
              <option value="">Select term</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.session?.year})</option>)}
            </select>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Course Material <span className="text-xs font-normal text-gray-500">(Auto-validated by size)</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
            
            <div className="mt-4">
              {imageUploadLoading ? (
                <div className="flex items-center gap-2 text-primary font-medium">
                   <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                   Checking limit and uploading...
                </div>
              ) : previewImage && imageUploadSuccessful ? (
                <Image
                  width={160}
                  height={160}
                  src={previewImage}
                  alt="Preview"
                  className="w-40 h-40 object-cover border rounded-md shadow-sm"
                />
              ) : imageUploadSuccessful && (
                <div className="text-green-600 font-bold">✓ File ready for submission</div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isLoading || imageUploadLoading}
              className="bg-primary text-white px-10 py-2 rounded-md font-bold disabled:bg-gray-400"
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