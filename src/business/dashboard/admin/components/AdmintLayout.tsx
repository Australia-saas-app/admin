"use client"

import { Pagination } from "@/src/shared/ui/ui/pagination"
import { Pencil, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { SearchInput } from "@/src/shared/ui/form/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/ui/select"
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"

type AdminRow = {
    id: number
    name: string
    role: string
    position: string
    photo: string
    completeProject: number
    cancelProject: number
    active: boolean
}



const mockAdmins: AdminRow[] = [
    {
        id: 4,
        name: "mr jack",
        role: "Super Admin",
        position: "tast",
        photo: "https://i.pravatar.cc/80?img=12",
        completeProject: 25,
        cancelProject: 25,
        active: true,
    },
    {
        id: 3,
        name: "mr jack",
        role: "Manager",
        position: "tast",
        photo: "https://i.pravatar.cc/80?img=18",
        completeProject: 24,
        cancelProject: 24,
        active: true,
    },
    {
        id: 2,
        name: "mr jack",
        role: "Manager",
        position: "tast",
        photo: "https://i.pravatar.cc/80?img=32",
        completeProject: 27,
        cancelProject: 27,
        active: true,
    },
    {
        id: 1,
        name: "mr jack",
        role: "Manager",
        position: "tast",
        photo: "https://i.pravatar.cc/80?img=41",
        completeProject: 36,
        cancelProject: 36,
        active: false,
    },
]

const AdmintLayout: React.FC = () => {
    const [query, setQuery] = useState("")
    const [role, setRole] = useState("All Roles")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const filtered = mockAdmins.filter(admin => {
        const matchesQuery = admin.name.toLowerCase().includes(query.toLowerCase())
        const matchesRole = role === "All Roles" || admin.role === role
        return matchesQuery && matchesRole
    })
    
    const totalResults = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize))
    const paginatedItems = filtered.slice((page - 1) * pageSize, page * pageSize)

    return (
        <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
            <div className="flex flex-col gap-6 w-full">
                {/* Toolbar */}
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full">
                    <div className="w-full xl:w-80 flex-shrink-0">
                        <SearchInput 
                            value={query} 
                            onChange={setQuery} 
                            placeholder="Search by name..." 
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto xl:ml-auto">
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-full sm:w-[160px] flex-shrink-0">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[100]">
                                <SelectItem value="All Roles" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Roles</SelectItem>
                                <SelectItem value="Super Admin" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Super Admin</SelectItem>
                                <SelectItem value="Manager" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Link href="/admin/add">
                            <button className="flex items-center justify-center gap-2 px-4 h-10 rounded-xl font-bold text-sm shadow-sm transition-all bg-blue-600 text-white hover:bg-blue-700">
                                <Plus className="w-4 h-4" />
                                <span>Create Admin</span>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-2">
                    <Table>
                        <TableHeading>
                            <TableColumn isHeader align="center" className="w-16">No.</TableColumn>
                            <TableColumn isHeader align="center">Photo</TableColumn>
                            <TableColumn isHeader align="left">Name</TableColumn>
                            <TableColumn isHeader align="left">Role</TableColumn>
                            <TableColumn isHeader align="left">Position</TableColumn>
                            <TableColumn isHeader align="center">Complete Project</TableColumn>
                            <TableColumn isHeader align="center">Cancel Project</TableColumn>
                            <TableColumn isHeader align="center">Action</TableColumn>
                        </TableHeading>
                        <tbody>
                            {paginatedItems.length === 0 ? (
                                <TableRow>
                                    <TableColumn colSpan={8}>
                                        <div className="flex flex-col items-center justify-center gap-3 py-10">
                                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No admins found</h3>
                                        </div>
                                    </TableColumn>
                                </TableRow>
                            ) : (
                                paginatedItems.map((row, idx) => (
                                    <TableRow key={row.id}>
                                        <TableColumn align="center">
                                            <div className="flex justify-center items-center">
                                                <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                                                    {(page - 1) * pageSize + idx + 1}
                                                </div>
                                            </div>
                                        </TableColumn>
                                        <TableColumn align="center">
                                            <div className="flex justify-center">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm ring-2 ring-slate-100 dark:ring-slate-700">
                                                    <img src={row.photo} alt={row.name} className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </TableColumn>
                                        <TableColumn className="font-bold">{row.name}</TableColumn>
                                        <TableColumn>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                {row.role}
                                            </span>
                                        </TableColumn>
                                        <TableColumn className="font-medium text-slate-600 dark:text-slate-400">{row.position}</TableColumn>
                                        <TableColumn align="center" className="font-bold">{row.completeProject}</TableColumn>
                                        <TableColumn align="center" className="font-bold">{row.cancelProject}</TableColumn>
                                        <TableColumn align="center">
                                            <div className="flex items-center justify-center gap-3">
                                                {/* Toggle Switch */}
                                                <button
                                                    type="button"
                                                    className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 shadow-inner ${row.active ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
                                                >
                                                    <span
                                                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${row.active ? "translate-x-5" : "translate-x-0"}`}
                                                    />
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center shadow-sm">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </TableColumn>
                                    </TableRow>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination Footer */}
                    <div className="mt-4 w-full">
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={(p) => setPage(p)} 
                            pageSize={pageSize} 
                            totalResults={totalResults} 
                            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdmintLayout