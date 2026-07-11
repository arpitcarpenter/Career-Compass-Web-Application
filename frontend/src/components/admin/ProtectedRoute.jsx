import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Extracting authenticated user state metadata from Redux auth storage slice
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Security Check: Redirects to landing page if user is unauthenticated or not a recruiter
        if (user === null || user?.role !== 'recruiter') {
            navigate("/");
        }
    // 🛠️ Bug Fix: Added explicit dependencies to maintain state accuracy during render cycles
    }, [user, navigate]);

    return (
        <>
            {children}
        </>
    )
};

export default ProtectedRoute;