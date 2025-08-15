import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { http2 } from "@/hooks/axios/axios";

// Async thunk to fetch announcements
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAnnouncements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http2.get("/announcement/announcements/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcements"
      );
    }
  }
);

// Async thunk to create announcement
export const createAnnouncement = createAsyncThunk(
  "announcements/createAnnouncement",
  async (announcementData, { rejectWithValue, dispatch }) => {
    try {
      const response = await http2.post(
        "/announcement/announcements/",
        announcementData
      );

      // Refetch announcements to get the latest data
      dispatch(fetchAnnouncements());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create announcement"
      );
    }
  }
);

// Async thunk to delete announcement
export const deleteAnnouncement = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async (announcementId, { rejectWithValue }) => {
    try {
      await http2.delete(`/announcement/announcements/${announcementId}/`);
      return announcementId; // Return the ID to remove from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete announcement"
      );
    }
  }
);

// Async thunk to fetch courses for announcement creation
export const fetchCoursesForAnnouncements = createAsyncThunk(
  "announcements/fetchCoursesForAnnouncements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http2.get("/courses/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

const announcementSlice = createSlice({
  name: "announcements",
  initialState: {
    announcements: [],
    courses: [],
    total_count: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    createStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    coursesStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    createError: null,
    deleteError: null,
    coursesError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.deleteError = null;
      state.coursesError = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.announcements = action.payload.results || action.payload;
        state.total_count = action.payload.total;
        state.error = null;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch announcements";
      })
      // Create announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // Note: We don't add to state here since we refetch the entire list
        state.createError = null;
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create announcement";
      })
      // Delete announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Remove the deleted announcement from the list
        state.announcements = state.announcements.filter(
          (announcement) => announcement.id !== action.payload
        );
        state.deleteError = null;
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete announcement";
      })
      // Fetch courses
      .addCase(fetchCoursesForAnnouncements.pending, (state) => {
        state.coursesStatus = "loading";
        state.coursesError = null;
      })
      .addCase(fetchCoursesForAnnouncements.fulfilled, (state, action) => {
        state.coursesStatus = "succeeded";
        state.courses = action.payload.map((course) => ({
          id: course.id,
          title: course.title,
          studentCount: course.student_count || 0,
          ordinaryUserCount: course.ordinary_user_count || 0,
        }));
        state.coursesError = null;
      })
      .addCase(fetchCoursesForAnnouncements.rejected, (state, action) => {
        state.coursesStatus = "failed";
        state.coursesError = action.payload || "Failed to fetch courses";
        // Fallback to mock data if API fails
        state.courses = [
          {
            id: "1",
            title: "Arabic Grammar Fundamentals",
            studentCount: 45,
            ordinaryUserCount: 12,
          },
          {
            id: "2",
            title: "Tajweed Mastery Course",
            studentCount: 78,
            ordinaryUserCount: 23,
          },
          {
            id: "3",
            title: "Islamic History Overview",
            studentCount: 32,
            ordinaryUserCount: 8,
          },
        ];
      });
  },
});

export const { clearErrors, resetCreateStatus, resetDeleteStatus } =
  announcementSlice.actions;
export default announcementSlice.reducer;
