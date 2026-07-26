import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
        rankedApplicants: null, 
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        
        setAllRankedApplicants: (state, action) => {
            state.rankedApplicants = action.payload;
        }
    }
});

export const { setAllApplicants, setAllRankedApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;