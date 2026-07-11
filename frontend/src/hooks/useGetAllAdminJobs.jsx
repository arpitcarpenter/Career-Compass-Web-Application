import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
// 🛠️ Vite Fix: Path ko '@' se badal kar relative path me convert kiya
import { setAllAdminJobs } from '../redux/jobSlice'
import { JOB_API_END_POINT } from '../utils/constant'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminJobs();
    }, []); // Empty array ka matlab hai yeh page load hote hi sirf ek baar chalega
}

export default useGetAllAdminJobs;