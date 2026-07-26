
// dns.setDefaultResultOrder('ipv4first');
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import dns from 'dns';


//Change DNS

dns.setServers(["1.1.1.1","8.8.8.8"]);


// Route imports
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// Load environment variables
dotenv.config();

const app = express();

//  Allowed frontend origins (Local development + Vercel Deployment)
const allowedOrigins = [
    "http://localhost:5173",
    "https://job-portal-frontend-neon.vercel.app"
];

//  CORS configuration with local testing support
const corsOptions = {
    origin: function (origin, callback) {
        console.log("🔍 Incoming request origin:", origin);
        // Local testing (Postman/Direct requests) me origin undefined hota hai, use allow karenge
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn("❌ Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};

//  Apply CORS before routes
app.use(cors(corsOptions));

//  Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

//  Start server
const PORT = process.env.PORT || 8000; // Hum isse 8000 port par default rakhenge hamare env ke mutabik

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running at port ${PORT}`);
});