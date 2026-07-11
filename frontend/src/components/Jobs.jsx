import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs || []);

    // 🔍 Real-time Search Matrix Matching Loop
    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = (allJobs || []).filter((job) => {
                const titleMatch = job?.title?.toLowerCase().includes(searchedQuery.toLowerCase());
                const descMatch = job?.description?.toLowerCase().includes(searchedQuery.toLowerCase());
                const locMatch = job?.location?.toLowerCase().includes(searchedQuery.toLowerCase());
                return titleMatch || descMatch || locMatch;
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs || []);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="bg-gray-50/50 min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col md:flex-row gap-6'>
                    {/* Left Panel Sidebar: Semantic Structural Filters Layer */}
                    <div className='w-full md:w-1/4 lg:w-1/5'>
                        <FilterCard />
                    </div>
                    
                    {/* Right Panel Main Grid: Dynamic Structural Component Views */}
                    {
                        filterJobs.length <= 0 ? (
                            <div className="flex-1 text-center py-20 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm h-fit">
                                No matching positions found for your active parameters.
                            </div>
                        ) : (
                            <div className='flex-1 h-[85vh] overflow-y-auto pb-10 pr-2 scrollbar-thin scrollbar-thumb-gray-200'>
                                <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.25 }}
                                                key={job?._id || Math.random().toString()}
                                            >
                                                {/* Core Job listing individual layout component mapping dummy metrics inside */}
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs;