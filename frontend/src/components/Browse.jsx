import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './shared/Navbar'
import Job from './Job'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Browse = () => {
    // 🛠️ Hook Fix: Invoking hook to load baseline workspace profiles into the data stream
    useGetAllJobs();
    
    const dispatch = useDispatch();
    // Safely extracting global job vectors from the Redux store
    const { allJobs = [], searchedQuery = "" } = useSelector(store => store.job);

    // 📊 ML/Filter Data Process Layer: Filtering items natively based on user text tags or fallback mechanisms
    const displayedJobs = allJobs.filter((job) => {
        if (!searchedQuery) return true; // Returns global baseline tokens if search field is resting blank
        
        const searchString = searchedQuery.toLowerCase();
        return (
            job?.title?.toLowerCase().includes(searchString) ||
            job?.description?.toLowerCase().includes(searchString) ||
            job?.company?.name?.toLowerCase().includes(searchString)
        );
    });

    useEffect(() => {
        // Cleanup life-cycle hook to sweep active query descriptors on session termination
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
                {/* Dynamic Metrics Header Layer showcasing current processed subset lengths */}
                <h1 className="font-bold text-2xl text-gray-900 tracking-tight my-8">
                    Search Results ({displayedJobs.length})
                </h1>
                
                {
                    displayedJobs.length <= 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-gray-400 font-medium font-mono text-sm">
                                No workspace components matched the current active text query vectors.
                            </p>
                        </div>
                    ) : (
                        // Clean layout matrix distributing job cards natively over screen break bounds
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                displayedJobs.map((job) => {
                                    return (
                                        <Job key={job?._id || Math.random()} job={job} />
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Browse;