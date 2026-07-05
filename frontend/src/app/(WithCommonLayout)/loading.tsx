import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sky-50 px-6">
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-20 h-20 rounded-full border-8 border-t-indigo-600 border-gray-200 animate-spin"
          role="status"
          aria-label="Loading"
        />

        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">Loading…</p>
          <p className="text-sm text-slate-500">Preparing the best experience for you.</p>
        </div>
      </div>
    </div>
  )
}

export default Loading