import VisaTravelListings from "@/src/modules/visa/components/VisaTravelListings";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Visa & Travel",
  description: "Travel packages, visa assistance, and destination guides from trusted partners.",
  path: "/visa-travel",
});

export default function VisaTravelPage() {
  return <VisaTravelListings />;
}
