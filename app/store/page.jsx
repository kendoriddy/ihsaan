"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/utils/redux/slices/productSlice";
import { getOrCreateCart, addItemToCart } from "@/utils/redux/slices/cartSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGES } from "@/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import { usePathname } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";

function Store() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const { products, status, pagination } = useSelector(
    (state) => state.products
  );
  const {
    cart,
    itemCount,
    status: cartStatus,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, pageSize: 12 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(getOrCreateCart());
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddToCart = async (productId) => {
    // Check if item already exists in cart
    const existingItem = cart?.items?.find(
      (item) => item.product.id === productId
    );

    if (existingItem) {
      toast.info("This item is already in your cart!");
      return;
    }

    try {
      await dispatch(addItemToCart({ productId, quantity: 1 })).unwrap();
      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.log("error:::", error);
      toast.error(error || "Failed to add item to cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || product.type === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      default:
        return 0;
    }
  });

  return (
    <div>
      <Header />
      <main className="flex relative">
        <DashboardSidebar currentRoute={currentRoute} />

        <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
          <div className="px-4 w-full py-8 lg:py-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Store</h1>
              <p className="text-gray-600">
                Discover amazing courses and books to enhance your learning
                journey
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full lg:w-auto">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <FilterListIcon className="text-gray-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Types</option>
                    <option value="COURSE">Courses</option>
                    <option value="BOOK">Books</option>
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* Cart Badge */}
                {/* <div className="relative">
                  <ShoppingCartIcon className="text-2xl text-gray-600" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div> */}
              </div>
            </div>

            {/* Products Grid */}
            {status === "loading" ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {sortedProducts?.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={
                            product.image?.startsWith("http")
                              ? product.image
                              : IMAGES.course_1
                          }
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              product.type === "COURSE"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.type}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        {product.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Category */}
                        {product.category && (
                          <p className="text-gray-500 text-xs mb-3">
                            {product.category.name}
                          </p>
                        )}

                        {/* Price and Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <StarIcon className="text-yellow-400 text-sm" />
                            <span className="text-sm text-gray-600 ml-1">
                              4.5
                            </span>
                          </div>
                          <span className="font-bold text-lg text-blue-600">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        {(() => {
                          const existingItem = cart?.items?.find(
                            (item) => item.product.id === product.id
                          );
                          const isInCart = !!existingItem;

                          return (
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={cartStatus === "loading" || isInCart}
                              className={`w-full py-2 px-4 rounded-lg transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                isInCart
                                  ? "bg-green-600 text-white cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {cartStatus === "loading"
                                ? "Adding..."
                                : isInCart
                                ? "✓ In Cart"
                                : "Add to Cart"}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Products Message */}
                {sortedProducts?.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Stack spacing={2}>
                      <Pagination
                        count={pagination.totalPages}
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                        page={currentPage}
                      />
                    </Stack>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Store;
