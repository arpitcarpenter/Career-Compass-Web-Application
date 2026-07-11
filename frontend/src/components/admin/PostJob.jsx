import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom' // 🔥 URL se ID catch karne ke liye useParams add kiya
import axios from "axios"; // Standard api call variable used consistently below
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { JOB_API_END_POINT } from '../../utils/constant'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // 🔥 Dynamic edit route checker
    const isEditMode = !!id;

    // Fetching the list of available companies from Redux state management layer
    const { companies = [] } = useSelector(store => store.company);

    // 🔥 DYNAMIC POPULATE HOOK: Agar URL me ID h (Edit Mode), toh database se data automatic khinch layega
    useEffect(() => {
        if (isEditMode) {
            const fetchJobDetails = async () => {
                try {
                    const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
                    if (res?.data?.success) {
                        const job = res.data.job;
                        setInput({
                            title: job.title || "",
                            description: job.description || "",
                            requirements: job.requirements ? job.requirements.join(", ") : "",
                            salary: job.salary ? job.salary.toString() : "",
                            location: job.location || "",
                            jobType: job.jobType || "",
                            experience: job.experienceLevel || "",
                            position: job.position || 0,
                            companyId: job.company || ""
                        });
                    }
                } catch (error) {
                    console.error("Job details loading pipeline failure:", error);
                    toast.error("Failed to load existing job parameters.");
                }
            };
            fetchJobDetails();
        }
    }, [id, isEditMode]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies?.find((company) => company?.name?.toLowerCase() === value?.toLowerCase());
        if (selectedCompany?._id) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.companyId) {
            toast.error("Please select a registered company first.");
            return;
        }

        try {
            setLoading(true);
            let res;
            
            // 🔥 SMART ROUTING ENGINE: Checking state vectors to dispatch update or creation context
            if (isEditMode) {
                res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, input, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } else {
                res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            }

            if (res?.data?.success) {
                toast.success(res.data.message || (isEditMode ? "Job details updated successfully." : "New job marketplace listing deployed successfully."));
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Job post verification failure: ", error);
            toast.error(error.response?.data?.message || "An unexpected pipeline execution exception occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-80px)] my-5 px-4'>
                <form onSubmit={submitHandler} className='p-8 w-full max-w-4xl border border-gray-200 shadow-lg rounded-md bg-white'>
                    {/* 🔥 Dynamic Header Layout */}
                    <h1 className='text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left'>
                        {isEditMode ? "Modify Job Parameters Matrix" : "Post A New Opportunity"}
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g. Senior Software Engineer"
                                required
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="Brief summary of tasks and performance requirements"
                                required
                            />
                        </div>
                        <div>
                            <Label>Requirements (Comma Separated)</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="React, Node.js, Python, Java"
                                required
                            />
                        </div>
                        <div>
                            <Label>Salary Packages (LPA / Monthly range)</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g. 12 LPA"
                                required
                            />
                        </div>
                        <div>
                            <Label>Job Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g. Indore, MP"
                                required
                            />
                        </div>
                        <div>
                            <Label>Job Type Mode</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="Full-time, Part-time, Remote"
                                required
                            />
                        </div>
                        <div>
                            <Label>Experience Level Required</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                placeholder="e.g. 2+ Years"
                                required
                            />
                        </div>
                        <div>
                            <Label>Number of Target Openings</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                required
                            />
                        </div>
                    </div>

                    {/* Overlapping bug fixed using explicit custom layout triggers */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4 relative">
                        {
                            companies?.length > 0 ? (
                                <Select 
                                    onValueChange={selectChangeHandler}
                                    value={companies.find(c => c._id === input.companyId)?.name?.toLowerCase() || undefined}
                                >
                                    <SelectTrigger className="w-full sm:w-[220px]">
                                        <SelectValue placeholder="Associate Company Profile" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white z-[9999] relative border border-gray-100 shadow-xl rounded-xl">
                                        <SelectGroup>
                                            {
                                                companies.map((company) => {
                                                    return (
                                                        <SelectItem key={company?._id || Math.random()} value={company?.name?.toLowerCase()}>
                                                            {company?.name}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : null
                        }

                        <div className="w-full sm:w-auto flex-1 sm:flex-initial text-right">
                            {
                                loading ? (
                                    <Button className="w-full sm:w-48" disabled> 
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Dispatching data... 
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full sm:w-48 bg-[#6A38C2] hover:bg-[#5b2fb3] text-white">
                                        {isEditMode ? "Update Configuration" : "Post New Job"}
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob;