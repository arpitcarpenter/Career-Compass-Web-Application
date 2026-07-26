import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"

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
    }, [dispatch]);
};

export default useGetAppliedJobs;