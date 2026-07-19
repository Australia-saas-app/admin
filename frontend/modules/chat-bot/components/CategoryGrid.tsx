import {
  Briefcase,
  Building2,
  CircleHelp,
  CreditCard,
  FileText,
  MapPinned,
  Package,
  Plane,
  RotateCcw,
  Ship,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const CHAT_CATEGORIES: { name: string; icon: LucideIcon }[] = [
  { name: "Construction", icon: Building2 },
  { name: "Technical", icon: Wrench },
  { name: "Visa", icon: FileText },
  { name: "Orders", icon: Package },
  { name: "Export", icon: Ship },
  { name: "Travelling", icon: Plane },
  { name: "Hiring", icon: Briefcase },
  { name: "Payment", icon: CreditCard },
  { name: "Return", icon: RotateCcw },
  { name: "Advice", icon: MapPinned },
  { name: "Others", icon: CircleHelp },
];

export const CategoryGrid = ({
  onSelectCategory,
}: {
  onSelectCategory: (category: string) => void;
}) => {
  return (
    <div className="grid max-h-[min(52vh,360px)] grid-cols-2 gap-2 overflow-y-auto px-4 py-4 sm:grid-cols-3">
      {CHAT_CATEGORIES.map(({ name, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelectCategory(name)}
          className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F6B5C]/35 hover:shadow-md active:translate-y-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-primary/40"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F6B5C]/10 text-[#0F6B5C] transition group-hover:bg-[#0F6B5C] group-hover:text-white dark:bg-primary/15 dark:text-emerald-300 dark:group-hover:bg-primary dark:group-hover:text-white">
            <Icon className="h-4 w-4" />
          </span>
          <span className="truncate">{name}</span>
        </button>
      ))}
    </div>
  );
};
