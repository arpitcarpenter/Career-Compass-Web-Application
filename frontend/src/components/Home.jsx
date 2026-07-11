import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Home = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    // 🔥 Humesha jobs fetch karo taaki anonymous (new) user ko bhi cards home page par dikhein
    useGetAllJobs();

    useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/companies");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main>
                <HeroSection />
                <CategoryCarousel />
                
                {/* 🔥 Ab conditional display hata diya, humesha dikhegi latest openings */}
                <LatestJobs />
            </main>
            <Footer />
        </div>
    )
}

export default Home;