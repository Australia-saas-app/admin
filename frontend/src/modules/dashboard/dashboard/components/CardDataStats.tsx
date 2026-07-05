"use client";
import React from "react";

type CardItem = {
  name: string;
  icon?: any;
  number?: number;
};

const BG_PRESETS = [
  "bg-[#ECFDF5]",
  "bg-[#F3F4FF]",
  "bg-[#FFF7ED]",
  "bg-[#FEF3F2]",
];

const CardDataStats: React.FC<{ item: CardItem; index: number }> = ({
  item,
  index,
}) => {
  const Icon = item.icon || null;

  const fmt = (n?: number) => {
    if (!n && n !== 0) return "0";
    if (n >= 1000) return `${(n / 1000).toFixed(2).replace(/\.00$/, "") }K`;
    return String(n);
  };

  return (
    <div
      className={`rounded-xl shadow-sm p-4 flex flex-col justify-between min-h-[80px] ${BG_PRESETS[index % BG_PRESETS.length]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-gray-600">{item.name}</p>
        </div>
        {Icon ? (
          <div className="rounded-md p-2 bg-white/60">
            <Icon className="text-xl text-gray-700" />
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="text-2xl font-semibold text-black">{fmt(item.number)}</p>
      </div>
    </div>
  );
};

export default CardDataStats;
