import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { http2 } from "@/hooks/axios/axios";

// Async thunk to fetch user notifications
export const fetchUserNotifications = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http2.get("/in-app-notification/notifications/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// Async thunk to fetch recent notifications
export const fetchRecentNotifications = createAsyncThunk(
  "notifications/fetchRecentNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http2.get(
        "/in-app-notification/notifications/recent/"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent notifications"
      );
    }
  }
);

// Async thunk to fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http2.get(
        "/in-app-notification/notifications/unread_count/"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

// Async thunk to fetch single notification by ID
export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchNotificationById",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await http2.get(
        `/in-app-notification/notifications/${notificationId}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notification details"
      );
    }
  }
);

// Async thunk to mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notification, { rejectWithValue }) => {
    try {
      const payload = {
        notification_ids: [notification.id],
      };

      const response = await http2.post(
        "/in-app-notification/notifications/mark_as_read/",
        payload
      );
      return { id: notification.id, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

// Async thunk to mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const notifications = state.notifications.notifications;

      // Get all unread notification IDs
      const unreadNotificationIds = notifications
        .filter((notification) => !notification.is_read)
        .map((notification) => notification.id);

      const payload = {
        notification_ids: unreadNotificationIds,
      };

      const response = await http2.post(
        "/in-app-notification/notifications/mark_all_as_read/",
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }
);

// Async thunk to delete notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await http2.delete(
        `/in-app-notification/notifications/${notificationId}/`
      );
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    recentNotifications: [],
    unreadCount: 0,
    selectedNotification: null,
    total_count: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    recentStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    unreadCountStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    fetchDetailStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    markReadStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    markAllReadStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    recentError: null,
    unreadCountError: null,
    fetchDetailError: null,
    markReadError: null,
    markAllReadError: null,
    deleteError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.recentError = null;
      state.unreadCountError = null;
      state.fetchDetailError = null;
      state.markReadError = null;
      state.markAllReadError = null;
      state.deleteError = null;
    },
    resetRecentStatus: (state) => {
      state.recentStatus = "idle";
      state.recentError = null;
    },
    resetUnreadCountStatus: (state) => {
      state.unreadCountStatus = "idle";
      state.unreadCountError = null;
    },
    resetFetchDetailStatus: (state) => {
      state.fetchDetailStatus = "idle";
      state.fetchDetailError = null;
    },
    resetMarkReadStatus: (state) => {
      state.markReadStatus = "idle";
      state.markReadError = null;
    },
    resetMarkAllReadStatus: (state) => {
      state.markAllReadStatus = "idle";
      state.markAllReadError = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchUserNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload.results || action.payload;
        state.total_count = action.payload.total || action.payload.length;
        state.error = null;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch notifications";
      })
      // Fetch recent notifications
      .addCase(fetchRecentNotifications.pending, (state) => {
        state.recentStatus = "loading";
        state.recentError = null;
      })
      .addCase(fetchRecentNotifications.fulfilled, (state, action) => {
        state.recentStatus = "succeeded";
        state.recentNotifications = action.payload.results || action.payload;
        state.recentError = null;
      })
      .addCase(fetchRecentNotifications.rejected, (state, action) => {
        state.recentStatus = "failed";
        state.recentError =
          action.payload || "Failed to fetch recent notifications";
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.unreadCountStatus = "loading";
        state.unreadCountError = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCountStatus = "succeeded";
        state.unreadCount =
          action.payload.count || action.payload.unread_count || 0;
        state.unreadCountError = null;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.unreadCountStatus = "failed";
        state.unreadCountError =
          action.payload || "Failed to fetch unread count";
      })
      // Fetch notification by ID
      .addCase(fetchNotificationById.pending, (state) => {
        state.fetchDetailStatus = "loading";
        state.fetchDetailError = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.fetchDetailStatus = "succeeded";
        state.selectedNotification = action.payload;
        state.fetchDetailError = null;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.fetchDetailStatus = "failed";
        state.fetchDetailError =
          action.payload || "Failed to fetch notification details";
      })
      // Mark notification as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.markReadStatus = "loading";
        state.markReadError = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markReadStatus = "succeeded";
        // Update the specific notification to mark it as read
        const notification = state.notifications.find(
          (n) => n.id === action.payload.id
        );
        if (notification) {
          notification.is_read = true;
          notification.isRead = true; // Also set camelCase for consistency
        }
        // Also update in recent notifications if it exists there
        const recentNotification = state.recentNotifications.find(
          (n) => n.id === action.payload.id
        );
        if (recentNotification) {
          recentNotification.is_read = true;
          recentNotification.isRead = true; // Also set camelCase for consistency
        }
        // Decrease unread count
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
        state.markReadError = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markReadStatus = "failed";
        state.markReadError =
          action.payload || "Failed to mark notification as read";
      })
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.markAllReadStatus = "loading";
        state.markAllReadError = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.markAllReadStatus = "succeeded";
        // Mark all notifications as read (set both property names for consistency)
        state.notifications.forEach((notification) => {
          notification.is_read = true;
          notification.isRead = true;
        });
        state.recentNotifications.forEach((notification) => {
          notification.is_read = true;
          notification.isRead = true;
        });
        // Reset unread count
        state.unreadCount = 0;
        state.markAllReadError = null;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.markAllReadStatus = "failed";
        state.markAllReadError =
          action.payload || "Failed to mark all notifications as read";
      })
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Remove the deleted notification from the list
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload
        );
        state.recentNotifications = state.recentNotifications.filter(
          (notification) => notification.id !== action.payload
        );
        state.deleteError = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete notification";
      });
  },
});

export const {
  clearErrors,
  resetRecentStatus,
  resetUnreadCountStatus,
  resetFetchDetailStatus,
  resetMarkReadStatus,
  resetMarkAllReadStatus,
  resetDeleteStatus,
  clearSelectedNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
