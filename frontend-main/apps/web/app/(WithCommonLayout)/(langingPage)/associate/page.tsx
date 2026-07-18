import AssociateLayout from "@/src/modules/associate/AssociateLayout";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Associates",
  description: "Find verified business associates and partners across every service category.",
  path: "/associate",
});

export default function AssociatePage() {
  return <AssociateLayout />;
}
