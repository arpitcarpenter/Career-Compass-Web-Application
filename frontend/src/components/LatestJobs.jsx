import React, { useEffect, useState } from 'react'
import LatestJobCards from './LatestJobCards';
import axios from 'axios';
import { JOB_API_END_POINT } from '../utils/constant';
import { Loader2 } from 'lucide-react';

const LatestJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestRealTimeJobs = async () => {
            try {
                setLoading(true);
                // DIRECT SECURE WIRE HIT: Hits our strict authenticated endpoint
                const res = await axios.get(`${JOB_API_END_POINT}/get`, {
                    withCredentials: true // Transmits JWT token cleanly to inject actual matchScores
                });
                
                if (res?.data?.success) {
                    setJobs(res.data.jobs || []);
                }
            } catch (error) {
                console.error("Error loading real-time home matrix weights:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestRealTimeJobs();
    }, []);
   
    return (
        <div className='max-w-7xl mx-auto my-20 px-4 sm:px-6 lg:px-8'>
            {/* Header Title Section with Premium Branding Accent Layout */}
            <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
                <span className='text-[#6A38C2]'>Latest & Top </span> Job Openings
            </h1>
            
            {loading ? (
                <div className="flex justify-center items-center my-16 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#6A38C2]" />
                    <p className="text-gray-400 text-sm font-medium">Synchronizing vector space metrics...</p>
                </div>
            ) : (
                /* Responsive Flexbox Grid for Individual Structural Layout Cards */
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>
                    {
                        !jobs || jobs.length <= 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-400 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                No Active Job Listings Available At Present.
                            </div>
                        ) : (
                            // Slice top 6 jobs cleanly and pass to real-time sync cards
                            jobs.slice(0, 6).map((job) => (
                                <LatestJobCards key={job._id} job={job}/>
                            ))
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default LatestJobs;