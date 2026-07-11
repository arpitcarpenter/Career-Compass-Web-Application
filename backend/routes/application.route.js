import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

// Route to apply for a specific job using its unique ID (Protected route for Students)
router.route("/apply/:id").get(isAuthenticated, applyJob);

// Route to fetch all jobs applied by the logged-in student (Protected route)
router.route("/get").get(isAuthenticated, getAppliedJobs);

// Route to get a list of all applicants for a specific job ID (Protected route for Recruiters)
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// Route to update the application status (pending/accepted/rejected) of an applicant (Protected route)
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
 
export default router;