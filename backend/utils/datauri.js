import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    // Agar file nahi aayi, toh error throw karke crash karne ki jagah null return karenge
    if (!file || !file.originalname || !file.buffer) {
        return null;
    }
    
    const parser = new DataUriParser();
    // Path module se file ka extension (jaise .png, .jpg, .pdf) nikalenge
    const extName = path.extname(file.originalname).toString();
    
    // File ke buffer data ko DataURI format me convert karke return karenge
    return parser.format(extName, file.buffer);
};

export default getDataUri;