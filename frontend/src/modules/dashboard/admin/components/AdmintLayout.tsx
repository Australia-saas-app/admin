"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Button } from "@/src/components/ui/button"
import { Pagination } from "@/src/components/ui/pagination"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"

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

const  PAGE_SIZE = 12

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
    const [page, setPage] = useState(1)
    const pageSize = 10
    const filtered = mockAdmins
    const totalPages = Math.ceil(filtered.length / pageSize)

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center justify-end mb-4">
                <Link href="/admin/add">
                    <Button >
                        create Admin
                    </Button>
                </Link>
            </div>

            <Table className="shadow" >
                <TableHeading className="bg-primary text-base-100">
                    <TableColumn className="w-16" isHeader align="center">No.</TableColumn>
                    <TableColumn isHeader align="center">Photo</TableColumn>
                    <TableColumn isHeader>Name</TableColumn>
                    <TableColumn isHeader>Roll</TableColumn>
                    <TableColumn isHeader>Position</TableColumn>
                    <TableColumn isHeader align="center">Complete Project</TableColumn>
                    <TableColumn isHeader align="center">Cancel Project</TableColumn>
                    <TableColumn isHeader align="center">Action</TableColumn>
                </TableHeading>

                <TableBody isEmpty={mockAdmins.length === 0} colSpan={8}>
                    {mockAdmins.map((row,idx) => (
                        <TableRow key={row.id}>
                            <TableColumn className="w-16 flex justify-center items-center">
                                <div className="text-center w-5 h-5 bg-primary text-white rounded">{(page - 1) * PAGE_SIZE + idx + 1}</div>
                            </TableColumn>

                            <TableColumn align="center">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 mx-auto">
                                    <img src={row.photo} alt={row.name} className="w-full h-full object-cover" />
                                </div>
                            </TableColumn>
                            <TableColumn className="text-gray-800">{row.name}</TableColumn>
                            <TableColumn className="text-gray-800">{row.role}</TableColumn>
                            <TableColumn className="text-gray-800">{row.position}</TableColumn>
                            <TableColumn align="center" className="text-gray-800">{row.completeProject}</TableColumn>
                            <TableColumn align="center" className="text-gray-800">{row.cancelProject}</TableColumn>
                            <TableColumn align="center">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${row.active ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${row.active ? "translate-x-6" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <Button size="icon" variant="ghost" className="text-gray-700 hover:text-black" aria-label="edit">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" aria-label="delete">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} pageSize={pageSize} totalResults={filtered.length} />
            </div>
        </div>
    )
}

export default AdmintLayout