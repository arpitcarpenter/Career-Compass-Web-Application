import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
// 🛠️ Vite Path Fixes: Replaced '@' alias with explicit relative navigation paths
import { APPLICATION_API_END_POINT } from '../../utils/constant'
import { setAllApplicants } from '../../redux/applicationSlice'

// Asynchronous API handler to pull real-time candidate applications from backend database
export const fetchAllApplicants = (dispatch, jobId) => async () => {
    try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });
        if (res?.data?.success) {
            dispatch(setAllApplicants(res.data.job));
        }
    } catch (error) {
        console.error("Failed to query applicant records from server database:", error);
    }
};

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    
    // Safely extracting application array lists from Redux state management layer
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        if (params.id) {
            dispatch(fetchAllApplicants(dispatch, params.id));
        }
    }, [dispatch, params.id]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4 sm:px-6'>
                {/* Dynamically computes total applications registered on the current job id */}
                <h1 className='font-bold text-2xl text-gray-800 my-5'>
                    Applicants ({applicants?.applications?.length || 0})
                </h1>
                
                {/*  Data table rendered with specific jobId parameter passed as an active prop */}
                <ApplicantsTable jobId={params.id} />
            </div>
        </div>
    )
}

export default Applicants;