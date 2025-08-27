"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { fetchCourses } from "@/utils/redux/slices/courseSlice";
import {
  fetchProductById,
  updateProduct,
} from "@/utils/redux/slices/productSlice";
import { IMAGES } from "@/constants";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import { usePathname } from "next/navigation";

function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    type: "COURSE",
    course: "",
    book: "",
    category: "",
    is_active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const { courses } = useSelector((state) => state.course);
  const { currentProduct, status } = useSelector((state) => state.products);

  const [currentRoute, setCurrentRoute] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, coursesPerPage: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setProductData({
        title: currentProduct.title || "",
        description: currentProduct.description || "",
        price: currentProduct.price?.toString() || "",
        stock: currentProduct.stock?.toString() || "",
        image: currentProduct.image || "",
        type: currentProduct.type || "COURSE",
        course: currentProduct.course?.toString() || "",
        book: currentProduct.book?.toString() || "",
        category: currentProduct.category?.toString() || "",
        is_active: currentProduct.is_active ?? true,
      });
      setPreviewImage(currentProduct.image || "");
    }
  }, [currentProduct]);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const uploadImageToCloudinary = async (file) => {
    const token = localStorage.getItem("token");
    setImageUploadLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "IMAGE");

    try {
      const response = await fetch(
        "https://ihsaanlms.onrender.com/resource/course-materials/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.media_url) {
        setProductData((prev) => ({
          ...prev,
          image: data.media_url,
        }));
        setPreviewImage(data.media_url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      uploadImageToCloudinary(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.title || !productData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (productData.type === "COURSE" && !productData.course) {
      toast.error("Please select a course");
      return;
    }

    if (productData.type === "BOOK" && !productData.book) {
      toast.error("Please enter a book ID");
      return;
    }

    if (!productData.image) {
      toast.error("Please upload an image");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...productData,
        price: parseFloat(productData.price),
        stock: productData.stock ? parseInt(productData.stock) : null,
        course: productData.course ? parseInt(productData.course) : null,
        book: productData.book ? parseInt(productData.book) : null,
        category: productData.category ? parseInt(productData.category) : null,
      };

      await dispatch(
        updateProduct({ id: productId, productData: payload })
      ).unwrap();
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" && !currentProduct) {
    return (
      <div className="relative">
        <AdminDashboardHeader toggleSidebar={toggleSidebar} />
        <main className="flex relative">
          <AdminDashboardSidebar
            isSidebarOpen={isSidebarOpen}
            toggleOption={toggleOption}
            openSubMenuIndex={openSubMenuIndex}
            currentRoute={currentRoute}
          />
          <section className="lg:ml-[250px] w-screen px-2">
            <div className="p-4">
              <div className="text-center py-8">Loading...</div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        {/* Main Body */}
        <section
          className="lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          <div className="p-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <AiOutlineHome className="text-gray-500" />
              <span className="text-gray-500">/</span>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => router.push("/admin/products")}
              >
                Products
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-700">Edit Product</span>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={productData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock (optional)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty for unlimited"
                    min="0"
                  />
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type *
                  </label>
                  <select
                    name="type"
                    value={productData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="COURSE">Course</option>
                    <option value="BOOK">Book</option>
                  </select>
                </div>

                {/* Course Selection - Only show if type is COURSE */}
                {productData.type === "COURSE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course *
                    </label>
                    <select
                      name="course"
                      value={productData.course}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses?.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Book Selection - Only show if type is BOOK */}
                {productData.type === "BOOK" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book ID *
                    </label>
                    <input
                      type="number"
                      name="book"
                      value={productData.book}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter book ID"
                      required
                    />
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category ID
                  </label>
                  <input
                    type="number"
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category ID (optional)"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={imageUploadLoading}
                    />
                    {imageUploadLoading && (
                      <div className="text-blue-600">Uploading image...</div>
                    )}
                    {previewImage && (
                      <div className="w-32 h-32 relative">
                        <Image
                          src={previewImage}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={productData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading || status === "loading"}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading || status === "loading"
                      ? "Updating..."
                      : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/admin/products")}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
