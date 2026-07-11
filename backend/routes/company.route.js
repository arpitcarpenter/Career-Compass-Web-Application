import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js"; // Fixed typo from mutler to multer

const router = express.Router();

// Route to register a new company (Protected route)
router.route("/register").post(isAuthenticated, registerCompany);

// Route to get all companies of a logged-in recruiter (Protected route)
router.route("/get").get(isAuthenticated, getCompany);

// Route to get a specific company by its unique ID (Protected route)
router.route("/get/:id").get(isAuthenticated, getCompanyById);

// Route to update company info with an optional logo upload (Protected route using PUT method)
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;