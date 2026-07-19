import VisaCatalogLayout from "@/src/modules/visa/components/VisaCatalogLayout";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Visa Services",
  description: "Visa application support and processing for destinations worldwide.",
  path: "/visa",
});

export default function VisaCatalogPage() {
  return <VisaCatalogLayout />;
}
