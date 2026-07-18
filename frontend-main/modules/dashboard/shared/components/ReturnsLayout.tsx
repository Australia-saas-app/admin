"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import AppModal from "./AppModal";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useUser } from "@/src/context/user.provider";
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account";
import {
  DEMO_RETURNS,
  getReturnsForUser,
  submitOrderReturn,
  type OrderReturnRecord,
  type ReturnMethod,
} from "@/src/shared/lib/returns-store";

function identity(user: NonNullable<ReturnType<typeof useUser>["user"]>) {
  const id = "id" in user && user.id ? String(user.id) : (user.email ?? "guest");
  const name =
    "firstName" in user && user.firstName
      ? `${user.firstName} ${"lastName" in user && user.lastName ? user.lastName : ""}`.trim()
      : "name" in user && user.name
        ? String(user.name)
        : (user.email ?? "Account");
  return { id, name };
}

const METHODS: ReturnMethod[] = ["Pickup", "Drop-off", "Mail", "Wallet credit"];

export default function ReturnsLayout() {
  const { user } = useUser();
  const { userId, isDemo, isReady } = useIsDemoAccount();
  const [rows, setRows] = useState<OrderReturnRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<ReturnMethod>("Pickup");
  const [reason, setReason] = useState("");

  const refresh = () => {
    if (!userId) return;
    const stored = getReturnsForUser(userId);
    const demo = isDemo ? DEMO_RETURNS.map((r) => ({ ...r, userId, userName: "Demo" })) : [];
    const ids = new Set(stored.map((r) => r.id));
    setRows([...stored, ...demo.filter((r) => !ids.has(r.id))]);
  };

  useEffect(() => {
    if (!isReady) return;
    refresh();
  }, [isReady, userId, isDemo]);

  const stats = useMemo(() => {
    const pending = rows.filter((r) => r.status === "Pending").length;
    const completed = rows.filter((r) => r.status === "Completed").length;
    const ineligible = rows.filter((r) => r.status === "Ineligible").length;
    const total = rows.reduce(
      (acc, r) => acc + (parseFloat(r.amount.replace(/[^0-9.]/g, "")) || 0),
      0
    );
    return { pending, completed, ineligible, total };
  }, [rows]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Sign in required");
    const value = parseFloat(amount);
    if (!orderId.trim()) return toast.error("Order ID is required");
    if (!value || value <= 0) return toast.error("Enter a valid amount");
    if (!reason.trim()) return toast.error("Add a return reason");
    const { id, name } = identity(user);
    submitOrderReturn({
      userId: id,
      userName: name,
      orderId: orderId.trim(),
      amount: value,
      method,
      reason: reason.trim(),
    });
    setOpen(false);
    setOrderId("");
    setAmount("");
    setReason("");
    refresh();
    toast.success("Return request submitted.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Returns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Request a return, choose a method, and track pending or completed return amounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          New return
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total pending return", value: String(stats.pending) },
          { label: "Total return amount", value: `$${stats.total.toFixed(2)}` },
          { label: "Completed", value: String(stats.completed) },
          { label: "Ineligible", value: String(stats.ineligible) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Return ID</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6">
                  <EmptyState
                    icon={<RotateCcw className="h-8 w-8" />}
                    title="No returns yet"
                    description="Create one from a completed order."
                  />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border/70">
                  <td className="px-4 py-3 font-medium">{row.id}</td>
                  <td className="px-4 py-3">{row.orderId}</td>
                  <td className="px-4 py-3">{row.method}</td>
                  <td className="px-4 py-3 font-semibold">{row.amount}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AppModal open={open} onClose={() => setOpen(false)} title="Request a return" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="#504"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Return amount (USD)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="120.00"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Return method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as ReturnMethod)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[88px] w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Damaged item, wrong size…"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            Submit return
          </button>
        </form>
      </AppModal>
    </div>
  );
}
