import TechnicalPageLayout from "@/src/modules/technical/components/TechnicalPageLayout";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Technical Projects",
  description: "Browse and post technical projects — engineering, IT, and maritime services.",
  path: "/technical",
});

export default function TechnicalPage() {
  return <TechnicalPageLayout />;
}
