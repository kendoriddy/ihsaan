import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { http2 } from "@/hooks/axios/axios";

// Async thunk to get or create cart
export const getOrCreateCart = createAsyncThunk(
  "cart/getOrCreateCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http2.get("/products/carts/get-or-create/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get or create cart"
      );
    }
  }
);

// Async thunk to add item to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (
    { productId, quantity = 1 },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      // First, ensure we have a cart
      const state = getState();
      let cart = state.cart.cart;

      // If no cart exists, get or create one
      if (!cart || !cart.id) {
        const cartResponse = await dispatch(getOrCreateCart()).unwrap();
        cart = cartResponse;
      }

      const payload = {
        product_id: productId,
        quantity: quantity,
      };
      const response = await http2.post(
        `/products/carts/${cart.id}/add-item/`,
        payload
      );

      // Refresh cart data
      dispatch(getOrCreateCart());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

// Async thunk to remove item from cart
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ productId }, { rejectWithValue, dispatch, getState }) => {
    try {
      // First, ensure we have a cart
      const state = getState();
      let cart = state.cart.cart;

      // If no cart exists, get or create one
      if (!cart || !cart.id) {
        const cartResponse = await dispatch(getOrCreateCart()).unwrap();
        cart = cartResponse;
      }

      const payload = {
        product: productId,
      };

      const response = await http2.post(
        `/products/carts/${cart.id}/remove-item/`,
        payload
      );

      // Refresh cart data
      dispatch(getOrCreateCart());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

// Async thunk to checkout cart
export const checkoutCart = createAsyncThunk(
  "cart/checkoutCart",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      // First, ensure we have a cart
      const state = getState();
      let cart = state.cart.cart;

      // If no cart exists, get or create one
      if (!cart || !cart.id) {
        const cartResponse = await dispatch(getOrCreateCart()).unwrap();
        cart = cartResponse;
      }

      const response = await http2.post(`/products/carts/${cart.id}/checkout/`);

      // Refresh cart data after checkout
      dispatch(getOrCreateCart());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to checkout cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    status: "idle",
    error: null,
    itemCount: 0,
    totalAmount: 0,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.itemCount = 0;
      state.totalAmount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateItemCount: (state) => {
      if (state.cart && state.cart.items) {
        state.itemCount = state.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      } else {
        state.itemCount = 0;
      }
    },
    updateTotalAmount: (state) => {
      if (state.cart && state.cart.items) {
        state.totalAmount = state.cart.items.reduce(
          (total, item) =>
            total + parseFloat(item.product.price) * item.quantity,
          0
        );
      } else {
        state.totalAmount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get or create cart
      .addCase(getOrCreateCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOrCreateCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Handle the new response structure where cart is nested
        state.cart = action.payload.cart || action.payload;
        // Update derived state
        cartSlice.caseReducers.updateItemCount(state);
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(getOrCreateCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to get or create cart";
      })
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add item to cart";
      })
      // Remove item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeItemFromCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to remove item from cart";
      })
      // Checkout cart
      .addCase(checkoutCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to checkout cart";
      });
  },
});

export const { clearCart, clearError, updateItemCount, updateTotalAmount } =
  cartSlice.actions;
export default cartSlice.reducer;
