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
// 🛠️ Vite Path Fixes: Swapped NextJS '@' paths with explicit relative navigation layouts
import { USER_API_END_POINT } from '../../utils/constant'
import { setLoading, setUser } from '../../redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Basic frontend validation tracking before dispatching network request payloads
        if (!input.role) {
            toast.error("Please select a role (Student or Recruiter) before logging in.");
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res?.data?.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message || "Welcome back!");
            }
        } catch (error) {
            console.error("Authentication subsystem pipeline runtime error: ", error);
            toast.error(error.response?.data?.message || "Invalid credentials, please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    // Redirects user directly to landing space if an active token/session context exists globally
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    // Bug Fix: Added user and navigate hooks into explicit dependency tracker metrics
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4 min-h-[calc(100vh-80px)]'>
                <form onSubmit={submitHandler} className='w-full sm:w-2/3 md:w-1/2 border border-gray-200 rounded-md p-6 my-10 bg-white shadow-sm'>
                    <h1 className='font-bold text-2xl mb-5 text-gray-800'>Account Login</h1>
                    
                    <div className='my-3'>
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="example@domain.com"
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
                    
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 mb-2'>
                        <RadioGroup className="flex items-center gap-4 my-2">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    id="r1"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="h-4 w-4 text-[#6A38C2] cursor-pointer focus:ring-[#6A38C2]"
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
                                    className="h-4 w-4 text-[#6A38C2] cursor-pointer focus:ring-[#6A38C2]"
                                />
                                <Label htmlFor="r2" className="cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {
                        loading ? (
                            <Button className="w-full my-4 bg-[#6A38C2]" disabled> 
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Processing identity verification... 
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b2fb3] text-white transition-colors">
                                Login
                            </Button>
                        )
                    }
                    <div className='text-sm text-center text-gray-600 mt-2'>
                        Don't have an account? <Link to="/signup" className='text-blue-600 hover:underline font-medium'>Signup</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;