import GlobalBranchesLayout from "@/src/modules/global-branches/components/GlobalBranchesLayout";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Global Branches",
  description: "Our office locations and contact points around the world.",
  path: "/branch",
});

export default function BranchPage() {
  return <GlobalBranchesLayout />;
}
