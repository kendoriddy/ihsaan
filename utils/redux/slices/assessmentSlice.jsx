import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthToken } from "@/hooks/axios/axios";
import axios from "axios";

// Async thunk to submit assessment
export const submitAssessment = createAsyncThunk(
  "assessments/submitAssessment",
  async ({ sectionId, answers }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.ihsaanacademia.com/assessment/mcquestions/course-section/${sectionId}/submit/`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch detailed results
      const resultsResponse = await axios.get(
        `https://api.ihsaanacademia.com/assessment/mcq-responses/${response.data.mcq_response_id}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      return {
        sectionId,
        results: resultsResponse.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit assessment"
      );
    }
  }
);

// Initial state
const initialState = {
  assessmentResults: {}, // sectionId -> results
  loading: {},
  errors: {},
};

// Create the slice
const assessmentSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    // Clear assessment results for a section
    clearAssessmentResults: (state, action) => {
      const sectionId = action.payload;
      delete state.assessmentResults[sectionId];
      delete state.loading[sectionId];
      delete state.errors[sectionId];
    },

    // Clear all assessment data
    clearAllAssessments: (state) => {
      state.assessmentResults = {};
      state.loading = {};
      state.errors = {};
    },

    // Set assessment results manually
    setAssessmentResults: (state, action) => {
      const { sectionId, results } = action.payload;
      state.assessmentResults[sectionId] = results;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle submitAssessment
      .addCase(submitAssessment.pending, (state, action) => {
        const sectionId = action.meta.arg.sectionId;
        state.loading[sectionId] = true;
        state.errors[sectionId] = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        const { sectionId, results } = action.payload;
        state.loading[sectionId] = false;
        state.assessmentResults[sectionId] = results;
        state.errors[sectionId] = null;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        const sectionId = action.meta.arg.sectionId;
        state.loading[sectionId] = false;
        state.errors[sectionId] = action.payload;
      });
  },
});

// Export actions
export const {
  clearAssessmentResults,
  clearAllAssessments,
  setAssessmentResults,
} = assessmentSlice.actions;

// Selectors
export const selectAssessmentResults = (state, sectionId) =>
  state.assessments.assessmentResults[sectionId];

export const selectAssessmentLoading = (state, sectionId) =>
  state.assessments.loading[sectionId];

export const selectAssessmentError = (state, sectionId) =>
  state.assessments.errors[sectionId];

// Export reducer
export default assessmentSlice.reducer;
