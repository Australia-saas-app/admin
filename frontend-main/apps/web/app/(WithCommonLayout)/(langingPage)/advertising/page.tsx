import { InfoPageLayout } from "@/src/modules/info/components/InfoPageLayout";
import Link from "next/link";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Advertising Practices",
  description:
    "Transparent standards for promotions, listings, and partner advertising on our platform.",
  path: "/advertising",
});

export default function AdvertisingPage() {
  return (
    <InfoPageLayout
      title="Advertising Practices"
      subtitle="Transparent standards for promotions, listings, and partner advertising on our platform."
    >
      <h2>Our Commitment</h2>
      <p>
        All advertising and promoted listings must be accurate, lawful, and clearly identified.
        Misleading claims, counterfeit goods, and prohibited services are not permitted.
      </p>

      <h2>Business Listings</h2>
      <p>
        Businesses may promote services through the marketplace, courses, careers, and technical
        project listings. Each listing must include truthful pricing, scope, and contact details.
      </p>

      <h2>Affiliate & Partner Programs</h2>
      <p>
        Affiliate partners must disclose commission relationships where required by law. Rank and
        commission structures are documented in the{" "}
        <Link href="/affiliate/dashboard">affiliate dashboard</Link>.
      </p>

      <h2>Reporting Violations</h2>
      <p>
        Report suspicious advertising through the <Link href="/notice">notice board</Link> or
        contact your regional branch representative.
      </p>
    </InfoPageLayout>
  );
}
