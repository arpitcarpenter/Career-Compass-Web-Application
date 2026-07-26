import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
//  Vite Path Fixes: '@' ko relative paths me badla
import useGetAllCompanies from '../../hooks/useGetAllCompanies'
import { setSearchCompanyByText } from '../../redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between my-5 gap-4'>
                    <Input
                        className="w-full sm:w-fit"
                        placeholder="Filter by name"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => navigate("/admin/companies/create")} className="whitespace-nowrap">
                        New Company
                    </Button>
                </div>
                {/*  Actual Data Table Component */}
                <CompaniesTable />
            </div>
        </div>
    )
}

export default Companies;