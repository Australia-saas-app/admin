"use client";

import React, { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import Modal from "@/src/components/ui/modal";
import { Button } from "@/src/components/ui/button";

const VERIFY_OPTIONS = [
  { value: "abc@gmail.com", label: "abc@gmail.com" },
  { value: "+4415426250", label: "+4415426250" },
  { value: "jack.secondary@gmail.com", label: "jack.secondary@gmail.com" },
];

const AccountSecurityLayout: React.FC<{ basePath?: string }> = () => {
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState(VERIFY_OPTIONS[0].value);
  const [modalAction, setModalAction] = useState<"on" | "off" | null>(null);

  const openConfirm = (action: "on" | "off") => {
    if (action === "off" && !enabled) return;
    if (action === "on" && enabled) return;
    setModalAction(action);
  };

  const doTurnOff = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setEnabled(false);
    setSaving(false);
    setModalAction(null);
  };

  const doTurnOn = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setEnabled(true);
    setSaving(false);
    setModalAction(null);
  };

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
            <Shield className="h-14 w-14 stroke-[1.5] text-gray-900" strokeWidth={1.25} />
          </div>

          <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
          <p className="mx-auto mt-2 mb-6 max-w-xs text-sm text-gray-500">
            Select the phone number or email you want to verify the OTP on
          </p>

          <div className="relative mb-8 text-left">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-800 outline-none focus:border-primary"
            >
              {VERIFY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <span className="text-sm font-medium text-gray-600">
              {enabled ? "Disable 2FA" : "Enable 2FA"}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openConfirm("off")}
                className={`min-w-[3rem] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  !enabled ? "bg-[#eef1f5] text-gray-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                OFF
              </button>
              <button
                type="button"
                onClick={() => openConfirm("on")}
                className={`min-w-[3rem] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  enabled
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#eef1f5] text-gray-600 hover:bg-[#e4e8ee]"
                }`}
              >
                ON
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalAction !== null}
        onClose={() => setModalAction(null)}
        title={
          modalAction === "off" ? "Turn off 2-step Verification" : "Enable 2-step Verification"
        }
        size="sm"
      >
        <div className="mb-4 text-sm text-slate-700">
          {modalAction === "off" ? (
            <>
              Turning off 2-step verification will remove the extra security on your account. Are
              you sure you want to continue?
            </>
          ) : (
            <>
              Enabling 2-step verification will add an extra layer of security to your account. Do
              you want to enable it now?
            </>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalAction(null)}>
            Cancel
          </Button>
          {modalAction === "off" ? (
            <Button className="bg-rose-600 text-white" onClick={doTurnOff} disabled={saving}>
              {saving ? "Turning off..." : "Turn off"}
            </Button>
          ) : (
            <Button onClick={doTurnOn} disabled={saving}>
              {saving ? "Turning on..." : "Turn on"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountSecurityLayout;
