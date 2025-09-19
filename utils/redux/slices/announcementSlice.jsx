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

// Async thunk to fetch single announcement by ID
export const fetchAnnouncementById = createAsyncThunk(
  "announcements/fetchAnnouncementById",
  async (announcementId, { rejectWithValue }) => {
    try {
      const response = await http2.get(
        `/announcement/announcements/${announcementId}/`
      );
      console.log(response.data, "response.data!!!");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcement details"
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

// Async thunk to update announcement
export const updateAnnouncement = createAsyncThunk(
  "announcements/updateAnnouncement",
  async (
    { announcementId, announcementData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await http2.put(
        `/announcement/announcements/${announcementId}/`,
        announcementData
      );

      // Refetch announcements to get the latest data
      dispatch(fetchAnnouncements());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update announcement"
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
      const response = await http2.get("/course/courses/");
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
    selectedAnnouncement: null,
    courses: [],
    total_count: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    fetchDetailStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    createStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    updateStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    coursesStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    fetchDetailError: null,
    createError: null,
    updateError: null,
    deleteError: null,
    coursesError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.fetchDetailError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.coursesError = null;
    },
    resetFetchDetailStatus: (state) => {
      state.fetchDetailStatus = "idle";
      state.fetchDetailError = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    clearSelectedAnnouncement: (state) => {
      state.selectedAnnouncement = null;
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
      // Fetch announcement by ID
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.fetchDetailStatus = "loading";
        state.fetchDetailError = null;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.fetchDetailStatus = "succeeded";
        state.selectedAnnouncement = action.payload;
        state.fetchDetailError = null;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.fetchDetailStatus = "failed";
        state.fetchDetailError =
          action.payload || "Failed to fetch announcement details";
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
      // Update announcement
      .addCase(updateAnnouncement.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // Note: We don't update state here since we refetch the entire list
        state.updateError = null;
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update announcement";
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

export const {
  clearErrors,
  resetFetchDetailStatus,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  clearSelectedAnnouncement,
} = announcementSlice.actions;
export default announcementSlice.reducer;
