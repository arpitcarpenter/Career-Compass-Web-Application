import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null, 
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        // 🚀 ML Integration Pipelines
        recommendedJobs: [],
        recommendationLoading: false,
    },
    reducers: {
        // Core Reducers
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        // 🚀 ML Actions for Recommendation Engine
        setRecommendedJobs: (state, action) => {
            state.recommendedJobs = action.payload;
        },
        setRecommendationLoading: (state, action) => {
            state.recommendationLoading = action.payload;
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    // ML Named Exports
    setRecommendedJobs,
    setRecommendationLoading
} = jobSlice.actions;

export default jobSlice.reducer;