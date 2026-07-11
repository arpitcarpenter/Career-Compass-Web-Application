import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
// 🛠️ Vite Path Fix: '@' ko relative paths se badla
import { setSingleCompany } from '../redux/companySlice'
import { COMPANY_API_END_POINT } from '../utils/constant'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
                console.log("Single company data:", res.data.company);
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        // Sirf tabhi call karenge jab companyId valid ho
        if (companyId) {
            fetchSingleCompany();
        }
    }, [companyId, dispatch]); 
}

export default useGetCompanyById;