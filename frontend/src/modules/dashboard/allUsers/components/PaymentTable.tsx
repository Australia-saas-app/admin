"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import React from "react"

interface PaymentTransaction {
  id: string
  transactionId: string
  service: string
  method: string
  amount: string
  dateTime: string
  status: "Complete" | "Pending" | "Failed"
}

const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: "1",
    transactionId: "PAY-001",
    service: "Payment Service",
    method: "Credit Card",
    amount: "$200.00",
    dateTime: "09 Feb 2025, 4:00 PM UTC",
    status: "Complete",
  },
  {
    id: "2",
    transactionId: "PAY-002",
    service: "Payment Service",
    method: "Debit Card",
    amount: "$350.00",
    dateTime: "08 Feb 2025, 3:30 PM UTC",
    status: "Complete",
  },
  {
    id: "3",
    transactionId: "PAY-003",
    service: "Payment Service",
    method: "Credit Card",
    amount: "$120.00",
    dateTime: "07 Feb 2025, 12:00 PM UTC",
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

export const PaymentTable: React.FC = () => {
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

      <TableBody isEmpty={mockPaymentTransactions.length === 0} colSpan={7}>
        {mockPaymentTransactions.map((transaction) => (
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

export default PaymentTable
