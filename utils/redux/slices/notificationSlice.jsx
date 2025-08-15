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

// Async thunk to mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notification, { rejectWithValue }) => {
    try {
      const payload = {
        title: notification.title || notification.message,
        message: notification.content || notification.message,
        notification_type: notification.notification_type || "ANNOUNCEMENT",
        is_read: true,
        action_url: notification.action_url || "",
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

      // Use the first notification as template for the payload
      const templateNotification = notifications[0] || {
        title: "All Notifications",
        message: "All notifications marked as read",
        notification_type: "ANNOUNCEMENT",
        action_url: "",
      };

      const payload = {
        title: templateNotification.title || templateNotification.message,
        message: templateNotification.content || templateNotification.message,
        notification_type:
          templateNotification.notification_type || "ANNOUNCEMENT",
        is_read: true,
        action_url: templateNotification.action_url || "",
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
    total_count: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    markReadStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    markAllReadStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    markReadError: null,
    markAllReadError: null,
    deleteError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.markReadError = null;
      state.markAllReadError = null;
      state.deleteError = null;
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
        // Mark all notifications as read
        state.notifications.forEach((notification) => {
          notification.is_read = true;
        });
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
  resetMarkReadStatus,
  resetMarkAllReadStatus,
  resetDeleteStatus,
} = notificationSlice.actions;

export default notificationSlice.reducer;
