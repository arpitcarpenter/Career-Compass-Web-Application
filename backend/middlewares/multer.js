import multer from "multer";

// Configure multer to store files temporarily in application RAM memory as a buffer
const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const singleUpload = upload.single("file");