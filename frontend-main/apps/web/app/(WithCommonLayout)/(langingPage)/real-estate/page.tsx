import RealEstateListings from "@/src/modules/real-estate/components/RealEstateListings";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Real Estate",
  description: "Residential and commercial property listings for sale and rent worldwide.",
  path: "/real-estate",
});

export default function RealEstatePage() {
  return <RealEstateListings />;
}
