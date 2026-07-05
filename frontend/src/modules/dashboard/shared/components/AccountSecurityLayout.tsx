"use client"

import React, { useState } from "react"

const AccountSecurityLayout: React.FC<{ basePath?: string }> = () => {
  const [enabled, setEnabled] = useState(false)
  const method = "abc@gmail.com"

  const toggle = async () => {
    // simple simulation
    setEnabled((v) => !v)
  }

  return (
    <div className="flex justify-center mt-10 md:mt-20 px-4  items-center">
   <div className="md:w-1/2  w-full  mx-auto bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-3">Two-Factor Authentication</h3>
        <p className="text-sm text-slate-500 mb-4">Select the phone number or email you want to verify the OTP on</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{method}</div>
              <div className="text-xs text-slate-500">Your OTP verification method</div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Disable 2FA</span>
              <div className="flex items-center gap-2">
                <button className={`px-3 py-1 rounded ${!enabled ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`} onClick={() => setEnabled(false)}>OFF</button>
                <button className={`px-3 py-1 rounded ${enabled ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`} onClick={toggle}>ON</button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">Turning off 2-step verification will remove the extra security on your account.</div>
        </div>
      </div>
    </div>

  )
}

export default AccountSecurityLayout