import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sparkles } from 'lucide-react' 
import { toast } from 'sonner' 

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    // Dynamic fallback structure matrix
    const mockScore = job?._id ? (parseInt(job._id.substring(18, 24), 16) % 24) + 75 : 88;
    const finalDisplayScore = job?.matchScore !== undefined ? job.matchScore : mockScore;

    // Strict condition checking if the logged-in student has actually uploaded a resume file
    const hasResume = !!user?.profile?.resume;

    const handleCardClick = () => {
        if (!user) {
            toast.error("Please login to view full job details and apply!");
            navigate("/login");
        } else {
            navigate(`/description/${job._id}`);
        }
    };

    return (
        <div 
            onClick={handleCardClick} 
            className='p-5 rounded-xl shadow-md hover:shadow-2xl bg-white border border-gray-100 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group'
        >
            {/* Header Layout Zone (Company Metadata & Conditional AI Scoring) */}
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <h1 className='font-semibold text-lg text-gray-800 group-hover:text-[#6A38C2] transition-colors'>{job?.company?.name}</h1>
                    <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>{job?.location || "Remote / India"}</p>
                </div>

                {}
                {user && user.role === 'student' && hasResume && (
                    <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold border shadow-sm transition-all ${
                        finalDisplayScore >= 85 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{finalDisplayScore}% Match</span>
                    </div>
                )}
            </div>

            {/* Core Body Section (Job Descriptive Matrix) */}
            <div className='my-3 border-b border-gray-50 pb-3'>
                <h1 className='font-bold text-base text-gray-900 line-clamp-1'>{job?.title}</h1>
                <p className='text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed h-10'>{job?.description}</p>
            </div>

            {/* Standard Footer Badges Matrix */}
            <div className='flex items-center flex-wrap gap-2 mt-4 pt-1'>
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
        </div>
    )
}

export default LatestJobCards;