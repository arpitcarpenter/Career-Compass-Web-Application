import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './shared/Navbar'
import Job from './Job' // ✅ Hum tere standard 'Job' component cards ko hi use kar rahe hain
import { JOB_API_END_POINT } from '../utils/constant'
import { Loader2, Sparkles } from 'lucide-react'

const AIRecommendations = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchAIRecommendations = async () => {
            try {
                setLoading(true);
                // 📡 Node.js Express ke naye controller handler ko hit kiya
                const res = await axios.get(`${JOB_API_END_POINT}/ai-recommendations`, {
                    withCredentials: true
                });

                if (res?.data?.success) {
                    setRecommendedJobs(res.data.jobs || []);
                }
            } catch (error) {
                console.error("Vector recommendation data-stream error:", error);
                setErrorMsg(error.response?.data?.message || "Please update your profile skills first to calculate matrices weights.");
            } finally {
                setLoading(false);
            }
        };

        fetchAIRecommendations();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
                
                {/* ✨ Premium Data Science Feature Header Layout */}
                <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm mb-8">
                    <div className="p-3 bg-purple-50 rounded-xl">
                        <Sparkles className="w-7 h-7 text-purple-600 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI-Powered Smart Recommendations</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Our NLP pipeline computes cosine-similarity weights between your profile skills vector and the active jobs corpus requirements matrix.
                        </p>
                    </div>
                </div>

                {loading ? (
                    /* ⏳ Data Science Execution Loader Ring */
                    <div className="flex flex-col items-center justify-center my-24 gap-3 bg-white p-12 rounded-2xl border border-gray-100 shadow-xs">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                        <p className="text-gray-500 font-semibold text-sm tracking-wide">Running TF-IDF Vector Space Analysis Matrix...</p>
                    </div>
                ) : errorMsg ? (
                    /* 🚨 Fallback Warning Alert if profile matrix is empty */
                    <div className="bg-amber-50 border border-orange-200 text-orange-800 p-6 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
                        <h3 className="font-bold text-base mb-1">Profile Vector Missing</h3>
                        <p className="text-sm text-orange-700 font-medium">{errorMsg}</p>
                    </div>
                ) : recommendedJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs">
                        <p className="text-gray-400 font-medium text-sm">No workspace blueprints matched current parameter indexes.</p>
                    </div>
                ) : (
                    /* 📊 Dynamically Ranked Job Elements Grid Mapping */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedJobs.map((job) => (
                            // Natively using your existing Job Card logic which now handles 'job.matchScore'
                            <Job key={job?._id || Math.random()} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AIRecommendations;