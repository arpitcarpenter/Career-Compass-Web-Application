import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ==================== REGISTER NEW COMPANY ====================
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
       
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if the company name already exists in the database
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You cannot register a company with the same name.",
                success: false
            });
        }

        // Create a new company record linked to the authenticated user ID
        company = await Company.create({
            name: companyName,
            userId: req.id // Retrieved from authentication middleware
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Register Company Error:", error.message);
        return res.status(500).json({
            message: "Internal server error during company registration.",
            success: false
        });
    }
};

// ==================== GET ALL COMPANIES OF LOGGED IN USER ====================
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // Logged in user ID from auth middleware
        const companies = await Company.find({ userId });
        
        // Return companies list (it will be empty array if none found, which frontend can handle gracefully)
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error("Get Company Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while fetching companies.",
            success: false
        });
    }
};

// ==================== GET COMPANY BY SPECIFIC ID ====================
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; // Extract company ID from request URL parameters
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("Get Company By ID Error:", error.message);
        return res.status(500).json({
            message: "Internal server error while retrieving company details.",
            success: false
        });
    }
};

// ==================== UPDATE COMPANY DETAILS ====================
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const updateData = { name, description, website, location };

        // Handle file/logo upload only if a file is explicitly provided
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            if (cloudResponse) {
                updateData.logo = cloudResponse.secure_url; // Inject the secure URL into update packet
            }
        }

        // Find the company by ID and apply the updated payload
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Update Company Error:", error.message);
        return res.status(500).json({
            message: "Internal server error during company profile update.",
            success: false
        });
    }
};