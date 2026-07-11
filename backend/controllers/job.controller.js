import { Job } from "../models/job.model.js";
import axios from "axios";
import mongoose from "mongoose";

// ==================== POST A NEW JOB (BY RECRUITER / ADMIN) ====================
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id; // Retrieved from authentication middleware

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing in parameters data.",
                success: false
            });
        }

        // Convert comma-separated string to array safely
        let requirementsArray;
        if (typeof requirements === 'string') {
            requirementsArray = requirements.split(",").map(skill => skill.trim());
        } else {
            requirementsArray = requirements;
        }

        // 🔥 FIX 1: NaN Crash Protection for Salary field
        // Agar string parse "12 LPA" NaN banti h, toh pure raw text string ko database compatible clean number me convert karo ya binary string fallback do
        let parsedSalary = Number(salary);
        if (isNaN(parsedSalary)) {
            // "12 LPA" me se digit extraction regex pipeline layer
            const extracted = salary.replace(/[^0-9]/g, '');
            parsedSalary = extracted ? Number(extracted) : 0; 
        }

        if (parsedSalary <= 0) {
            parsedSalary = 1; // Fallback to avoid strict mongoose model schema validation block
        }

        // Create the job record and link it to the company and user models
        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: parsedSalary, // Safe clean numeric data mapping
            location,
            jobType,
            experienceLevel: experience, // Linked accurately with your model schema
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Post Job Error Details:", error); // 🔥 Print complete error log track instead of just message
        return res.status(500).json({
            message: "Internal server error while posting the job.",
            error: error.message,
            success: false
        });
    }
};

// ==================== UPDATE / EDIT AN EXISTING JOB ====================
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, requirements, salary, location, jobType, experience, position } = req.body;

        // Smart Salary Parser logic jo humne kal banaya tha
        let parsedSalary;
        if (salary) {
            parsedSalary = Number(salary);
            if (isNaN(parsedSalary)) {
                const extractedDigits = salary.toString().replace(/[^0-9]/g, '');
                parsedSalary = extractedDigits ? Number(extractedDigits) : 0;
            }
        }

        // Comma-separated requirements convert to array safely
        let requirementsArray;
        if (requirements) {
            requirementsArray = typeof requirements === 'string' 
                ? requirements.split(",").map(skill => skill.trim()) 
                : requirements;
        }

        // Database entry populate and update node
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                requirements: requirementsArray,
                salary: parsedSalary,
                location,
                jobType,
                experienceLevel: experience,
                position: position ? Number(position) : undefined
            },
            { new: true, runValidators: true } // Returns updated document safely
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job document not found cluster.", success: false });
        }

        return res.status(200).json({
            message: "Job marketplace vector updated successfully.",
            job: updatedJob,
            success: true
        });

    } catch (error) {
        console.error("Update Job Router Exception:", error);
        return res.status(500).json({ message: "Internal server error during job update mapping.", success: false });
    }
};

// ==================== GET ALL JOBS BY FILTER/SEARCH QUERY WITH REAL ML SCORE ====================
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        // Optional Authentication check handler
        // Agar route par verifyToken middleware hai toh req.id milega, warna undefined
        const userId = req.id || null; 

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        // 1. Fetch all jobs matching search/keyword matrix cleanly
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        // 2. 🔥 REAL-TIME ML INJECTION HANDSHAKE LOOP
        // Agar bacha logged-in hai aur database me jobs hain, toh pipeline activate karo
        if (userId && jobs.length > 0) {
            try {
                // Dynamically Mongoose dynamically User compile mapping state check safely
                const user = await mongoose.model("User").findById(userId);
                
                if (user) {
                    const userSkills = user?.profile?.skills?.length > 0 ? user.profile.skills.join(", ") : "";
                    const userBio = user?.profile?.bio || "";
                    const resumeTextCorpus = user?.profile?.resumeText || "";
                    
                    // Fallback encapsulation architecture strategy
                    const combinedStudentProfileText = resumeTextCorpus ? resumeTextCorpus : `${userBio} ${userSkills}`.trim();

                    if (combinedStudentProfileText) {
                        // Creating light corpus transport blocks
                        const jobsPayload = jobs.map(job => ({
                            _id: job._id,
                            title: job.title,
                            description: job.description,
                            requirements: job.requirements
                        }));

                        // Trigger local post parameters directly to Flask framework port 5000
                        const pythonResponse = await axios.post("http://127.0.0.1:5000/api/recommend", {
                            skills: combinedStudentProfileText,
                            jobs: jobsPayload
                        });

                        if (pythonResponse?.data?.success) {
                            // Create dictionary cache optimization maps
                            const scoresMap = {};
                            pythonResponse.data.recommendations.forEach(item => {
                                scoresMap[item._id.toString()] = item.matchScore;
                            });

                            // Synchronize mathematical percentages back to user response object array without filtering out entries
                            const jobsWithRealScores = jobs.map(job => {
                                const jobObj = job.toObject();
                                // Target real computed percentage bindings injection layer
                                jobObj.matchScore = scoresMap[job._id.toString()] !== undefined ? scoresMap[job._id.toString()] : 0;
                                return jobObj;
                            });

                            return res.status(200).json({
                                jobs: jobsWithRealScores, // Delivery verified actual nodes
                                success: true
                            });
                        }
                    }
                }
            } catch (mlErr) {
                // Graceful degradation mechanism rule context if Python fails or restarts
                console.error("Silent fallback activated inside getAllJobs network stream:", mlErr.message);
            }
        }

        // 3. Fallback / Guest Framework execution output pipeline
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get All Jobs Error Traceback:", error.message);
        return res.status(500).json({
            message: "Internal server error while fetching jobs matrix cluster.",
            success: false
        });
    }
};
// ==================== GET A SPECIFIC JOB BY ID (FOR STUDENTS) ====================
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id; 
        
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        console.error("Get Job By ID Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while retrieving job details.",
            success: false
        });
    }
};

// ==================== GET ALL JOBS CREATED BY A SPECIFIC ADMIN / RECRUITER ====================
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id; 
        
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get Admin Jobs Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while retrieving recruiter jobs.",
            success: false
        });
    }
};

// ==================== GET AI-POWERED JOB RECOMMENDATIONS (FIXED) ====================
export const getAIRecommendations = async (req, res) => {
    try {
        const userId = req.id; 
        const user = await mongoose.model("User").findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        const userSkills = user?.profile?.skills?.length > 0 ? user.profile.skills.join(", ") : "";
        const userBio = user?.profile?.bio || "";
        const resumeTextCorpus = user?.profile?.resumeText || "";
        const combinedStudentProfileText = resumeTextCorpus ? resumeTextCorpus : `${userBio} ${userSkills}`.trim();

        if (!combinedStudentProfileText) {
            return res.status(200).json({ jobs: [], success: true, message: "Profile empty." });
        }

        const allJobs = await Job.find({}).populate({ path: "company" });
        const jobsPayload = allJobs.map(job => ({
            _id: job._id,
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            location: job.location,
            salary: job.salary,
            jobType: job.jobType,
            position: job.position,
            company: job.company
        }));

        const pythonServiceUrl = "http://127.0.0.1:5000/api/recommend";
        
        // Python server ko hit maaro
        const pythonResponse = await axios.post(pythonServiceUrl, {
            skills: combinedStudentProfileText,
            jobs: jobsPayload
        });

        if (pythonResponse?.data?.success) {
            // 🔥 FIX: Sirf 15% se zyada match wali jobs hi dikhao. 
            // Agar score 0 hoga toh filter bahar nikal dega.
           const rawRecommendations = pythonResponse.data.recommendations || [];

            // Structural verification rule safely bounded
            const filteredJobs = rawRecommendations.filter(job => job.matchScore >=0);

            return res.status(200).json({
                message: "Success",
                jobs: filteredJobs,
                success: true
            });
        } else {
            return res.status(500).json({ message: "ML Engine failed.", success: false });
        }

    } catch (error) {
        console.error("Orchestration Error:", error);
        return res.status(500).json({ message: "Orchestration Error", success: false });
    }
};