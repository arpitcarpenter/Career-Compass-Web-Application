import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { setSearchedQuery } from '@/redux/jobSlice';

// 🧠 ML Focused Track Descriptors: Enriched array displaying domains matching data science stacks
const categories = [
    "Machine Learning Engineer",
    "Data Scientist",
    "FullStack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handler route initializing search workflows across active system pipelines
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="w-full">
            {/* Base carousel wrapper utilizing structural layout frames layout limits */}
            <Carousel className="w-full max-w-xl mx-auto my-16 px-4">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {
                        categories.map((cat, index) => (
                            // 🛠️ Bug Fix: Rectified standard tailwind class alias string from "lg-basis" to "lg:basis"
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center">
                                <Button 
                                    onClick={() => searchJobHandler(cat)} 
                                    variant="outline" 
                                    className="rounded-full font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-sm shadow-sm px-6 py-2 whitespace-nowrap"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-12" />
                <CarouselNext className="hidden sm:flex -right-12" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel;