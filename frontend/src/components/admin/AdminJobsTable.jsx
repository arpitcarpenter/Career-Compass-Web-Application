import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const AdminJobsTable = () => { 
    // Fallback assignment to prevent null/undefined runtime crashes
    const { allAdminJobs = [], searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { 
        // Secure check to ensure filter runs smoothly even with initial empty store state
        const filteredJobs = allAdminJobs?.length > 0 && allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            const isTitleMatch = job?.title?.toLowerCase().includes(searchJobByText.toLowerCase());
            const isCompanyMatch = job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
            return isTitleMatch || isCompanyMatch;
        });
        setFilterJobs(filteredJobs || []);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                    No jobs found. Please post a new job first.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterJobs?.map((job) => (
                                // Fixed: Added unique key constraint to standard TableRow structure
                                <TableRow key={job?._id || Math.random()}>
                                    <TableCell className="font-medium text-gray-800">
                                        {job?.company?.name || "N/A"}
                                    </TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>
                                        {/* Fallback configuration for safer date string isolation */}
                                        {job?.createdAt ? job.createdAt.split("T")[0] : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 p-2">
                                                {/* Fixed: Routing redirected to actual admin jobs modification endpoint */}
                                                <div 
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/edit`)} 
                                                    className='flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors'
                                                >
                                                    <Edit2 className='w-4 h-4' />
                                                    <span className="text-sm font-medium">Edit Job</span>
                                                </div>
                                                {/* Navigation path for viewing real-time candidate metrics */}
                                                <div 
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                    className='flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors mt-1'
                                                >
                                                    <Eye className='w-4 h-4' />
                                                    <span className="text-sm font-medium">Applicants</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable;