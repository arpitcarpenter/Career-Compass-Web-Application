import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
    const { user } = useSelector(store => store.auth);

    const initialSkills = Array.isArray(user?.profile?.skills) 
        ? user.profile.skills.join(", ") 
        : (user?.profile?.skills || "");

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: initialSkills,
    });

    // Split variables initialized to prevent object overwriting
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [resume, setResume] = useState(null);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        
        //  Gated condition for Appending student-only data payloads
        if (user?.role === 'student') {
            formData.append("skills", input.skills);
            if (resume) {
                formData.append("resume", resume);
            }
        }
        
        if (profilePhoto) {
            formData.append("profilePhoto", profilePhoto);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || "Profile data synchronization complete.");
                setOpen(false); 
            }
        } catch (error) {
            console.error("Profile synchronization pipeline exception:", error);
            const errorMsg = error.response?.data?.message || "Internal server error during metadata update.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-xl" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Update Profile Vector</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className='grid gap-4 py-2'>
                            {/* Name Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right font-medium text-gray-600">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                                />
                            </div>
                            {/* Email Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right font-medium text-gray-600">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                                />
                            </div>
                            {/* Phone Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right font-medium text-gray-600">Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                                />
                            </div>
                            {/* Bio Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right font-medium text-gray-600">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    type="text"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                                />
                            </div>

                            {}
                            {
                                user?.role === 'student' && (
                                    <>
                                        {/* Skills Input */}
                                        <div className='grid grid-cols-4 items-center gap-4'>
                                            <Label htmlFor="skills" className="text-right font-medium text-gray-600">Skills</Label>
                                            <Input
                                                id="skills"
                                                name="skills"
                                                type="text"
                                                placeholder="Python, React, NLP, Data Science"
                                                value={input.skills}
                                                onChange={changeEventHandler}
                                                className="col-span-3 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                                            />
                                        </div>
                                        {/* Resume Upload Component Row */}
                                        <div className='grid grid-cols-4 items-center gap-4'>
                                            <Label htmlFor="resume" className="text-right font-medium text-gray-600">Resume</Label>
                                            <Input
                                                id="resume"
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) => setResume(e.target.files?.[0] || null)}
                                                className="col-span-3 cursor-pointer file:bg-indigo-50 file:text-indigo-700 file:border-none file:rounded-md file:px-3 file:py-1 file:text-xs file:font-semibold hover:file:bg-indigo-100 transition-all text-sm border-gray-200"
                                            />
                                        </div>
                                    </>
                                )
                            }

                            {/* Profile Photo Component (Dono ke liye valid h) */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="photo" className="text-right font-medium text-gray-600">Photo</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                                    className="col-span-3 cursor-pointer file:bg-indigo-50 file:text-indigo-700 file:border-none file:rounded-md file:px-3 file:py-1 file:text-xs file:font-semibold hover:file:bg-indigo-100 transition-all text-sm border-gray-200"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            {
                                loading ? (
                                    <Button disabled className="w-full bg-indigo-600 text-white rounded-lg py-2 flex items-center justify-center font-medium">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Processing Vectors...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg py-2 font-medium shadow-sm shadow-indigo-600/10">
                                        Update Profile
                                    </Button>
                                )
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog;