import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// ==================== APPLY FOR A JOB (FOR STUDENTS) ====================
export const applyJob = async (req, res) => {
    try {
        const userId = req.id; // Logged in user ID from auth middleware
        const jobId = req.params.id; // Target job ID from URL parameters
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for this job to prevent duplicates
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if the target job actually exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create a new job application record
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Push the new application reference ID into the corresponding Job document
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });
    } catch (error) {
        console.error("Apply Job Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while applying for the job.",
            success: false
        });
    }
};

// ==================== GET ALL JOBS APPLIED BY CURRENT STUDENT ====================
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        // Fetch applications, sort by latest, and populate nested job and company models
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } }
                }
            });

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.error("Get Applied Jobs Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while fetching applied jobs.",
            success: false
        });
    }
};

// ==================== GET ALL APPLICANTS FOR A SPECIFIC JOB (FOR RECRUITERS) ====================
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // Find the job record and populate the complete profile info of all applicants
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        // Fixed typo from 'succees' to 'success'
        return res.status(200).json({
            job, 
            success: true
        });
    } catch (error) {
        console.error("Get Applicants Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while fetching job applicants.",
            success: false
        });
    }
};

// ==================== UPDATE JOB APPLICATION STATUS (BY RECRUITERS) ====================
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        
        if (!status) {
            return res.status(400).json({
                message: 'Status is required.',
                success: false
            });
        }

        // Find the specific application record by its unique ID
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Normalize status to lowercase string (pending, accepted, rejected) and save
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Update Status Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while updating application status.",
            success: false
        });
    }
};