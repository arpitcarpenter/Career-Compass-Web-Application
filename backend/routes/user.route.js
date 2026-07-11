import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
// 🔥 upload object ko import kar rahe hain custom fields dynamic mapping ke liye
import { upload } from "../middlewares/multer.js"; 

const router = express.Router();

// Route for user registration (Yahan single file chalegi)
router.route("/register").post(upload.single("file"), register);

// Route for user login
router.route("/login").post(login);

// Route for user logout
router.route("/logout").get(logout);

// 🔥 FIX: Profile Update ab dono streams (profilePhoto aur resume) ek sath safely handle karega!
router.route("/profile/update").post(
    isAuthenticated, 
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 }, // 📸 Profile Image Field
        { name: 'resume', maxCount: 1 }        // 📄 Resume PDF Field
    ]), 
    updateProfile
);

export default router;