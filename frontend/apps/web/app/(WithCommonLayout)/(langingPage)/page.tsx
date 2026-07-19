import type { Metadata } from "next";
import HomePageLayout from "@/src/modules/home/components/homePageLayout";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description:
    "Discover maritime services, marketplace listings, associates, visas, courses, and professional tools in one platform.",
  path: "/",
});

const Page = () => {
  return <HomePageLayout />;
};

export default Page;
