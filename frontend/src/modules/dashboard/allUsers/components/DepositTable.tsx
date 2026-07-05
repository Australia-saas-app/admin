"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import React from "react"

interface DepositTransaction {
  id: string
  transactionId: string
  service: string
  method: string
  amount: string
  dateTime: string
  status: "Complete" | "Pending" | "Failed"
}

const mockDepositTransactions: DepositTransaction[] = [
  {
    id: "1",
    transactionId: "DEP-001",
    service: "Deposit Service",
    method: "PayPal",
    amount: "$500.00",
    dateTime: "09 Feb 2025, 2:00 PM UTC",
    status: "Complete",
  },
  {
    id: "2",
    transactionId: "DEP-002",
    service: "Deposit Service",
    method: "Bank Transfer",
    amount: "$1,000.00",
    dateTime: "08 Feb 2025, 1:30 PM UTC",
    status: "Complete",
  },
  {
    id: "3",
    transactionId: "DEP-003",
    service: "Deposit Service",
    method: "Credit Card",
    amount: "$250.00",
    dateTime: "07 Feb 2025, 10:15 AM UTC",
    status: "Pending",
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

export const DepositTable: React.FC = () => {
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

      <TableBody isEmpty={mockDepositTransactions.length === 0} colSpan={7}>
        {mockDepositTransactions.map((transaction) => (
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

export default DepositTable
