"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import React from "react"

interface RefundTransaction {
  id: string
  transactionId: string
  service: string
  method: string
  amount: string
  dateTime: string
  status: "Complete" | "Pending" | "Failed"
}

const mockRefundTransactions: RefundTransaction[] = [
  {
    id: "1",
    transactionId: "REF-001",
    service: "Refund Service",
    method: "Original Payment Method",
    amount: "$75.00",
    dateTime: "09 Feb 2025, 5:00 PM UTC",
    status: "Complete",
  },
  {
    id: "2",
    transactionId: "REF-002",
    service: "Refund Service",
    method: "Store Credit",
    amount: "$50.00",
    dateTime: "08 Feb 2025, 4:30 PM UTC",
    status: "Pending",
  },
  {
    id: "3",
    transactionId: "REF-003",
    service: "Refund Service",
    method: "Original Payment Method",
    amount: "$125.00",
    dateTime: "07 Feb 2025, 1:00 PM UTC",
    status: "Complete",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Complete":
      return "bg-blue-100 text-blue-700"
    case "Pending":
      return "bg-yellow-100 text-yellow-700"
    case "Failed":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export const RefundTable: React.FC = () => {
  return (
    <Table>
      <TableHeading>
        <TableColumn isHeader>Transaction ID</TableColumn>
        <TableColumn isHeader>Service</TableColumn>
        <TableColumn isHeader>Method</TableColumn>
        <TableColumn isHeader>Amount</TableColumn>
        <TableColumn isHeader>Date & Time</TableColumn>
        <TableColumn isHeader>Status</TableColumn>
        <TableColumn isHeader>Action</TableColumn>
      </TableHeading>

      <TableBody isEmpty={mockRefundTransactions.length === 0} colSpan={7}>
        {mockRefundTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableColumn>{transaction.transactionId}</TableColumn>
            <TableColumn>{transaction.service}</TableColumn>
            <TableColumn>{transaction.method}</TableColumn>
            <TableColumn className="font-semibold">{transaction.amount}</TableColumn>
            <TableColumn>{transaction.dateTime}</TableColumn>
            <TableColumn>
              <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
            </TableColumn>
            <TableColumn>
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RefundTable
