"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { useRouter } from "next/navigation"
import React from "react"
import type { AffiliateRow } from "./affiliates.types"

interface Props {
  items: AffiliateRow[]
  onView?: (id: string) => void
}

const statusVariant = (s: AffiliateRow["status"]) => {
  switch (s) {
    case "ACTIVE":
      return "bg-green-100 text-green-700"
    case "SUSPEND":
      return "bg-pink-100 text-pink-700"
    case "DORMANT":
      return "bg-gray-200 text-gray-700"
    case "CLOSED":
      return "bg-yellow-100 text-yellow-800"
    case "BLOCK":
      return "bg-red-100 text-red-700"
    default:
      return ""
  }
}

const AffiliatesTable: React.FC<Props> = ({ items, onView }) => {
  const router = useRouter()

  const handleView = (affiliateId: string) => {
    router.push(`/all-affiliates/${affiliateId}`)
    onView?.(affiliateId)
  }

  return (
    <Table className="shadow">
      <TableHeading className="bg-primary text-base-100">
        <TableColumn isHeader>Affiliate ID</TableColumn>
        <TableColumn isHeader align="left">Industry Type</TableColumn>
        <TableColumn isHeader align="center">Total Customer</TableColumn>
        <TableColumn isHeader align="center">Referrals</TableColumn>
        <TableColumn isHeader align="center">Commission Rate</TableColumn>
        <TableColumn isHeader align="center">Earnings Amount</TableColumn>
        <TableColumn isHeader align="center">Level</TableColumn>
        <TableColumn isHeader align="center">Status</TableColumn>
        <TableColumn isHeader align="center">Action</TableColumn>
      </TableHeading>

      <TableBody isEmpty={items.length === 0} colSpan={9}>
        {items.map((row) => (
          <TableRow key={row.id}>
            <TableColumn>{row.affiliateId}</TableColumn>
            <TableColumn align="left">{row.industryType ?? "-"}</TableColumn>
            <TableColumn align="center">{row.totalCustomer}</TableColumn>
            <TableColumn align="center">{row.referrals}</TableColumn>
            <TableColumn align="center">{row.commissionRate}</TableColumn>
            <TableColumn align="center">{row.earningsAmount}</TableColumn>
            <TableColumn align="center">{row.level ?? "-"}</TableColumn>
            <TableColumn align="center">
              <div className="flex justify-center">
                <Badge className={statusVariant(row.status)}>{row.status}</Badge>
              </div>
            </TableColumn>
            <TableColumn align="center">
              <div className="flex justify-center">
                <Button size="sm" onClick={() => handleView(row.affiliateId)}>VIEW</Button>
              </div>
            </TableColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AffiliatesTable
