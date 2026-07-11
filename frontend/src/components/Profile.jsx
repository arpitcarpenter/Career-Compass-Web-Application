import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText, Sparkles, Briefcase, BookmarkIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from '../components/AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import Job from './Job' // 🔥 IMPORTANT: Job card component import kiya check clusters display ke liye

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    
    // 🔥 FIX 1: Redux store se allJobs ko fetch kiya tracking map setup ke liye
    const { allJobs } = useSelector(store => store.job);
    
    // 🔥 FIX 2: Local active state trackers tabs swapping ke liye
    const [activeTab, setActiveTab] = useState('applied');
    const [savedJobs, setSavedJobs] = useState([]);

    // 🔥 FIX 3: LocalStorage hooks map, jo dynamic real-time saved filters create karega
    useEffect(() => {
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
        // Redux ki saari jobs me se wahi filtered out koli jinka ID match krta h
        const filtered = allJobs.filter(job => savedJobIds.includes(job?._id));
        setSavedJobs(filtered);
    }, [allJobs]);

    const isResume = !!user?.profile?.resume;

    return (
        <div className="bg-gray-50/50 min-h-screen pb-10">
            <Navbar />
            
            {/* Core User Profile Visual Identity Wrapper */}
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl my-5 p-8 shadow-sm relative overflow-hidden'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-5'>
                        <Avatar className="h-24 w-24 border-2 border-purple-100 shadow-sm">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900 tracking-tight'>{user?.fullname}</h1>
                            <p className='text-sm text-gray-500 mt-1 max-w-xl leading-relaxed'>{user?.profile?.bio || "No professional summary bio indexed yet."}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="rounded-xl border-gray-200 hover:bg-gray-50 shrink-0 self-end sm:self-auto" variant="outline" size="icon">
                        <Pen className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>

                {/* Contact Coordinates Block */}
                <div className='my-6 pt-6 border-t border-gray-50 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div className='flex items-center gap-3 bg-gray-50/60 p-3 rounded-xl border border-gray-100/60'>
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium truncate">{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 bg-gray-50/60 p-3 rounded-xl border border-gray-100/60'>
                        <Contact className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{user?.phoneNumber || "N/A"}</span>
                    </div>
                </div>

                {/* TECHNICAL SKILLS BLOCK: Only visible to Student accounts */}
                {user?.role === 'student' && (
                    <div className='my-6'>
                        <h2 className='text-sm font-bold text-gray-400 uppercase tracking-wider mb-2.5'>Skills Inventory</h2>
                        <div className='flex flex-wrap items-center gap-2'>
                            {
                                user?.profile?.skills && user?.profile?.skills.length !== 0 ? (
                                    user?.profile?.skills.map((item, index) => (
                                        <Badge key={index} className="bg-purple-50 text-[#6A38C2] hover:bg-purple-100 border border-purple-200/50 font-semibold px-3 py-1 rounded-lg text-xs shadow-none">
                                            {item}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded border border-dashed">No technical tokens declared.</span>
                                )
                            }
                        </div>
                    </div>
                )}

                {/* DOCUMENT CORE REFERENCE ZONE: Only visible to Student accounts */}
                {user?.role === 'student' && (
                    <div className='mt-6 pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div className='grid w-full max-w-sm items-center gap-2'>
                            <Label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Document Profile Reference</Label>
                            {
                                isResume ? (
                                    <a 
                                        target='_blank' 
                                        rel="noopener noreferrer"
                                        href={user?.profile?.resume} 
                                        className='text-[#6A38C2] font-semibold text-sm flex items-center gap-2 hover:underline cursor-pointer bg-purple-50/30 border border-purple-100/60 p-2.5 rounded-xl transition-all w-fit'
                                    >
                                        <FileText className="w-4 h-4 text-[#6A38C2]" />
                                        <span className="truncate max-w-[240px]">{user?.profile?.resumeOriginalName || "View Uploaded Resume"}</span>
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-400 font-medium italic">No document file registered in database.</span>
                                )
                            }
                        </div>

                        {isResume && (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold w-fit shadow-sm self-start sm:self-end">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                <span>ML Pipeline Status: Parsed & Ready for Similarity Scoring</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 🔥 FIX 4: INTERACTIVE DYNAMIC MULTI-TAB ENGINE CONTAINER */}
            {user?.role === 'student' && (
                <div className='max-w-4xl mx-auto mt-8 px-2 sm:px-0'>
                    {/* Tab Selection Row Buttons Grid */}
                    <div className='flex items-center gap-4 border-b border-gray-200 mb-6 pb-1'>
                        <button 
                            onClick={() => setActiveTab('applied')}
                            className={`flex items-center gap-2 pb-3 text-sm font-bold tracking-wide transition-all uppercase ${
                                activeTab === 'applied' 
                                ? 'text-[#6A38C2] border-b-2 border-[#6A38C2]' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Applied Jobs
                        </button>
                        <button 
                            onClick={() => setActiveTab('saved')}
                            className={`flex items-center gap-2 pb-3 text-sm font-bold tracking-wide transition-all uppercase ${
                                activeTab === 'saved' 
                                ? 'text-[#6A38C2] border-b-2 border-[#6A38C2]' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <BookmarkIcon className="w-4 h-4" />
                            Saved Jobs ({savedJobs.length})
                        </button>
                    </div>

                    {/* Conditional Rendering Based on Active Tab View */}
                    <div className="transition-all duration-300">
                        {
                            activeTab === 'applied' ? (
                                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                                    <h1 className='font-bold text-xl text-gray-900 tracking-tight mb-4'>Applied Jobs Ledger</h1>
                                    <AppliedJobTable />
                                </div>
                            ) : (
                                <div>
                                    {
                                        savedJobs.length === 0 ? (
                                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                                <BookmarkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3 border p-2.5 rounded-full bg-gray-50" />
                                                <h2 className="text-gray-700 font-bold text-base">No Saved Jobs Yet</h2>
                                                <p className="text-gray-400 text-sm mt-1">Jobs bookmark karo taaki wo yahan live showcase ho sakein.</p>
                                            </div>
                                        ) : (
                                            /* 🔥 Beautiful Grid system mapping your original <Job /> components seamlessly */
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in'>
                                                {
                                                    savedJobs.map((job) => (
                                                        <Job key={job?._id} job={job} />
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            )}

            {/* Edit Trigger Profile Form Matrix Context Modal */}
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile;