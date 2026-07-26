import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Label } from './ui/label'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Machine Learning Engineer", "Data Scientist", "Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    
    const [selectedFilters, setSelectedFilters] = useState({
        Location: "",
        Industry: "",
        Salary: ""
    });
    
    const dispatch = useDispatch();

    
    const changeHandler = (category, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: prev[category] === value ? "" : value 
        }));
    }

    useEffect(() => {
        
        const combinedQuery = Object.values(selectedFilters)
            .filter(val => val !== "")
            .join(" ");
            
        dispatch(setSearchedQuery(combinedQuery));
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm'>
            <h1 className='font-bold text-xl text-gray-900 tracking-tight'>Filter Jobs</h1>
            <hr className='mt-3 mb-5 border-gray-100' />
            
            <div className="space-y-6">
                {
                    filterData.map((data, index) => (
                        <div key={index} className="space-y-3">
                            <h2 className='font-bold text-sm text-gray-400 tracking-wider uppercase font-mono'>
                                {data.filterType}
                            </h2>
                            <div className="space-y-2">
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`;
                                        
                                        
                                        const isSelected = selectedFilters[data.filterType] === item;

                                        return (
                                            <div 
                                                key={itemId} 
                                                onClick={() => changeHandler(data.filterType, item)}
                                                className='flex items-center space-x-3 py-1 group cursor-pointer'
                                            >
                                                {/* CUSTOM RADIO COMPONENT */}
                                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                                                    isSelected 
                                                    ? 'border-indigo-600 bg-indigo-50' 
                                                    : 'border-gray-300 group-hover:border-gray-400'
                                                }`}>
                                                    {/* Internal Selected Dot */}
                                                    {isSelected && (
                                                        <div className='h-2 w-2 rounded-full bg-indigo-600' />
                                                    )}
                                                </div>

                                                <Label 
                                                    htmlFor={itemId} 
                                                    className={`text-sm font-medium cursor-pointer transition-colors ${
                                                        isSelected ? 'text-indigo-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'
                                                    }`}
                                                >
                                                    {item}
                                                </Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FilterCard;