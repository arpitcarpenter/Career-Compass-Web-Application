import jwt from "jsonwebtoken";

// Middleware to verify if the user is authenticated via JWT token
const isAuthenticated = (req, res, next) => {
    try {
        // Retrieve the token from the request cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify the token using the SECRET_KEY from environment variables
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        
        // Attach the decoded userId to the request object so next controllers can access it
        req.id = decode.userId;
        
        // Pass control to the next middleware or controller function
        next();
    } catch (error) {
        console.error("Authentication Middleware Error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
};

export default isAuthenticated;