"use client"

interface LevelProgressSectionProps {
  title?: string
  completedLabel: string
  fillPercent: number
  milestones: string[]
  completedCount: number
}

export default function LevelProgressSection({
  title = "Level Progress",
  completedLabel,
  fillPercent,
  milestones,
  completedCount,
}: LevelProgressSectionProps) {
  return (
    <div className="flex flex-col mt-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-medium text-gray-800">{title}</h4>
        <span className="text-sm text-gray-600 font-medium">{completedLabel}</span>
      </div>
      <div className="relative pt-2 pb-6">
        <div className="absolute top-3 left-0 w-full h-2.5 bg-[#e2e8f0] rounded-full" />
        <div
          className="absolute top-3 left-0 h-2.5 bg-[#3b82f6] rounded-full transition-all"
          style={{ width: `${fillPercent}%` }}
        />
        <div className="relative flex justify-between px-1 items-center">
          {milestones.map((level, idx) => (
            <div key={level} className="flex flex-col items-center gap-2 -translate-y-0.5">
              <div
                className={`w-3.5 h-3.5 rounded-full z-10 border-2 border-white shadow-sm ${
                  idx < completedCount ? "bg-[#3b82f6]" : "bg-[#cbd5e1]"
                }`}
              />
              <span className="text-[10px] text-gray-500 font-medium text-center max-w-[52px] leading-tight">
                {level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
