"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import React from 'react'

interface ActivityLog {
  id: string
  ip: string
  loginTime: string
  logoutTime: string
  deviceInfo: string
  action: string
  status: "Update" | "failed"
}

// Mock activity log data
const mockActivityLog: ActivityLog[] = [
  {
    id: "1",
    ip: "192.168.1.10",
    loginTime: "2025/07/29 10:10:30 (EST)",
    logoutTime: "2025/09/29 12:40:30 (EST)",
    deviceInfo: "Mozilla/5.0 (Windows NT 10)",
    action: "Profile photo update",
    status: "Update",
  },
  {
    id: "2",
    ip: "192.168.1.10",
    loginTime: "2025/07/29 10:10:30 (EST)",
    logoutTime: "2025/09/29 12:40:30 (EST)",
    deviceInfo: "Mozilla/5.0 (Windows NT 10)",
    action: "Profile photo update",
    status: "failed",
  },
]

export const UserLogTab: React.FC = () => {
  return (
    <div className="">
   
      <Table>
        <TableHeading>
          <TableColumn isHeader>Ip</TableColumn>
          <TableColumn isHeader>login logout time</TableColumn>
          <TableColumn isHeader>Device info</TableColumn>
          <TableColumn isHeader>action</TableColumn>
          <TableColumn isHeader>status</TableColumn>
        </TableHeading>

        <TableBody isEmpty={mockActivityLog.length === 0} colSpan={5}>
          {mockActivityLog.map((log) => (
            <TableRow key={log.id}>
              <TableColumn>{log.ip}</TableColumn>
              <TableColumn>
                <div>{log.loginTime}</div>
                <div>{log.logoutTime}</div>
              </TableColumn>
              <TableColumn>{log.deviceInfo}</TableColumn>
              <TableColumn>{log.action}</TableColumn>
              <TableColumn>
                <span
                  className={`inline-block px-3 py-1 rounded text-xs md:text-sm font-medium ${
                    log.status === "Update"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {log.status}
                </span>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserLogTab
