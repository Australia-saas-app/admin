"use client"

import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account"

const PENALTY_RECORDS = [
  { id: "PEN-001", reason: "Late project delivery", amount: "$25", date: "2025/06/12", status: "Resolved" },
  { id: "PEN-002", reason: "Policy violation — spam listing", amount: "$50", date: "2025/05/03", status: "Active" },
]

export default function PenaltyLayout() {
  const { demoOrEmpty } = useIsDemoAccount()
  const penalties = demoOrEmpty(PENALTY_RECORDS, [] as typeof PENALTY_RECORDS)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Penalty</h3>
      <p className="text-sm text-gray-500 mb-6">Penalty records and compliance actions for this business account.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">ID</th>
              <th className="pb-3 pr-4 font-medium">Reason</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {penalties.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  No penalty records.
                </td>
              </tr>
            ) : (
              penalties.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-600">{row.id}</td>
                  <td className="py-3 pr-4 text-gray-800">{row.reason}</td>
                  <td className="py-3 pr-4 font-medium text-gray-800">{row.amount}</td>
                  <td className="py-3 pr-4 text-gray-500">{row.date}</td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        row.status === "Active" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
