import type { Metadata } from "next";
import AssociateDetails from "@/src/modules/associate/AssociateDetails";
import associatesDemo from "@/src/modules/associate/demoData";
import { RelatedAssociates } from "@/src/modules/associate/components/RelatedAssociates";
import { notFound } from "next/navigation";
import { buildMetadata, SITE_URL } from "@/src/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/src/shared/components/seo/JsonLd";
import { TrackView } from "@/src/shared/components/TrackView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const associate = associatesDemo.find((item) => item.id === id);
  if (!associate) return buildMetadata({ title: "Associate not found", noIndex: true });

  return buildMetadata({
    title: `${associate.name} – ${associate.category} Associate`,
    description:
      associate.description ||
      `${associate.name} (${associate.company}) — ${associate.category} associate on our platform.`,
    path: `/associate/${associate.id}`,
    image: associate.logo || undefined,
  });
}

const AssociateDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const associate = associatesDemo.find((item) => item.id === id);

  if (!associate) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 max-w-6xl mx-auto py-6 md:py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Associates", url: `${SITE_URL}/associate` },
          { name: associate.name, url: `${SITE_URL}/associate/${associate.id}` },
        ])}
      />
      <TrackView
        id={associate.id}
        type="associate"
        title={associate.name}
        href={`/associate/${associate.id}`}
        image={associate.logo}
      />
      <AssociateDetails associate={associate} />
      <RelatedAssociates current={associate} all={associatesDemo} />
    </main>
  );
};

export default AssociateDetailsPage;
