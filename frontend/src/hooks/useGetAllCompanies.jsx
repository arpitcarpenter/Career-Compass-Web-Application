import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
// 🛠️ Vite Path Fix: '@' ko hata kar relative paths jode
import { setCompanies } from '../redux/companySlice'
import { COMPANY_API_END_POINT } from '../utils/constant'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                console.log('companies fetched called');
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    }, []); // Empty dependency array taaki mount par sirf ek baar chale
}

export default useGetAllCompanies;