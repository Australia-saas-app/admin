"use client";

import { useState } from "react";
import { AlertTriangle, Archive, Trash2 } from "lucide-react";
import AppModal from "./AppModal";

export type ConfirmVariant = "danger" | "warning" | "neutral";

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  itemName?: string;
}

const VARIANT_STYLES: Record<
  ConfirmVariant,
  { icon: typeof Trash2; iconBg: string; iconColor: string; button: string }
> = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
  },
  warning: {
    icon: Archive,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500",
  },
  neutral: {
    icon: AlertTriangle,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    button: "bg-primary hover:bg-primary/90 focus-visible:ring-primary",
  },
};

export default function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  itemName,
}: ConfirmActionModalProps) {
  const [loading, setLoading] = useState(false);
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 ${styles.button}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
          <Icon className={`h-6 w-6 ${styles.iconColor}`} />
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
        {itemName && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
            {itemName}
          </div>
        )}
        {variant === "danger" && (
          <p className="text-xs text-red-600">This action cannot be undone.</p>
        )}
      </div>
    </AppModal>
  );
}
