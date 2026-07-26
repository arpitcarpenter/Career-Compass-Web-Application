import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'

import { USER_API_END_POINT } from '../../utils/constant'
import { setLoading } from '../../redux/authSlice'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Basic mandate validation tracking prior to network execution requests
        if (!input.role) {
            toast.error("Please select an authorization role context (Student or Recruiter).");
            return;
        }

        const formData = new FormData(); // Initializing binary metadata formatting envelope
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res?.data?.success) {
                toast.success(res.data.message || "Account created successfully.");
                navigate("/login");
            } else {
                toast.error(res.data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Authentication register subsystem failure: ", error);
            toast.error(error.response?.data?.message || "Something went wrong during onboarding pipeline operations.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    // Direct redirection trigger executing if session token metrics persist globally
    useEffect(() => {
        if (user) {
            navigate("/");
        }
   
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4 min-h-[calc(100vh-80px)]'>
                <form onSubmit={submitHandler} className='w-full sm:w-2/3 md:w-1/2 border border-gray-200 rounded-md p-6 my-10 bg-white shadow-sm'>
                    <h1 className='font-bold text-2xl mb-5 text-gray-800'>Create Account</h1>
                    
                    <div className='my-3'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Jhon"
                            required
                        />
                    </div>
                    
                    <div className='my-3'>
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="john.doe@example.com"
                            required
                        />
                    </div>
                    
                    <div className='my-3'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="9876543210"
                            required
                        />
                    </div>
                    
                    <div className='my-3'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 mb-2'>
                        <RadioGroup className="flex items-center gap-4 my-2">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    id="r1"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="h-4 w-4 text-[#6A38C2] cursor-pointer"
                                />
                                <Label htmlFor="r1" className="cursor-pointer">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    id="r2"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="h-4 w-4 text-[#6A38C2] cursor-pointer"
                                />
                                <Label htmlFor="r2" className="cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        
                        <div className='flex items-center gap-2 '>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    {
                        loading ? (
                            <Button className="w-full my-4 bg-[#6A38C2]" disabled> 
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Processing secure validation workflows... 
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b2fb3] text-white transition-colors">
                                Signup
                            </Button>
                        )
                    }
                    <div className='text-sm text-center text-gray-600 mt-2'>
                        Already have an account? <Link to="/login" className='text-blue-600 hover:underline font-medium'>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;