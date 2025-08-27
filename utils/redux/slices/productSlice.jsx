import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { http2 } from "@/hooks/axios/axios";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      const response = await http2.get(
        `/products/products/?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Async thunk to create product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      const response = await http2.post("/products/products/", productData);

      // Refetch products to get the latest data
      dispatch(fetchProducts({ page: 1, pageSize: 10 }));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Async thunk to update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await http2.put(
        `/products/products/${id}/`,
        productData
      );

      // Refetch products to get the latest data
      dispatch(fetchProducts({ page: 1, pageSize: 10 }));

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Async thunk to delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      await http2.delete(`/products/products/${productId}/`);

      // Refetch products to get the latest data
      dispatch(fetchProducts({ page: 1, pageSize: 10 }));

      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// Async thunk to fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await http2.get(`/products/products/${productId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentProduct: null,
    status: "idle",
    error: null,
    pagination: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    },
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.results;
        state.pagination = {
          total: action.payload.count,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
          pageSize: action.payload.page_size,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create product";
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update product";
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete product";
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch product details";
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
