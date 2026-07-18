import { AlertTriangle } from "lucide-react";
import { isFeatureEnabled } from "@/src/lib/feature-flags";

/**
 * Site-wide maintenance notice, controlled by the `maintenance_mode` feature
 * flag (NEXT_PUBLIC_ENABLE_FEATURE_FLAGS=maintenance_mode). Renders nothing
 * when the flag is off.
 */
export function MaintenanceBanner() {
  if (!isFeatureEnabled("maintenance_mode")) return null;

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 bg-amber-500/15 px-4 py-2.5 text-center text-sm font-medium text-amber-700 dark:text-amber-400"
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      Scheduled maintenance in progress — some features may be temporarily unavailable.
    </div>
  );
}

export default MaintenanceBanner;
