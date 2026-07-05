"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Button } from "@/src/components/ui/button"
import PageHeader from "@/src/components/ui/PageHeader"
import { Pagination } from "@/src/components/ui/pagination"
import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Trash2, Edit2, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import FormatDate from "@/src/utils/FormatDate"

const PAGE_SIZE = 10

interface PlatformLayoutProps {
  title: string
  fetchItems: (page: number, limit: number) => Promise<any>
  onAddClick: () => void
  onEditClick: (id: string) => void
  onToggleVisibilityClick: (id: string) => void
  onDeleteClick: (id: string) => void
  onViewClick: (id: string) => void
  refreshKey?: number
  extraColumns?: React.ReactNode
  renderExtraCells?: (item: any) => React.ReactNode
  colSpan?: number
  onSearch?: (query: string) => void
  search?: string
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({
  title, fetchItems, onAddClick, onEditClick, onToggleVisibilityClick, onDeleteClick, onViewClick,
  refreshKey = 0, extraColumns, renderExtraCells, onSearch, search: externalSearch
}) => {
  const [items, setItems] = useState<any[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [localSearch, setLocalSearch] = useState("")

  const isTeam = title.toLowerCase() === "our team";
  const isBlog = title.toLowerCase() === "blog";
  const isBranch = title.toLowerCase() === "branches";
  const isCompany = title.toLowerCase() === "company";
  const isContact = title.toLowerCase() === "contact us";

  const loadData = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const response = await fetchItems(page, PAGE_SIZE)
      setItems(response?.data || [])
      setTotalItems(response?.total || 0)
    } catch (err) {
      console.error("Failed to load items:", err)
    } finally { setLoading(false) }
  }, [fetchItems])

  useEffect(() => { loadData(currentPage) }, [currentPage, loadData, refreshKey])

  return (
    <div className="mt-5">
      <PageHeader
        title={title}
        right={
          <div className="flex gap-2 items-center">
            <input
              value={externalSearch ?? localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                onSearch?.(e.target.value)
              }}
              placeholder="Search..."
              className="border px-2 py-1 border-secondary rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {
              !isContact && (
                <Button onClick={onAddClick}>Create</Button>
              )
            }
          </div>
        }
      />
      <div className="mt-4">
        {loading ? (
          <div className="p-12 text-center text-gray-500 italic flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading data...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border shadow-sm">
            {
              items.length === 0 ? (
                <div className="p-12 text-center text-gray-500 italic">No {title.toLowerCase()} found.</div>
              ) : (
                <>
                  <Table className="w-full ">
                    <TableHeading className="bg-primary text-base-100">
                      {
                        !isBranch && !isTeam && !isCompany && !isContact && (
                          <TableColumn isHeader align="left">Title</TableColumn>
                        )
                      }

                      {/* Custom columns for specific pages */}
                      {extraColumns}

                      {/* ✅ Strictly conditionalized to prevent whitespace */}

                      {
                        !isContact && (
                          <TableColumn isHeader align="center">Visibility</TableColumn>
                        )
                      }


                      <TableColumn isHeader align="center">Created At</TableColumn>
                      <TableColumn isHeader align="center">Action</TableColumn>
                    </TableHeading>

                    <TableBody isEmpty={items.length === 0} colSpan={12}>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          {
                            !isBranch && !isTeam && !isCompany && !isContact && (
                              <TableColumn title={item.title} className="font-semibold text-gray-800">
                                {item.title}
                              </TableColumn>
                            )
                          }

                          {/* Custom cells for specific pages */}
                          {renderExtraCells && renderExtraCells(item)}

                          {/* ✅ Strictly conditionalized to match the header */}

                         
                         {
                            !isContact && (
                               <TableColumn align="center">
                            <Badge className={item.isVisible ? "bg-green-500 text-white" : "bg-gray-600 text-white"}>
                              {item.isVisible ? "Visible" : "Hidden"}
                            </Badge>

                          </TableColumn>
                            )
                         }


                          <TableColumn align="center" title={FormatDate(item.createdAt)}>
                            {FormatDate(item.createdAt)}
                          </TableColumn>

                          <TableColumn align="center">
                            <div className="flex justify-center gap-1">
                              <button className="cursor-pointer" onClick={() => onViewClick(item.id)} title="View Details">
                                <Eye size={16} className="text-gray-600" />
                              </button>

                              {
                                !isContact && (
                                  <>
                                    <button className="cursor-pointer" onClick={() => onToggleVisibilityClick(item.id)} title="Toggle Visibility">
                                      {/* <ToggleLeft size={16} className="text-blue-500" /> */}
                                      {item.isVisible ? (
                                        <ToggleRight size={16} className="text-green-500" />
                                      ) : (
                                        <ToggleLeft size={16} className="text-gray-400" />
                                      )}

                                    </button>
                                    <button className="cursor-pointer" onClick={() => onEditClick(item.id)} title="Edit Item">
                                      <Edit2 size={16} className="text-blue-500" />
                                    </button>
                                    <button className="cursor-pointer" onClick={() => onDeleteClick(item.id)} title="Delete Item">
                                      <Trash2 size={16} className="text-red-500" />
                                    </button>
                                  </>
                                )
                              }

                              {/* Toggle Visibility Button */}
                            </div>
                          </TableColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )
            }
          </div>
        )}

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(totalItems / PAGE_SIZE))}
            pageSize={PAGE_SIZE}
            totalResults={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default PlatformLayout