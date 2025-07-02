import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for publishing/unpublishing a blog post
export const patchBlogPublishStatus = createAsyncThunk(
  "blog/patchBlogPublishStatus",
  async ({ post, is_published }, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/blogs/${post.id}/`,
        {
          title: post.title,
          slug: post.slug,
          content: post.content,
          display_pic_id: post.display_pic_id,
          is_published,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update publish status"
      );
    }
  }
);

// Async thunk for editing a blog post
export const editBlogPost = createAsyncThunk(
  "blog/editBlogPost",
  async (post, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/blogs/${post.id}/`,
        {
          title: post.title,
          slug: post.slug,
          content: post.content,
          display_pic_id: post.display_pic_id,
          is_published: post.is_published,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update blog post"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    patchStatus: "idle",
    patchError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(patchBlogPublishStatus.pending, (state) => {
        state.patchStatus = "loading";
        state.patchError = null;
      })
      .addCase(patchBlogPublishStatus.fulfilled, (state) => {
        state.patchStatus = "succeeded";
        state.patchError = null;
      })
      .addCase(patchBlogPublishStatus.rejected, (state, action) => {
        state.patchStatus = "failed";
        state.patchError = action.payload || "Failed to update publish status";
      })
      .addCase(editBlogPost.pending, (state) => {
        state.patchStatus = "loading";
        state.patchError = null;
      })
      .addCase(editBlogPost.fulfilled, (state) => {
        state.patchStatus = "succeeded";
        state.patchError = null;
      })
      .addCase(editBlogPost.rejected, (state, action) => {
        state.patchStatus = "failed";
        state.patchError = action.payload || "Failed to update blog post";
      });
  },
});

export default blogSlice.reducer;
