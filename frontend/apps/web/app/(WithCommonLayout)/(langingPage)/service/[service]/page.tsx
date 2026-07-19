import type { Metadata } from "next";
import ServicePage from "@/src/modules/services/Components/ServicePage";
import { buildMetadata } from "@/src/lib/seo";

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const name = toTitle(service);
  return buildMetadata({
    title: `${name} Services`,
    description: `Explore ${name.toLowerCase()} services, providers, and offers on our global platform.`,
    path: `/service/${service}`,
  });
}

const Page = async ({ params }: { params: Promise<{ service: string }> }) => {
  const { service } = await params;
  return <ServicePage service={service} />;
};

export default Page;
