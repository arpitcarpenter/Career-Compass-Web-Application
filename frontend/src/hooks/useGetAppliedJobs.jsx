import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
// 🛠️ Vite Path Fix: '@' ko hata kar relative paths jode
import { setAllAppliedJobs } from "../redux/jobSlice"
import { APPLICATION_API_END_POINT } from "../utils/constant"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                console.log("applied jobs data:", res.data);
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    }, [dispatch]); // Dependency array me dispatch add kiya best practices ke liye
};

export default useGetAppliedJobs;