import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
        // 🚀 ML Integration Pipeline: Recruiter ke liye resumes ko automatically match-score ke hisab se sort karega
        rankedApplicants: null, 
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        // 🚀 ML Action: Python Cosine Similarity model se sorted data yahan inject hoga
        setAllRankedApplicants: (state, action) => {
            state.rankedApplicants = action.payload;
        }
    }
});

export const { setAllApplicants, setAllRankedApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;