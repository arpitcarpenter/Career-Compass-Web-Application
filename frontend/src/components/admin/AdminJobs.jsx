import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import AdminJobsTable from './AdminJobsTable'

import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '../../redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10 px-4'>
        <div className='flex items-center justify-between my-5 gap-4'>
          <Input
            className="w-full sm:w-fit"
            placeholder="Filter by name, role"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")} className="whitespace-nowrap">
            New Jobs
          </Button>
        </div>
        {/*  Actual Admin Jobs Data Table Component */}
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs;