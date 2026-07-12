"use client"

import React from "react"

export const InfoTab: React.FC = () => {
  return (
    <div className="shadown border rounded-lg p-8 space-y-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-base font-medium text-gray-900">USR001</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <p className="text-base font-medium text-gray-900">PENDING</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Sub Category</p>
            <p className="text-base font-medium text-gray-900">Web Development</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Duration</p>
            <p className="text-base font-medium text-gray-900">02 Mar 2021 - 03 Jun 2024</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-base font-medium text-gray-900">110 USD</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Paid Amount</p>
            <p className="text-base font-medium text-gray-900">110 USD</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Due Amount</p>
            <p className="text-base font-medium text-gray-900">0 USD</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Profits</p>
            <p className="text-base font-medium text-gray-900">-</p>
          </div>
        </div>
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-2">Description</p>
          <p className="text-gray-700 leading-relaxed">
            A comprehensive web development project including frontend, backend, and database design. The project includes responsive design, user authentication, and payment integration.
          </p>
        </div>
      </div>
    </div>
  )
}
