"use client";

type AccountTabType = "user" | "affiliate" | "business";

interface AccountTypeTabsProps {
  value: AccountTabType;
  onChange: (type: AccountTabType) => void;
}

const TABS: {
  id: AccountTabType;
  label: string;
  active: string;
}[] = [
  {
    id: "user",
    label: "User",
    active: "bg-card text-[#2563EB] shadow-sm ring-1 ring-[#2563EB]/20 dark:text-blue-300",
  },
  {
    id: "affiliate",
    label: "Affiliate",
    active: "bg-card text-[#16A34A] shadow-sm ring-1 ring-[#16A34A]/20 dark:text-green-300",
  },
  {
    id: "business",
    label: "Business",
    active: "bg-card text-[#7C3AED] shadow-sm ring-1 ring-[#7C3AED]/20 dark:text-purple-300",
  },
];

export function AccountTypeTabs({ value, onChange }: AccountTypeTabsProps) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-lg px-2 py-2 text-sm font-semibold transition-all sm:px-3 ${
            value === tab.id ? tab.active : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
