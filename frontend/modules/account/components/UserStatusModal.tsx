"use client";

import type React from "react";
import { AlertCircle, Clock, ShieldAlert, Ban, PowerOff } from "lucide-react";

export type UserStatus = "pending" | "suspended" | "dormant" | "blocked" | "closed";

interface UserStatusModalProps {
  status: UserStatus | null;
  onClose: () => void;
}

const STATUS_CONTENT: Record<UserStatus, { title: string; description: string; icon: React.ReactNode; color: string }> = {
  pending: {
    title: "Account Pending Approval",
    description: "Your account has been created successfully but is currently pending administrative approval. You will be notified once your account is active.",
    icon: <Clock className="w-6 h-6 text-amber-600 dark:text-amber-500" />,
    color: "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-500",
  },
  suspended: {
    title: "Account Suspended",
    description: "Your account has been temporarily suspended. Please contact support for more information regarding the suspension and steps to restore access.",
    icon: <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-500" />,
    color: "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-500",
  },
  dormant: {
    title: "Account Dormant",
    description: "Your account has been marked as dormant due to inactivity. Please reach out to our support team to reactivate your account.",
    icon: <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-500" />,
    color: "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-500",
  },
  blocked: {
    title: "Account Blocked",
    description: "Your account has been blocked due to policy violations. If you believe this is an error, please contact customer support immediately.",
    icon: <Ban className="w-6 h-6 text-red-600 dark:text-red-500" />,
    color: "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-500",
  },
  closed: {
    title: "Account Closed",
    description: "This account has been closed. You can no longer access the platform with these credentials.",
    icon: <PowerOff className="w-6 h-6 text-gray-600 dark:text-gray-400" />,
    color: "bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-400",
  },
};

export function UserStatusModal({ status, onClose }: UserStatusModalProps) {
  if (!status) return null;

  const content = STATUS_CONTENT[status];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 rounded-2xl overflow-hidden">
      {/* Blurred backdrop within the card */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-2xl" />

      {/* Background click to close */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-card/95 backdrop-blur animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${content.color}`}>
            {content.icon}
          </div>
          <h4 className="text-xl font-bold text-foreground">{content.title}</h4>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {content.description}
        </p>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}

