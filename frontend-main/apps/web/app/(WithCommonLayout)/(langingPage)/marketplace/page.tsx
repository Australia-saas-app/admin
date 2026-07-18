import MarketplacePage from "@/src/modules/marketplace/components/MarketplacePage";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Marketplace",
  description: "Browse products and services from verified sellers across our global marketplace.",
  path: "/marketplace",
});

const Page = () => {
  return <MarketplacePage />;
};

export default Page;
