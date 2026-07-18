"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OnboardingFlow } from "@/src/modules/account/components/onboarding-flow";
import { createVerificationFromSignup } from "@/src/shared/lib/verification-store";
import { useUser } from "@/src/context/user.provider";
import {
  isProfileComplete,
  markProfileComplete,
  profileOverridesFromOnboarding,
  type ProfileAccountType,
} from "@/src/shared/lib/profile-completion";
import { getUserIdFromAuthUser } from "@/src/shared/lib/demo-user";
import { saveProfileOverrides } from "@/src/shared/utils/profile-storage";

const ROLE_LABEL = {
  user: "User",
  affiliate: "Affiliate",
  business: "Business",
} as const;

interface CompleteProfilePageProps {
  accountType: ProfileAccountType;
}

export default function CompleteProfilePage({ accountType }: CompleteProfilePageProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const userId = getUserIdFromAuthUser(user);
    if (!userId) {
      router.replace(`/account/${accountType}/login`);
      return;
    }
    if (isProfileComplete(userId)) {
      router.replace(`/account/${accountType}/pending-verification`);
      return;
    }
    setReady(true);
  }, [accountType, isLoading, router, user]);

  const handleComplete = async (data: Record<string, unknown>) => {
    const userId = getUserIdFromAuthUser(user);
    if (!userId) {
      throw new Error("Session expired. Please sign in again.");
    }

    markProfileComplete(userId, accountType, data);
    saveProfileOverrides(userId, profileOverridesFromOnboarding(data));

    createVerificationFromSignup({
      userId,
      name: String(
        data.fullName ?? data.businessName ?? data.brandName ?? user?.email ?? "New account"
      ),
      email: String(user?.email ?? data.email ?? data.businessEmail ?? ""),
      role: ROLE_LABEL[accountType],
    });

    toast.success("Profile saved. Your account is queued for admin review.");
    router.push(`/account/${accountType}/pending-verification`);
  };

  if (isLoading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-2">
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm font-medium text-[#3d516e]">
          Complete your {accountType === "business" ? "business" : accountType} profile to unlock
          wallet, promotions, and other work features. You can update details later from Profile.
        </p>
      </div>
      <OnboardingFlow
        accountType={accountType}
        mode="complete-profile"
        embedded
        onNext={handleComplete}
      />
    </div>
  );
}
