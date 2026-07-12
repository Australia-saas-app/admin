"use client"

import { Button } from "@/src/shared/ui/ui/button"
import { Modal } from "@/src/shared/ui/ui/modal"
import React, { useState } from 'react'

export const UserDeleteTab: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    // Handle delete action - in real app, call API
    alert("Account deleted")
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="flex items-center justify-center h-full ">
        <div className="w-full md:w-2/3 bg-white rounded-lg my-10 shadow-lg p-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Confirm Account Deletion</h2>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete the account and customer data?
          </p>
          <p className="text-gray-600 mb-4">Project due amount is 0.00</p>
          <p className="text-sm text-gray-500 mb-6">
            This action is permanent and cannot be undone
          </p>
          <Button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
          >
            Delete account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Are you absolutely sure? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default UserDeleteTab
