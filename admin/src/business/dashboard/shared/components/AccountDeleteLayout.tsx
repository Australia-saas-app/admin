"use client"
import React, { useState } from "react"


const AccountDeleteLayout: React.FC<{ basePath?: string }> = () => {
  const [password, setPassword] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)

  const onConfirm = async () => {
    setConfirming(true)
    await new Promise((r) => setTimeout(r, 0))
    setConfirming(false)
    setDone(true)
  }

  return (
<div className="flex justify-center mt-10 md:mt-20 px-4  items-center">
     <div className="md:w-1/2  w-full  mx-auto bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-4">Delete Account?</h3>
  <p className="text-sm text-slate-500 mb-6">You are going to delete the account. Your account will be removed and all of your information from our database. This cannot be undone.</p>

        {!done ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Enter your password to confirm</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2" placeholder="Password" />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="px-4 py-2 rounded border" onClick={() => setPassword("")}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={onConfirm} disabled={confirming || !password}>
                {confirming ? "Removing..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-600 text-3xl">✓</div>
            <h4 className="font-semibold mt-3">Success!</h4>
            <p className="text-sm text-slate-500 mt-2">Your account has been deleted.</p>
          </div>
        )}
      </div>
</div>
  )
}

export default AccountDeleteLayout