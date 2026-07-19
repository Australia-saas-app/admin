type AgentAvatarProps = {
  name?: string;
  size?: number;
  className?: string;
};

export function AgentAvatar({ name = "Support", size = 40, className = "" }: AgentAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F6B5C] to-[#148F7A] font-semibold text-white shadow-sm ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.34) }}
      aria-hidden
    >
      {initials || "S"}
    </div>
  );
}
