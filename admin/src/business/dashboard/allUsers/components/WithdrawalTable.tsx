"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/shared/ui/table"
import { Badge } from "@/src/shared/ui/ui/badge"
import { Button } from "@/src/shared/ui/ui/button"
import React from "react"

interface WithdrawalTransaction {
  id: string
  transactionId: string
  service: string
  method: string
  amount: string
  dateTime: string
  status: "Complete" | "Pending" | "Failed"
}

const mockWithdrawalTransactions: WithdrawalTransaction[] = [
  {
    id: "1",
    transactionId: "WTH-001",
    service: "Withdrawal Service",
    method: "Bank Transfer",
    amount: "$300.00",
    dateTime: "09 Feb 2025, 3:00 PM UTC",
    status: "Complete",
  },
  {
    id: "2",
    transactionId: "WTH-002",
    service: "Withdrawal Service",
    method: "PayPal",
    amount: "$150.00",
    dateTime: "08 Feb 2025, 2:30 PM UTC",
    status: "Pending",
  },
  {
    id: "3",
    transactionId: "WTH-003",
    service: "Withdrawal Service",
    method: "Bank Transfer",
    amount: "$500.00",
    dateTime: "07 Feb 2025, 11:00 AM UTC",
    status: "Failed",
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

export const WithdrawalTable: React.FC = () => {
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

      <TableBody isEmpty={mockWithdrawalTransactions.length === 0} colSpan={7}>
        {mockWithdrawalTransactions.map((transaction) => (
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

export default WithdrawalTable
