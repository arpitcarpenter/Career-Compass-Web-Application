import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import AdminJobsTable from './AdminJobsTable'
// 🛠️ Vite Path Fixes: '@' ko relative paths me badla
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '../../redux/jobSlice'

const AdminJobs = () => {
  // Custom hook jo mount hote hi recruiter ke saare posted jobs automatic database se le aayega
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Jab jab user search query change karega, tab tab Redux store live update hoga aur table component filtered jobs dikhayega
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
        {/* 📊 Actual Admin Jobs Data Table Component */}
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs;