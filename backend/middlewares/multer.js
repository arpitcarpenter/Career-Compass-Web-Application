import multer from "multer";

// Configure multer to store files temporarily in application RAM memory as a buffer
const storage = multer.memoryStorage();

// 🔥 FIX 1: Base multer core function instance ko export kar rahe hain taaki routes mein .fields() directly use ho sake
export const upload = multer({ storage });

// ✅ Backward Compatibility: Purane signup system ko bina chhede chalane ke liye singleUpload ko wese hi rakha hai
export const singleUpload = upload.single("file");