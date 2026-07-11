import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, Sparkles } from 'lucide-react' 
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    
    // 🔥 FIX 1: Local state for active bookmark tracking
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // LocalStorage check karega ki ye job pehle se saved list me h ya nahi
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const isAlreadySaved = savedJobs.some(savedJobId => savedJobId === job?._id);
        setIsSaved(isAlreadySaved);
    }, [job?._id]);

    // 🔥 FIX 2: Universal Bookmark Handler Logic
    const bookmarkHandler = (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

        if (isSaved) {
            // Un-bookmark (list se bahar nikal do)
            savedJobs = savedJobs.filter(savedJobId => savedJobId !== job?._id);
            setIsSaved(false);
            console.log("❌ Job removed from bookmarks!");
        } else {
            // Bookmark (list me push kar do)
            savedJobs.push(job?._id);
            setIsSaved(true);
            console.log("🔥 Job added to bookmarks!");
        }

        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    };

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return 0;
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - createdAt.getTime();
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }
    
    const mockMatchScore = job?._id ? (parseInt(job._id.substring(18, 24), 16) % 24) + 75 : 88;
    const finalDisplayScore = job?.matchScore !== undefined ? job.matchScore : mockMatchScore;

    return (
        <div className='p-5 rounded-xl shadow-md hover:shadow-2xl bg-white border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 relative group'>
            {/* Top Row: Timestamp and Bookmark Context Container */}
            <div className='flex items-center justify-between'>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                
                <div className='flex items-center gap-2'>
                    {user && user.role === 'student' && (
                        <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold border shadow-sm transition-all ${
                            finalDisplayScore >= 85 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : finalDisplayScore > 30
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>{finalDisplayScore}% Match</span>
                        </div>
                    )}
                    
                    {/* 🔥 FIX 3: Icon button me conditional classes aur click handler lagaya */}
                    <Button 
                        onClick={bookmarkHandler}
                        variant="outline" 
                        className={`rounded-full h-8 w-8 transition-all duration-200 ${
                            isSaved ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' : 'hover:bg-gray-50 text-gray-400 hover:text-gray-600'
                        }`} 
                        size="icon"
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Middle Row: Corporate Identity Metadata Alignment */}
            <div className='flex items-center gap-3 my-3'>
                <div className='p-2 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-purple-200 transition-colors'>
                    <Avatar className="w-10 h-12 rounded-lg">
                        <AvatarImage src={job?.company?.logo} alt="Company Branding" />
                    </Avatar>
                </div>
                <div>
                    <h1 className='font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-[#6A38C2] transition-colors'>{job?.company?.name}</h1>
                    <p className='text-xs font-medium text-gray-400'>{job?.location || "India"}</p>
                </div>
            </div>

            {/* Core Body Row: Descriptors Matrix */}
            <div className='my-2'>
                <h1 className='font-extrabold text-gray-900 text-lg my-1 line-clamp-1'>{job?.title}</h1>
                <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed h-10'>{job?.description}</p>
            </div>

            {/* Badges Metrics Layer Grid */}
            <div className='flex items-center flex-wrap gap-2 mt-4 pb-2 border-b border-gray-50'>
                <Badge className='text-blue-600 font-bold bg-blue-50/60 border border-blue-100 hover:bg-blue-50 rounded-lg text-xs' variant="outline">
                    {job?.position} Openings
                </Badge>
                <Badge className='text-[#F83002] font-bold bg-orange-50/60 border border-orange-100 hover:bg-orange-50 rounded-lg text-xs' variant="outline">
                    {job?.jobType}
                </Badge>
                <Badge className='text-[#7209b7] font-bold bg-purple-50/60 border border-purple-100 hover:bg-purple-50 rounded-lg text-xs' variant="outline">
                    {job?.salary} LPA
                </Badge>
            </div>

            {/* Bottom Row: Call-To-Action Operations Routing Grid */}
            <div className='flex items-center gap-3 mt-4'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="rounded-xl font-medium border-gray-200 hover:bg-gray-50 text-sm px-4 py-2"
                >
                    View Details
                </Button>
                
                {/* 🔥 FIX 4: "Save For Later" button ko bhi dynamic state se bind kiya */}
              <Button 
                    onClick={bookmarkHandler}
                    className={`rounded-xl font-semibold text-sm px-4 py-2 shadow-sm transition-all duration-300 ${
                        isSaved 
                        ? 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white border-none' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black'
                    }`}
                >
                    {isSaved ? "Saved " : "Save For Later"}
                </Button>
            </div>
        </div>
    )
}

export default Job;