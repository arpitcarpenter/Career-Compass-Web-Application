import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const CompaniesTable = () => {
    // 🛠️ Safe Fallback: Agar store khali ho toh empty array default set rahega
    const { companies = [], searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 🛠️ Crash Fix: Safe check kiya taaki length check par null pointer error na aaye
        const filteredCompany = companies?.length > 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany || []);
    }, [companies, searchCompanyByText]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                    No companies found. Please register a company first.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterCompany?.map((company) => (
                                // 🛠️ Bug Fix: Standard Shadcn TableRow use kiya aur unique 'key' add ki
                                <TableRow key={company?._id || Math.random()}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={company?.logo} alt={`${company?.name} logo`} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-800">
                                        {company?.name}
                                    </TableCell>
                                    <TableCell>
                                        {/* 🛠️ Crash Protection: Date agar undefined ho toh code crash nahi hoga */}
                                        {company?.createdAt ? company.createdAt.split("T")[0] : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-2">
                                                <div 
                                                    onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                                    className='flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors'
                                                >
                                                    <Edit2 className='w-4 h-4' />
                                                    <span className="text-sm font-medium">Edit</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable;