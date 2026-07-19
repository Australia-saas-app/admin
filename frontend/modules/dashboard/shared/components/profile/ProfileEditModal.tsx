"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import AppModal from "../AppModal";

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  initialLabel: string;
  initialEmail: string;
  scope?: "limited" | "full";
  onSave: (label: string, email: string) => void;
}

export default function ProfileEditModal({
  open,
  onClose,
  initialLabel,
  initialEmail,
  scope = "limited",
  onSave,
}: ProfileEditModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    if (open) {
      setLabel(initialLabel);
      setEmail(initialEmail);
    }
  }, [open, initialLabel, initialEmail]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Edit Profile"
      description={
        scope === "limited" ? "Update your public display information." : "Update account details."
      }
      size="sm"
      icon={<User className="h-5 w-5" />}
      footer={
        <button
          type="button"
          onClick={() => {
            onSave(label, email);
            onClose();
          }}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Save Changes
        </button>
      }
    >
      <div className="space-y-4">
        {scope === "limited" && (
          <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            You can update your display name and primary email. Identity and verification fields
            require admin approval.
          </p>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Account Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Primary Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>
    </AppModal>
  );
}
