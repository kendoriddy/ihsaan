"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Button from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "@/utils/redux/slices/productSlice";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Image from "next/image";
import { IMAGES } from "@/constants";

function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentRoute, setCurrentRoute] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const {
    products,
    status,
    pagination: { total, totalPages },
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, pageSize: 10 }));
  }, [dispatch, currentPage]);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddProduct = () => {
    router.push("/admin/products/add-product");
  };

  const handleEditProduct = (productId) => {
    router.push(`/admin/products/edit-product?productId=${productId}`);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error || "An error occurred while deleting the product");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

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
          {/* Content Goes Here */}
          <div className="p-4">
            {/* Top */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Products</div>
              <div className="flex gap-2">
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-all duration-300 cursor-pointer"
                  onClick={handleAddProduct}
                >
                  Add Product
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
              <div className="p-2 font-bold bg-white">Products List</div>
              <table className="table-auto w-full rounded bg-gray-50">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Image</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Stock</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Created Date</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {status === "loading" ? (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : products && products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={product.id} className="even:bg-gray-100">
                        <td className="border px-4 py-2">
                          {(currentPage - 1) * 10 + index + 1}
                        </td>
                        <td className="border px-4 py-2">
                          <div className="w-16 h-16 relative">
                            <Image
                              src={
                                product.image?.startsWith("http")
                                  ? product.image
                                  : IMAGES.course_1
                              }
                              alt={product.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        </td>
                        <td className="border px-4 py-2 font-medium">
                          {product.title}
                        </td>
                        <td className="border px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              product.type === "COURSE"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.type}
                          </span>
                        </td>
                        <td className="border px-4 py-2">
                          {product.category?.name || "N/A"}
                        </td>
                        <td className="border px-4 py-2 font-semibold">
                          {formatPrice(product.price)}
                        </td>
                        <td className="border px-4 py-2">
                          {product.stock || "Unlimited"}
                        </td>
                        <td className="border px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              product.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="border px-4 py-2 text-sm">
                          {format(new Date(product.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex gap-2">
                            <div
                              className="px-3 py-1 border-2 border-primary hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300 rounded text-sm"
                              onClick={() => handleEditProduct(product.id)}
                            >
                              Edit
                            </div>
                            <div
                              className="bg-red-600 px-3 py-1 text-white cursor-pointer hover:bg-red-800 transition-all duration-300 rounded text-sm"
                              onClick={() => handleOpenDeleteModal(product.id)}
                            >
                              Delete
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-4 text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {status !== "loading" && total > 0 && (
              <section className="pt-4 pb-12">
                <div className="w-4/5 mx-auto border flex flex-col lg:flex-row justify-between items-center px-4 rounded">
                  <div>Total Products: {total}</div>
                  <div>
                    <Stack spacing={2} className="py-5">
                      <Pagination
                        count={totalPages}
                        variant="outlined"
                        shape="rounded"
                        onChange={handleChange}
                        page={currentPage}
                      />
                    </Stack>
                  </div>
                </div>
              </section>
            )}

            {/* Delete Confirmation Modal */}
            <Dialog
              open={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              aria-labelledby="delete-product-dialog-title"
              aria-describedby="delete-product-dialog-description"
            >
              <DialogTitle id="delete-product-dialog-title">
                Delete Product
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-product-dialog-description">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDeleteModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
