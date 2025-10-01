"use client";
import React, { useState } from "react";
import { useFetch, useDelete } from "@/hooks/useHttp/useHttp";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  MenuItem,
  Menu,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import { Add, MoreVert } from "@mui/icons-material";
import CategoriesForm from "./CategoriesForm";

const NewsletterCategories = () => {
  const queryClient = useQueryClient();
  const [categoryPage, setCategoryPage] = useState(1);
  const [openCategoryUpdateModal, setCategoryOpenUpdateModal] = useState(false);
  const [openCategoryDeleteDialog, setCategoryOpenDeleteDialog] =
    useState(false);
  const [categoryTotalCount, setCategoryTotalCount] = useState(0);
  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategoryCreateModal, setCategoryOpenCreateModal] = useState(false);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "categories",
    `https://ihsaanlms.onrender.com/newsletter/api/categories/?page_size=15&page=${categoryPage}`,
    (data) => {
      if (data?.total) {
        setCategoryTotalCount(data.total);
      }
    }
  );

  const categories = data?.data?.results || [];

  // DELETE CATEGORY
  const { mutate: deleteCategory, isLoading: isDeleting } = useDelete(
    `https://ihsaanlms.onrender.com/newsletter/api/categories`,
    {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        queryClient.refetchQueries("categories");
        refetch();
        setCategoryOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    }
  );

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setCategoryPage(newPage);
    refetch();
  };

  const handleDelete = () => {
    if (selectedCategory?.id) {
      deleteCategory(`${selectedCategory.id}`);
    }
  };

  // Handle Menu Open
  const handleMenuOpen = (event, category) => {
    setSelectedCategory(category);
    setCategoryMenuAnchorEl(event.currentTarget);
  };

  // Handle Menu Close
  const handleMenuClose = () => {
    setCategoryMenuAnchorEl(null);
  };

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setCategoryOpenCreateModal(true);
          }}
          className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 normal-case font-semibold px-6"
        >
          Create Category
        </Button>
      </div>
      <div className="w-full">
        <div className="w-full">
          <TableContainer component={Paper} className="w-full">
            <Table className="w-full table-auto">
              <TableHead>
                <TableRow>
                  <TableCell className="text-nowrap font-bold">Name</TableCell>
                  <TableCell className="text-nowrap font-bold">
                    Description
                  </TableCell>
                  <TableCell className="text-nowrap font-bold">
                    Frequency
                  </TableCell>
                  <TableCell className="text-nowrap font-bold">
                    Date Created
                  </TableCell>
                  <TableCell className="text-nowrap font-bold">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex items-center justify-center gap-2 py-4">
                        <Loader />
                        <p className="animate-pulse">Loading...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isFetching && categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
                {!isFetching &&
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="capitalize">
                        {category.name.toLowerCase()}
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="capitalize">
                        {category.frequency.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenuOpen(event, category)}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={categoryMenuAnchorEl}
                          open={Boolean(categoryMenuAnchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => {
                              setCategoryOpenUpdateModal(true);
                              handleMenuClose();
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setCategoryOpenDeleteDialog(true);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(categoryTotalCount / 15)}
          page={categoryPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />

        {/* Delete Confirmation Modal */}
        <CustomModal
          open={openCategoryDeleteDialog}
          onClose={() => setCategoryOpenDeleteDialog(false)}
          title="Confirm Delete"
          onConfirm={handleDelete}
          confirmText="Delete"
          isLoading={isDeleting}
        >
          <p>
            Are you sure you want to delete this category{" "}
            <strong>{selectedCategory?.name} </strong>?
          </p>
        </CustomModal>

        {/* Create Category Modal */}
        <Dialog
          open={openCategoryCreateModal}
          onClose={() => setCategoryOpenCreateModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create Category</DialogTitle>
          <DialogContent>
            <CategoriesForm
              onClose={() => setCategoryOpenCreateModal(false)}
              onSuccess={() => {
                setCategoryOpenCreateModal(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Update Category Modal */}
        <Dialog
          open={openCategoryUpdateModal}
          onClose={() => setCategoryOpenUpdateModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <CategoriesForm
              category={selectedCategory}
              isEdit={true}
              onClose={() => setCategoryOpenUpdateModal(false)}
              onSuccess={() => {
                setCategoryOpenUpdateModal(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default NewsletterCategories;
