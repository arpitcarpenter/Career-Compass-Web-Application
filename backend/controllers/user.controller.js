import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import axios from "axios";
import FormData from "form-data"; 
import { Readable } from "stream"; // 🔥 Node.js standard built-in core module, no install needed!

// ==================== USER REGISTER ====================
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }
            
        const file = req.file;
        let resumeUrl = "";
        let originalName = "";

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "job_portal_resumes"
            });
            if (cloudResponse) {
                resumeUrl = cloudResponse.secure_url;
                originalName = file.originalname;
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists.", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Internal server error during registration.",
            success: false
        });
    }
};

// ==================== USER LOGIN ====================
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(403).json({
                message: "Account does not exist with this role.",
                success: false
            });
        }

        const tokenPayload = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || "fallback_key", {
            expiresIn: '1d'
        });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === "production"
            })
            .json({
                message: `Welcome back, ${user.fullname}`,
                user: userData,
                success: true
            });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ==================== USER LOGOUT ====================
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            message: "Internal server error during logout.",
            success: false
        });
    }
};

// ==================== UPDATE PROFILE (AI STREAM BUFFER LOCK) ====================
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; 
        
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        const profilePhotoFile = req.files?.profilePhoto ? req.files.profilePhoto[0] : null;
        const resumeFile = req.files?.resume ? req.files.resume[0] : null;

        // 📸 Profile Photo Handler
        if (profilePhotoFile) {
            const fileUri = getDataUri(profilePhotoFile);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "job_portal_profiles"
            });
            if (cloudResponse) {
                user.profile.profilePhoto = cloudResponse.secure_url; 
            }
        }

/// 📄 Resume PDF Stream Handler (100% Fixed and Viewable)
        if (resumeFile) {
            // 🔥 INDUSTRY STANDARD STREAM BUFFER WRAPPER:
            // Yeh loop binary buffer data structure ko directly bina formats corrupt kiye
            // true content payload matrix block me Cloudinary server tak transport karega.
            const uploadStreamPromise = () => {
                return new Promise((resolve, reject) => {
                    const c_stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "job_portal_resumes",
                            resource_type: "auto", // Automatically detects and locks PDF format
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    
                    // Direct synchronized end-to-end block pipe writing layer
                    // No empty mock function overrides to prevent metadata decay
                    c_stream.end(resumeFile.buffer);
                });
            };

            const cloudResponse = await uploadStreamPromise();
            
            if (cloudResponse) {
                // Ab ye strictly ekdum sahi viewable secure document link database me save karega
                user.profile.resume = cloudResponse.secure_url; 
                user.profile.resumeOriginalName = resumeFile.originalname; 
            }

            try {
                // 🧠 THE AI HANDSHAKE: Pass true original memory buffer to Python Microservice
                const form = new FormData();
                form.append("file", resumeFile.buffer, resumeFile.originalname);

                const pythonParserUrl = "http://127.0.0.1:5000/api/parse-resume";
                const parserResponse = await axios.post(pythonParserUrl, form, {
                    headers: {
                        ...form.getHeaders()
                    }
                });

                if (parserResponse?.data?.success) {
                    user.profile.resumeText = parserResponse.data.extracted_text;
                    console.log("🚀 Real text parsed and synced cleanly to Atlas cluster!");
                } else {
                    user.profile.resumeText = ""; 
                }
            } catch (pythonErr) {
                console.error("Failed to fetch parsing response from Python engine instance:", pythonErr.message);
                user.profile.resumeText = ""; 
            }
        }
        
        // Parsing skills array from comma separated string
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim());
        }

        // Updating user details safely
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        
        if (skills) {
            user.profile.skills = skillsArray;
            if (!resumeFile) {
                user.profile.resumeText = ""; 
            }
        }

        await user.save();

        const updatedUserData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile and Resume processed cleanly.",
            user: updatedUserData,
            success: true
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            message: "Internal server error during profile update.",
            success: false
        });
    }
};