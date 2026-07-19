import TransportPage from "@/src/modules/transport/components/TransportPage";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Transport",
  description: "Logistics, shipping, and transport services for cargo and passengers.",
  path: "/transport",
});

const Page = () => {
  return <TransportPage />;
};

export default Page;
