import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { setSearchedQuery } from '@/redux/jobSlice'

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handler core route initializing search workflows across vector states
    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    }

    return (
        <div className="relative bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 py-28 overflow-hidden">
            {/* Ambient neural grid pattern overlay container */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto text-center text-white px-4">
                <div className="flex flex-col gap-6 items-center">
                    {/* ML Driven Headline Accent */}
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold uppercase tracking-wider shadow-inner">
                         AI-Powered Job Matching
                    </span>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none tracking-tight">
                        Search, Match & <br />
                        Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Dream Jobs</span>
                    </h1>

                    <p className="text-base sm:text-lg max-w-2xl mx-auto mt-2 text-slate-300 font-medium">
                        Discover the best job opportunities, connect with top companies, and land your dream job with ease.
                    </p>
                    
                    {/* Input Wrapper Field Box */}
                    <div className="flex w-full max-w-xl mx-auto mt-6 bg-white shadow-2xl shadow-indigo-950/20 border border-gray-100 rounded-full items-center overflow-hidden p-1">
                        <input
                            type="text"
                            placeholder="Find your dream jobs"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown} // Attached native keyboard parser hook
                            className="outline-none border-none w-full py-3 px-5 text-gray-800 placeholder-gray-400 text-sm font-medium bg-transparent"
                        />
                        <Button
                            onClick={searchJobHandler}
                            className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white rounded-full h-11 px-6 shadow-md shadow-indigo-600/10"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;