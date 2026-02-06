import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthToken } from "@/hooks/axios/axios";
import axios from "axios";

// API endpoints
const LOGGED_IN_USER_ENDPOINT =
  "https://api.ihsaanacademia.com/api/auth/logged-in-user/";
const COURSE_ENROLLMENTS_ENDPOINT =
  "https://api.ihsaanacademia.com/course/course-enrollments/";
const PROGRAMMES_ENDPOINT = "https://api.ihsaanacademia.com/api/me/programmes/";

// Async thunk to fetch student's course enrollments
export const fetchStudentCourses = createAsyncThunk(
  "studentDashboard/fetchStudentCourses",
  async (_, { rejectWithValue }) => {
    try {
      const userResponse = await axios.get(LOGGED_IN_USER_ENDPOINT, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      // 1. VERIFY THIS ID: Does it match the UUIDs in your JSON?
      const userId = userResponse.data?.id; 
      
      if (!userId) return rejectWithValue("User ID not found");

      // 2. TRY CHANGING 'user_id' TO 'user' IF THE UUID FILTER FAILS
      const response = await axios.get(
        `${COURSE_ENROLLMENTS_ENDPOINT}?user=${userId}`, 
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );

      // 3. SECURE MAPPING
      // The JSON shows 'results' contains the enrollment objects
      const transformedCourses = (response.data.results || []).map((enrollment) => ({
        id: enrollment.course_details?.id,
        title: enrollment.course_details?.title || enrollment.course_details?.name,
        description: enrollment.course_details?.description,
        programme_name: enrollment.course_details?.programme_name,
        image_url: enrollment.course_details?.image_url,
        is_active: enrollment.is_active, // Use is_active directly from the root
        enrollment_id: enrollment.id,
        enrolled_at: enrollment.enrolled_at,
        term_name: enrollment.term_details?.name,
      }));

      return {
        courses: transformedCourses,
        total: response.data.total || 0,
        pagination: {
          next: response.data.links?.next, // Note: JSON has links.next, not data.next
          previous: response.data.links?.previous,
          current_page: response.data.current_page,
          total_pages: response.data.total_pages,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
  }
);

// Async thunk to fetch student's programmes
export const fetchStudentProgrammes = createAsyncThunk(
  "studentDashboard/fetchStudentProgrammes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(PROGRAMMES_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      // Transform the response to match our component's expected structure
      const transformedProgrammes = (response.data.results || []).map(
        (programme) => ({
          id: programme.programme_id,
          name: programme.programme_name,
          code: programme.programme_code,
          description: `Session: ${programme.session_year}`,
          is_paid:
            programme.payment_status === "PAID" ||
            programme.payment_status === "COMPLETED",
          is_active: programme.is_active,
          completed: programme.completed,
          enrollment_date: programme.enrollment_date,
          completion_date: programme.completion_date,
          payment_status: programme.payment_status,
          payment_amount: programme.payment_amount,
          payment_currency: programme.payment_currency,
          price: programme.price,
          currency: programme.currency,
          image_url: null, // Not provided in the API response
        })
      );

      return {
        programmes: transformedProgrammes,
        total: response.data.count || 0,
        pagination: {
          next: response.data.next,
          previous: response.data.previous,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student programmes"
      );
    }
  }
);

// Async thunk to fetch courses for a specific programme
export const fetchCoursesForProgramme = createAsyncThunk(
  "studentDashboard/fetchCoursesForProgramme",
  async (programmeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.ihsaanacademia.com/programmes/${programmeId}/courses/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses for programme"
      );
    }
  }
);

// Initial state
const initialState = {
  // Courses data
  courses: [],
  coursesStatus: "idle",
  coursesError: null,
  coursesPagination: {
    total: 0,
    next: null,
    previous: null,
    current_page: 1,
    total_pages: 0,
  },

  // Programmes data
  programmes: [],
  programmesStatus: "idle",
  programmesError: null,
  programmesPagination: {
    total: 0,
    next: null,
    previous: null,
  },

  // Programme courses data
  programmeCourses: [],
  programmeCoursesStatus: "idle",
  programmeCoursesError: null,
  selectedProgramme: null,

  // General loading state
  isLoading: false,
};

// Create the slice
const studentDashboardSlice = createSlice({
  name: "studentDashboard",
  initialState,
  reducers: {
    // Clear errors
    clearCoursesError: (state) => {
      state.coursesError = null;
    },
    clearProgrammesError: (state) => {
      state.programmesError = null;
    },
    clearProgrammeCoursesError: (state) => {
      state.programmeCoursesError = null;
    },

    // Set selected programme
    setSelectedProgramme: (state, action) => {
      state.selectedProgramme = action.payload;
    },

    // Clear selected programme and its courses
    clearSelectedProgramme: (state) => {
      state.selectedProgramme = null;
      state.programmeCourses = [];
      state.programmeCoursesStatus = "idle";
      state.programmeCoursesError = null;
    },

    // Reset all data
    resetDashboardData: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStudentCourses
      .addCase(fetchStudentCourses.pending, (state) => {
        state.coursesStatus = "loading";
        state.isLoading = true;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.coursesStatus = "succeeded";
        state.isLoading = false;
        state.courses = action.payload.courses;
        state.coursesPagination = action.payload.pagination;
        state.coursesError = null;
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.coursesStatus = "failed";
        state.isLoading = false;
        state.coursesError = action.payload;
      })

      // Handle fetchStudentProgrammes
      .addCase(fetchStudentProgrammes.pending, (state) => {
        state.programmesStatus = "loading";
        state.isLoading = true;
      })
      .addCase(fetchStudentProgrammes.fulfilled, (state, action) => {
        state.programmesStatus = "succeeded";
        state.isLoading = false;
        state.programmes = action.payload.programmes;
        state.programmesPagination = action.payload.pagination;
        state.programmesError = null;
      })
      .addCase(fetchStudentProgrammes.rejected, (state, action) => {
        state.programmesStatus = "failed";
        state.isLoading = false;
        state.programmesError = action.payload;
      })

      // Handle fetchCoursesForProgramme
      .addCase(fetchCoursesForProgramme.pending, (state) => {
        state.programmeCoursesStatus = "loading";
        state.isLoading = true;
      })
      .addCase(fetchCoursesForProgramme.fulfilled, (state, action) => {
        state.programmeCoursesStatus = "succeeded";
        state.isLoading = false;
        state.programmeCourses = action.payload;
        state.programmeCoursesError = null;
      })
      .addCase(fetchCoursesForProgramme.rejected, (state, action) => {
        state.programmeCoursesStatus = "failed";
        state.isLoading = false;
        state.programmeCoursesError = action.payload;
      });
  },
});

// Export actions
export const {
  clearCoursesError,
  clearProgrammesError,
  clearProgrammeCoursesError,
  setSelectedProgramme,
  clearSelectedProgramme,
  resetDashboardData,
} = studentDashboardSlice.actions;

// Export reducer
export default studentDashboardSlice.reducer;
