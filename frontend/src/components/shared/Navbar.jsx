import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar' 
import { LogOut, User2, Sparkles } from 'lucide-react' 
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // 🔥 CONTROLLED DROPDOWN STATES
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                setDropdownOpen(false);
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    // Dropdown ke bahar click karne par menu close karne ke liye handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                {/* Brand Logo Redirect Link */}
                <div>
                    <h1 className='text-2xl font-bold tracking-tight'>
                         Career <span className='text-[#F83002]'>
                            <Link to={user && user.role === 'recruiter' ? "/admin/companies" : "/"}> Compass</Link>
                        </span>
                    </h1>
                </div>

                {/* Navigation Links Layer */}
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-6 text-gray-600 hover:text-gray-900 transition-colors'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className='hover:text-[#6A38C2] transition-colors'><Link to="/admin/companies">Companies</Link></li>
                                    <li className='hover:text-[#6A38C2] transition-colors'><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className='hover:text-[#6A38C2] transition-colors'><Link to="/">Home</Link></li>
                                    <li className='hover:text-[#6A38C2] transition-colors'><Link to="/jobs">Jobs</Link></li>
                                    <li className='hover:text-[#6A38C2] transition-colors'><Link to="/browse">Browse</Link></li>
                                    
                                    {/* PREMIUM ML ENGINE TAB */}
                                    {user && user.role === 'student' && (
                                        <li className='relative bg-purple-50 text-[#6A38C2] px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 border border-purple-200 animate-pulse hover:scale-105 transition-transform'>
                                            <Sparkles className="w-4 h-4 text-[#6A38C2]" />
                                            <Link to="/recommendations">AI Matcher</Link>
                                        </li>
                                    )}
                                </>
                            )
                        }
                    </ul>

                    {/* Authentication Status Layout Toggle */}
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login"><Button variant="outline" className="rounded-xl">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] rounded-xl text-white shadow-md transition-all">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='relative' ref={dropdownRef}>
                                {/* 🔥 Click Target Handler: Direct Trigger on Avatar click */}
                                <div onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer select-none">
                                    <Avatar className="border-2 border-purple-100 hover:border-purple-400 transition-all shadow-sm">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="User Avatar" />
                                        <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
                                            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* 🔥 Popover-Style Custom Card Layout Dropdown */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 w-80 rounded-2xl shadow-2xl mt-2 p-4 bg-white border border-gray-100 z-50 transform origin-top-right transition-all duration-200 ease-out">
                                        <div className='flex flex-col gap-3'>
                                            <div className='flex gap-3 items-center border-b border-gray-50 pb-3'>
                                                <Avatar className="w-12 h-12 border border-gray-100">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Photo" />
                                                    <AvatarFallback className="bg-purple-100 text-[#6A38C2] font-bold">
                                                        {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex flex-col overflow-hidden'>
                                                    <h4 className='font-semibold text-gray-900 truncate'>{user?.fullname}</h4>
                                                    <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Action Links Trigger Grid */}
                                            <div className='flex flex-col text-sm text-gray-600 gap-1'>
                                                <Link 
                                                    to="/profile" 
                                                    onClick={() => setDropdownOpen(false)} 
                                                    className='flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer w-full'
                                                >
                                                    <User2 className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">My Profile</span>
                                                </Link>

                                                <button 
                                                    onClick={logoutHandler} 
                                                    className='flex items-center gap-3 px-2 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left w-full mt-1 cursor-pointer'
                                                >
                                                    <LogOut className="w-4 h-4 text-red-400" />
                                                    <span className="font-medium">Logout Session</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar;