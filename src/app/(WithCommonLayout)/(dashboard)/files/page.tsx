import React from 'react'
import FilesLayout from '@/src/business/dashboard/files/components/FilesLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Files | Dashboard',
  description: 'Manage files and view storage details',
}

export default function FilesPage() {
  return (
    <FilesLayout />
  )
}
