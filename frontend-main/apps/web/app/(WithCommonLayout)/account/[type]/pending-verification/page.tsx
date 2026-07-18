"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldAlert, LogOut } from "lucide-react";
import { useUser } from "@/src/context/user.provider";
import { getVerificationByUserId } from "@/src/shared/lib/verification-store";
import { getUserIdFromAuthUser } from "@/src/shared/lib/demo-user";
import { isProfileComplete, completeProfilePath } from "@/src/shared/lib/profile-completion";
import { logout } from "@/src/server/AuthService";

type AccountType = "user" | "affiliate" | "business";

export default function PendingVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const accountType = (params.type as AccountType) || "user";
  const { user, isLoading } = useUser();
  const [status, setStatus] = useState("Pending");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/account/${accountType}/login`);
      return;
    }
    const userId = getUserIdFromAuthUser(user);
    if (!userId) return;
    if (userId.startsWith("registered-") && !isProfileComplete(userId)) {
      router.replace(completeProfilePath(accountType));
      return;
    }
    const verification = getVerificationByUserId(userId);
    if (verification?.status === "Approved") {
      router.replace(`/${accountType}/dashboard`);
      return;
    }
    setStatus(verification?.status ?? "Pending");
  }, [user, isLoading, accountType, router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Account under review</h1>
      <p className="mt-2 text-sm text-gray-500">
        Thanks for registering. An admin is reviewing your documents. You will get full dashboard
        access once approved.
      </p>
      <p className="mt-3 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
        Status: {status}
      </p>
      <button
        type="button"
        disabled={loggingOut}
        onClick={async () => {
          setLoggingOut(true);
          try {
            await logout();
          } finally {
            window.location.href = `/account/${accountType}/login`;
          }
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
