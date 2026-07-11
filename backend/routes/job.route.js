import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, getAIRecommendations } from "../controllers/job.controller.js";

const router = express.Router();

// Route to post a new job (Protected route for Recruiter/Admin)
router.route("/post").post(isAuthenticated, postJob);

// 🔥 FIX: 'isAuthenticated' hata diya taaki Guest user bhi bina login kiye saari jobs fetch kar sake.
// Ab Guest ko bhi home page par latest jobs chamkengi, aur Controller internal handling se errors bhi nahi dega!
router.route("/get").get(getAllJobs);

// Route to get all jobs posted by the currently logged-in admin (Protected route)
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// Route to get a specific job's complete details by its unique ID (Protected route)
router.route("/get/:id").get(isAuthenticated, getJobById);

router.route("/update/:id").put(isAuthenticated, updateJob);

// 🔥 NAYA ML INTEGRATION GATEWAY ROUTE
// Yeh endpoint frontend recommendations page ko hamare filtered vector analyzer controller se map karega
router.route("/ai-recommendations").get(isAuthenticated, getAIRecommendations);

export default router;