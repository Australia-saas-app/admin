"use client";

interface VisaStampImageProps {
  selected?: boolean;
}

export function VisaStampImage({ selected = false }: VisaStampImageProps) {
  return (
    <div
      className={`relative w-full h-24 sm:h-28 rounded overflow-hidden ${
        selected ? "ring-1 ring-[#1e1e40]" : ""
      }`}
    >
      <div className="absolute inset-0 bg-[#e8edf0]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #94a3b8 0, #94a3b8 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div
          className={`w-[76%] h-[70%] rounded border border-dashed flex flex-col items-center justify-center rotate-[-8deg] shadow-sm ${
            selected ? "border-[#1e1e40]/50 bg-card/90" : "border-[#1e1e40]/35 bg-card/80"
          }`}
        >
          <span className="text-[8px] font-bold tracking-[0.3em] text-[#1e1e40]/70 uppercase">
            Visa
          </span>
          <span className="text-[7px] text-[#1e1e40]/50 mt-0.5 uppercase tracking-wider">
            Entry Permit
          </span>
          <div className="mt-1 w-6 h-6 rounded-full border border-[#1e1e40]/25 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1e1e40]/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
