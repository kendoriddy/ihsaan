"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "@/utils/redux/slices/courseSlice";
import { addItemToCart } from "@/utils/redux/slices/cartSlice";
import { useFrontendCart } from "@/utils/FrontendCartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/constants";
import { toast } from "react-toastify";
import {
  StarIcon,
  ClockIcon,
  UserIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  ClockIcon as ClockIconSolid,
  UserIcon as UserIconSolid,
  PlayIcon as PlayIconSolid,
} from "@heroicons/react/24/solid";

export default function Courses() {
  const dispatch = useDispatch();
  const { courses, courseCount, totalPages } = useSelector(
    (state) => state.course
  );
  const courseStatus = useSelector((state) => state.course.status);
  const { itemCount, cart } = useSelector((state) => state.cart);
  const {
    addToCart: addToFrontendCart,
    getCartItemCount,
    getCartItems,
    isLoggedIn,
  } = useFrontendCart();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch courses on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(
          fetchCourses({
            page: currentPage,
            page_size: 12,
            search: debouncedSearch || null,
            programme: null,
          })
        ).unwrap();
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, currentPage, debouncedSearch]);

  // Handle add to cart
  const handleAddToCart = async (courseId) => {
    if (isLoggedIn) {
      // Logged-in user: use backend cart
      const existingItem = cart?.items?.find(
        (item) => item.product?.id === courseId
      );

      if (existingItem) {
        toast.info("This course is already in your cart!");
        return;
      }

      try {
        await dispatch(
          addItemToCart({ productId: courseId, quantity: 1 })
        ).unwrap();
        toast.success("Course added to cart successfully!");
      } catch (error) {
        toast.error(error || "Failed to add course to cart");
      }
    } else {
      // Non-logged-in user: use frontend cart
      const course = courses.find((c) => c.id === courseId);
      if (!course) {
        toast.error("Course not found");
        return;
      }

      const frontendCartItems = getCartItems();
      const existingItem = frontendCartItems.find(
        (item) => item.id === courseId
      );

      if (existingItem) {
        toast.info("This course is already in your cart!");
        return;
      }

      addToFrontendCart(course);
      toast.success("Course added to cart successfully!");
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || Number.parseFloat(price) === 0) return "Free";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number.parseFloat(price));
  };

  // Sort courses (search is handled by API)
  const sortedCourses = [...(courses || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          Number.parseFloat(a.price || 0) - Number.parseFloat(b.price || 0)
        );
      case "price-high":
        return (
          Number.parseFloat(b.price || 0) - Number.parseFloat(a.price || 0)
        );
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Courses
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Learn from the best instructors and advance your skills
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {courseCount || sortedCourses.length} course
                  {(courseCount || sortedCourses.length) !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="flex-1">
            {isLoading || courseStatus === "loading" ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : sortedCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Course Image */}
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={
                            course.image_url?.startsWith("http")
                              ? course.image_url
                              : IMAGES.course_1
                          }
                          alt={course.title || course.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white rounded-full p-3">
                            <PlayIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <h3
                          className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {course.title || course.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3">
                          {course.programme_name || "IHSAAN ACADEMIA"}
                        </p>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(course.price)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/courses/${course.id}`}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
                          >
                            View Details
                          </Link>
                          {(() => {
                            let existingItem;
                            let isInCart;

                            if (isLoggedIn) {
                              // Check backend cart for logged-in users
                              existingItem = cart?.items?.find(
                                (item) => item.product?.id === course.id
                              );
                              isInCart = !!existingItem;
                            } else {
                              // Check frontend cart for non-logged-in users
                              const frontendCartItems = getCartItems();
                              existingItem = frontendCartItems.find(
                                (item) => item.id === course.id
                              );
                              isInCart = !!existingItem;
                            }

                            return (
                              <button
                                onClick={() => handleAddToCart(course.id)}
                                disabled={isInCart}
                                className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                  isInCart
                                    ? "bg-green-600 text-white cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                              >
                                {isInCart ? "✓ In Cart" : "Add to Cart"}
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
